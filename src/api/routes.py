"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Usuario, Venta, Gasto, FacturaAlbaran, Proveedor, MargenObjetivo, Restaurante
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, func, extract, desc,text
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, decode_token
from werkzeug.security import generate_password_hash, check_password_hash
from api.mail.mailer import send_reset_email
import json
import traceback
from api.email_utils import send_email
from datetime import datetime, timedelta, date
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import random
import unicodedata
from calendar import monthrange



api = Blueprint('api', __name__)

def send_email(to_email, subject, html_content):
    """
    Envía un correo utilizando SendGrid.
    - Usa EMAIL_SENDER como remitente desde .env
    - Usa SENDGRID_API_KEY para autenticación
    """

    try:
        message = Mail(
            from_email=os.getenv("EMAIL_SENDER", "OhMyChef <ohmychefapp@gmail.com>"),
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )

        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)

        print(f"✅ Correo enviado a {to_email}")
        return True

    except Exception as e:
        print("❌ Error al enviar correo:", str(e))
        return False

def notificar_admin_sobre_evento(tipo, datos):
    subject = ""
    html_content = ""

    if tipo == "venta":
        subject = f"Nueva venta registrada en {datos['restaurante']}"
        html_content = f"""
        <h4>📥 Venta registrada:</h4>
        <ul>
            <li><strong>Restaurante:</strong> {datos['restaurante']}</li>
            <li><strong>Monto:</strong> {datos['monto']}€</li>
            <li><strong>Turno:</strong> {datos['turno']}</li>
            <li><strong>Fecha:</strong> {datos['fecha']}</li>
            <li><strong>Usuario:</strong> {datos['usuario']}</li>
        </ul>
        """

    elif tipo == "gasto":
        subject = f"Nuevo gasto registrado en {datos['restaurante']}"
        html_content = f"""
        <h4>📤 Gasto registrado:</h4>
        <ul>
            <li><strong>Restaurante:</strong> {datos['restaurante']}</li>
            <li><strong>Proveedor:</strong> {datos['proveedor']}</li>
            <li><strong>Categoría:</strong> {datos.get('categoria', 'Sin categoría')}</li>
            <li><strong>Monto:</strong> {datos['monto']}€</li>
            <li><strong>Fecha:</strong> {datos['fecha']}</li>
            <li><strong>Usuario:</strong> {datos['usuario']}</li>
        </ul>
        """

    admin_email = os.getenv("EMAIL_ADMIN", "admin@ohmychef.com")
    send_email(admin_email, subject, html_content)




@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        email = data.get('email')
        if not email:
            return jsonify({'success': False, 'msg': 'Correo requerido'}), 400
        user = Usuario.query.filter_by(email=email).first()
        if not user:
            return jsonify({'success': False, 'msg': 'Correo no registrado'}), 404
        token = create_access_token(identity=str(user.id))
        result = send_reset_email(email, token)
        if result['success']:
            return jsonify({'success': True, 'msg': 'Revisa tu correo electrónico', 'token': token}), 200
        else:
            return jsonify({'success': False, 'msg': result['msg']}), 500
    except Exception as e:
        print(":x: Error en forgot-password:", str(e))
        return jsonify({'success': False, 'msg': str(e)}), 500


@api.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        token = data.get("token")
        new_password = data.get("new_password")
        if not token or not new_password:
            return jsonify({"msg": "Faltan datos"}), 400
        # DEBUG: Verificamos el contenido del token
        try:
            print("TOKEN RECIBIDO:", token)
            decoded = decode_token(token)
            print("TOKEN DECODIFICADO:", decoded)
            user_id = decoded["sub"]
        except Exception as e:
            print("ERROR AL DECODIFICAR TOKEN:", str(e))
            return jsonify({"msg": "Token inválido o expirado"}), 401
        user = db.session.get(Usuario, user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        user.password = generate_password_hash(new_password)
        db.session.commit()
        return jsonify({"msg": "Contraseña actualizada correctamente"}), 200
    except Exception as e:
        print("ERROR GENERAL:", str(e))
        return jsonify({"msg": "Error al cambiar contraseña", "error": str(e)}), 500


@api.route('/usuarios', methods=['GET'])
@jwt_required()
def get_usuarios():
    usuarios = Usuario.query.all()

    resultados = []
    for u in usuarios:
        resultados.append({
            "id": u.id,
            "nombre": u.nombre,
            "email": u.email,
            "rol": u.rol,
            "status": u.status,
            "restaurante_id": u.restaurante_id,
            "restaurante_nombre": u.restaurante.nombre if u.restaurante else None
        })

    return jsonify(resultados), 200


@api.route("/register", methods=["POST"])
@jwt_required(optional=True)
def register():
    try:
        data = request.json

        if not data.get("email") or not data.get("password") or not data.get("rol") or not data.get("nombre"):
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        total_users = db.session.scalar(select(func.count()).select_from(Usuario))
        current_user_id = get_jwt_identity()

        if total_users > 0:
            if not current_user_id:
                return jsonify({"error": "No autorizado"}), 403
            current_user = db.session.get(Usuario, current_user_id)
            if not current_user or current_user.rol != "admin":
                return jsonify({"error": "Solo el admin puede crear usuarios"}), 403

        if data["rol"] in ["chef", "encargado"] and not data.get("restaurante_id"):
            return jsonify({"error": "Chef o encargado debe tener restaurante asignado"}), 400

        existing_user = db.session.scalar(
            select(Usuario).where(Usuario.email == data["email"]))
        if existing_user:
            return jsonify({"error": "Email ya registrado"}), 409

        # Guardamos la contraseña en texto plano para el correo
        raw_password = data["password"]
        hashed_password = generate_password_hash(raw_password)
        status = data.get("status", "active")

        new_user = Usuario(
            nombre=data["nombre"],
            email=data["email"],
            password=hashed_password,
            rol=data["rol"],
            status=status,
            restaurante_id=data.get("restaurante_id")
        )
        db.session.add(new_user)
        db.session.commit()

        # 📬 Enviar correo con SendGrid
        from api.email_utils import send_email

        subject = "Bienvenido a OhMyChef!"
        html_content = f"""
        <h3>Hola {data['nombre']},</h3>

        <p>Tu cuenta en <strong>OhMyChef!</strong> ha sido creada exitosamente. Aquí tienes tus datos de acceso:</p>

        <ul>
          <li><strong>Rol:</strong> {data['rol']}</li>
          <li><strong>Email:</strong> {data['email']}</li>
          <li><strong>Contraseña:</strong> {raw_password}</li>
        </ul>

       
        <p>🛡️ Por seguridad, te recomendamos cambiar esta contraseña tras el primer ingreso.</p>

        <p>📩 Si tienes alguna pregunta, contáctanos en 
        <a href="mailto:soporte@ohmychef.com">soporte@ohmychef.com</a></p>

        <p><strong>Equipo OhMyChef</strong></p>
        <p style="font-size:0.8em;color:gray;"><em>Este mensaje ha sido generado automáticamente. No respondas a este correo.</em></p>
        """

        send_email(to_email=data["email"], subject=subject, html_content=html_content)

        return jsonify({"msg": "Usuario creado correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al registrar", "detalle": str(e)}), 500


@api.route('/usuarios/<int:id>', methods=['GET'])
@jwt_required()
def obtener_usuario(id):
    usuario = Usuario.query.get(id)

    if usuario is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    resultado = {
        "id": usuario.id,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "rol": usuario.rol,
        "status": usuario.status,  # ✅ Añadido
        "restaurante_id": usuario.restaurante_id,
        "restaurante_nombre": usuario.restaurante.nombre if usuario.restaurante else None  # ✅ Añadido
    }

    return jsonify(resultado), 200


@api.route('/usuarios/<int:id>', methods=['PUT'])
@jwt_required()
def editar_usuario(id):
    try:
        data = request.json
        current_user_id = get_jwt_identity()
        current_user = db.session.get(Usuario, current_user_id)

        if not current_user or current_user.rol != "admin":
            return jsonify({"error": "Solo el admin puede actualizar usuarios"}), 403

        user_to_update = db.session.get(Usuario, id)
        if not user_to_update:
            return jsonify({"error": "Usuario no encontrado"}), 404

        user_to_update.nombre = data.get("nombre", user_to_update.nombre)
        user_to_update.email = data.get("email", user_to_update.email)

        if data.get("password"):
            user_to_update.password = generate_password_hash(data["password"])

        new_rol = data.get("rol", user_to_update.rol)
        if new_rol == "admin":
            existing_admin = db.session.scalar(
                select(Usuario).where(Usuario.rol == "admin"))
            if existing_admin and existing_admin.id != user_to_update.id:
                return jsonify({"error": "Ya existe un administrador en el sistema."}), 400
        user_to_update.rol = new_rol

        if user_to_update.rol in ["chef", "encargado"] and not data.get("restaurante_id"):
            return jsonify({"error": "Chef o encargado debe tener restaurante asignado"}), 400

        user_to_update.restaurante_id = data.get(
            "restaurante_id", user_to_update.restaurante_id) if user_to_update.rol != "admin" else None

        user_to_update.status = data.get("status", user_to_update.status)

        db.session.commit()
        return jsonify(user_to_update.serialize()), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar usuario", "detalle": str(e)}), 500


@api.route('/usuarios/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_usuario(id):
    try:
        current_user_id = get_jwt_identity()
        current_user = db.session.get(Usuario, current_user_id)

        if not current_user or current_user.rol != "admin":
            return jsonify({"error": "Solo el admin puede eliminar usuarios"}), 403

        user_to_delete = db.session.get(
            Usuario, id)
        if not user_to_delete:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if user_to_delete.id == current_user_id:
            return jsonify({"error": "No puedes eliminar tu propia cuenta de administrador"}), 400

        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({"msg": "Usuario eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar usuario", "detalle": str(e)}), 500


@api.route('/ventas', methods=['GET'])
@jwt_required()
def get_ventas():
    ventas = Venta.query.all()

    resultados = []
    for v in ventas:
        resultados.append({
            "id": v.id,
            "fecha": v.fecha.isoformat(),
            "monto": v.monto,
            "turno": v.turno,
            "restaurante_id": v.restaurante_id
        })

    return jsonify(resultados), 200

    # AUTENTCACION JWT - AUTENTCACION JWT - AUTENTCACION JWT- AUTENTCACION JWT - AUTENTCACION JWT - AUTENTCACION JWT
    # - AUTENTCACION JWT - AUTENTCACION JWT - AUTENTCACION JWT - AUTENTCACION JWT


@api.route("/login", methods=["POST"])
def login():
    try:
        data = request.json

        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Faltan datos"}), 400

        stm = select(Usuario).where(Usuario.email == data["email"])
        user = db.session.execute(stm).scalar()

        if not user:
            return jsonify({"error": "Email no encontrado"}), 404

        if not check_password_hash(user.password, data["password"]):
            return jsonify({"success": False, "msg": "Email o contraseña incorrectos"}), 401

        token = create_access_token(identity=str(user.id))

        data = user.serialize()

        if user.restaurante_id:
            restaurante = db.session.get(Restaurante, user.restaurante_id)
            if restaurante:
                data["restaurante_nombre"] = restaurante.nombre

        return jsonify({
            "access_token": token,
            "user": data
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@api.route('/ventas', methods=['POST'])
@jwt_required()
def crear_venta():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    fecha = data.get("fecha")
    monto = data.get("monto")
    turno = data.get("turno")
    restaurante_id = data.get("restaurante_id")

    if not fecha or not monto or not restaurante_id:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    try:
        # Validar duplicados por fecha, turno y restaurante
        venta_existente = db.session.query(Venta).filter_by(
            fecha=fecha,
            turno=turno,
            restaurante_id=restaurante_id
        ).first()

        if venta_existente:
            return jsonify({"msg": "Ya existe una venta para este día y turno"}), 409

        nueva_venta = Venta(
            fecha=fecha,
            monto=monto,
            turno=turno,
            restaurante_id=restaurante_id
        )
        db.session.add(nueva_venta)
        db.session.commit()

        # 📨 Notificación protegida
        try:
            restaurante = Restaurante.query.get(restaurante_id)
            usuario = Usuario.query.get(get_jwt_identity())

            print("✅ Venta registrada correctamente:")
            print("  Restaurante:", restaurante.nombre if restaurante else "Desconocido")
            print("  Usuario:", usuario.nombre if usuario else "Sistema")

            notificar_admin_sobre_evento("venta", {
                "restaurante": restaurante.nombre if restaurante else "Desconocido",
                "monto": monto,
                "turno": turno,
                "fecha": fecha,
                "usuario": usuario.nombre if usuario else "Sistema"
            })
        except Exception as e:
            print("⚠️ Error al notificar al admin:", str(e))

        return jsonify({"msg": "Venta creada correctamente"}), 201

    except Exception as e:
        db.session.rollback()
        print("❌ ERROR en /ventas:", str(e))
        return jsonify({"msg": "Error al crear la venta", "error": str(e)}), 500



@api.route('/ventas/<int:id>', methods=['GET'])
@jwt_required()
def obtener_venta(id):
    venta = Venta.query.get(id)

    if venta is None:
        return jsonify({"msg": "Venta no encontrada"}), 404

    resultado = {
        "id": venta.id,
        "fecha": venta.fecha.isoformat(),
        "monto": venta.monto,
        "turno": venta.turno,
        "restaurante_id": venta.restaurante_id
    }

    return jsonify(resultado), 200


@api.route('/ventas/<int:id>', methods=['PUT'])
@jwt_required()
def editar_venta(id):
    venta = Venta.query.get(id)

    if venta is None:
        return jsonify({"msg": "Venta no encontrada"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    venta.fecha = data.get("fecha", venta.fecha)
    venta.monto = data.get("monto", venta.monto)
    venta.turno = data.get("turno", venta.turno)
    venta.restaurante_id = data.get("restaurante_id", venta.restaurante_id)

    try:
        db.session.commit()
        return jsonify({"msg": "Venta actualizada"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar la venta", "error": str(e)}), 500


@api.route('/ventas/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_venta(id):
    venta = Venta.query.get(id)

    if venta is None:
        return jsonify({"msg": "Venta no encontrada"}), 404

    try:
        db.session.delete(venta)
        db.session.commit()
        return jsonify({"msg": "Venta eliminada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar la venta", "error": str(e)}), 500


@api.route('/gastos', methods=['GET'])
@jwt_required()
def get_gastos():
    gastos = Gasto.query.all()

    resultados = []
    for g in gastos:
        resultados.append({
            "id": g.id,
            "fecha": g.fecha.isoformat(),
            "monto": g.monto,
            "categoria": g.categoria,
            "proveedor_id": g.proveedor_id,
            "usuario_id": g.usuario_id,
            "restaurante_id": g.restaurante_id,
            "nota": g.nota,
            "archivo_adjunto": g.archivo_adjunto
        })

    return jsonify(resultados), 200


@api.route('/gastos', methods=['POST'])
@jwt_required()
def crear_gasto():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    if isinstance(data, list):
        try:
            for g in data:
                if not g.get("fecha") or not g.get("monto") or not g.get("proveedor_id") or not g.get("usuario_id") or not g.get("restaurante_id"):
                    return jsonify({"msg": "Faltan campos obligatorios en uno de los gastos"}), 400

                nuevo_gasto = Gasto(
                    fecha=g["fecha"],
                    monto=g["monto"],
                    categoria=g.get("categoria"),
                    proveedor_id=g["proveedor_id"],
                    usuario_id=g["usuario_id"],
                    restaurante_id=g["restaurante_id"],
                    nota=g.get("nota"),
                    archivo_adjunto=g.get("archivo_adjunto")
                )
                db.session.add(nuevo_gasto)

                # 📨 Notificación individual
                try:
                    restaurante = Restaurante.query.get(g["restaurante_id"])
                    usuario = Usuario.query.get(g["usuario_id"])
                    proveedor = Proveedor.query.get(g["proveedor_id"])

                    print("📤 Gasto lote:", g["monto"], "→", restaurante.nombre)

                    notificar_admin_sobre_evento("gasto", {
                        "restaurante": restaurante.nombre if restaurante else "Desconocido",
                        "proveedor": proveedor.nombre if proveedor else "Sin proveedor",
                        "categoria": g.get("categoria"),
                        "monto": g["monto"],
                        "fecha": g["fecha"],
                        "usuario": usuario.nombre if usuario else "Sistema"
                    })
                except Exception as error_envio:
                    print("❌ Error al enviar notificación del gasto (lote):", str(error_envio))

            db.session.commit()
            return jsonify({"msg": "Gastos registrados correctamente"}), 201

        except Exception as e:
            db.session.rollback()
            print("❌ ERROR en gastos (lote):", str(e))
            return jsonify({"msg": "Error al registrar gastos", "error": str(e)}), 500

    else:
        fecha = data.get("fecha")
        monto = data.get("monto")
        categoria = data.get("categoria")
        proveedor_id = data.get("proveedor_id")
        usuario_id = data.get("usuario_id")
        restaurante_id = data.get("restaurante_id")
        nota = data.get("nota")
        archivo_adjunto = data.get("archivo_adjunto")

        if not fecha or not monto or not proveedor_id or not usuario_id or not restaurante_id:
            return jsonify({"msg": "Faltan campos obligatorios"}), 400

        try:
            nuevo_gasto = Gasto(
                fecha=fecha,
                monto=monto,
                categoria=categoria,
                proveedor_id=proveedor_id,
                usuario_id=usuario_id,
                restaurante_id=restaurante_id,
                nota=nota,
                archivo_adjunto=archivo_adjunto
            )
            db.session.add(nuevo_gasto)
            db.session.commit()

            # 📨 Notificación individual
            try:
                restaurante = Restaurante.query.get(restaurante_id)
                usuario = Usuario.query.get(usuario_id)
                proveedor = Proveedor.query.get(proveedor_id)

                print("📤 Gasto individual:", monto, "→", restaurante.nombre)
                print("✅ Gasto registrado como:", usuario.nombre if usuario else "Sistema")

                notificar_admin_sobre_evento("gasto", {
                    "restaurante": restaurante.nombre if restaurante else "Desconocido",
                    "proveedor": proveedor.nombre if proveedor else "Sin proveedor",
                    "categoria": categoria,
                    "monto": monto,
                    "fecha": fecha,
                    "usuario": usuario.nombre if usuario else "Sistema"
                })
            except Exception as error_envio:
                print("❌ Error al enviar notificación del gasto:", str(error_envio))

            return jsonify({"msg": "Gasto registrado correctamente"}), 201

        except Exception as e:
            db.session.rollback()
            print("❌ ERROR en gasto individual:", str(e))
            return jsonify({"msg": "Error al registrar el gasto", "error": str(e)}), 500




@api.route('/gastos/<int:id>', methods=['GET'])
@jwt_required()
def obtener_gasto(id):
    gasto = Gasto.query.get(id)

    if gasto is None:
        return jsonify({"msg": "Gasto no encontrado"}), 404

    resultado = {
        "id": gasto.id,
        "fecha": gasto.fecha.isoformat(),
        "monto": gasto.monto,
        "categoria": gasto.categoria,
        "proveedor_id": gasto.proveedor_id,
        "usuario_id": gasto.usuario_id,
        "restaurante_id": gasto.restaurante_id,
        "nota": gasto.nota,
        "archivo_adjunto": gasto.archivo_adjunto
    }

    return jsonify(resultado), 200


@api.route('/gastos/<int:id>', methods=['PUT'])
@jwt_required()
def editar_gasto(id):
    gasto = Gasto.query.get(id)

    if gasto is None:
        return jsonify({"msg": "Gasto no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    print("🛠️ Recibiendo para editar gasto:", data)

    gasto.fecha = data.get("fecha", gasto.fecha)
    gasto.monto = data.get("monto", gasto.monto)
    gasto.categoria = data.get("categoria", gasto.categoria)
    gasto.proveedor_id = data.get("proveedor_id", gasto.proveedor_id)
    gasto.usuario_id = data.get("usuario_id", gasto.usuario_id)
    gasto.restaurante_id = data.get("restaurante_id", gasto.restaurante_id)
    gasto.nota = data.get("nota", gasto.nota)
    gasto.archivo_adjunto = data.get("archivo_adjunto", gasto.archivo_adjunto)

    try:
        db.session.commit()
        print("✅ Gasto actualizado correctamente.")
        return jsonify({"msg": "Gasto actualizado"}), 200
    except Exception as e:
        db.session.rollback()
        print("❌ Error al actualizar gasto:", str(e))
        return jsonify({"msg": "Error al actualizar el gasto", "error": str(e)}), 500


@api.route('/gastos/usuario/<int:usuario_id>', methods=['DELETE'])
@jwt_required()
def eliminar_gastos_por_usuario(usuario_id):
    try:
        gastos = Gasto.query.filter_by(usuario_id=usuario_id).all()

        if not gastos:
            return jsonify({"msg": "No hay gastos asociados a este usuario"}), 404

        for gasto in gastos:
            db.session.delete(gasto)

        db.session.commit()
        return jsonify({"msg": f"{len(gastos)} gastos eliminados para el usuario {usuario_id}"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar los gastos", "error": str(e)}), 500


@api.route('/facturas', methods=['GET'])
@jwt_required()
def get_facturas():
    facturas = FacturaAlbaran.query.all()

    resultados = []
    for f in facturas:
        resultados.append({
            "id": f.id,
            "proveedor_id": f.proveedor_id,
            "restaurante_id": f.restaurante_id,
            "fecha": f.fecha.isoformat(),
            "monto": f.monto,
            "descripcion": f.descripcion
        })

    return jsonify(resultados), 200


@api.route('/facturas', methods=['POST'])
@jwt_required()
def crear_factura():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    proveedor_id = data.get("proveedor_id")
    restaurante_id = data.get("restaurante_id")
    fecha = data.get("fecha")
    monto = data.get("monto")
    descripcion = data.get("descripcion")

    if not proveedor_id or not restaurante_id or not fecha or not monto:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    try:
        nueva_factura = FacturaAlbaran(
            proveedor_id=proveedor_id,
            restaurante_id=restaurante_id,
            fecha=fecha,
            monto=monto,
            descripcion=descripcion
        )
        db.session.add(nueva_factura)
        db.session.commit()
        return jsonify({"msg": "Factura/Albarán registrado correctamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al registrar la factura", "error": str(e)}), 500


@api.route('/facturas/<int:id>', methods=['GET'])
@jwt_required()
def obtener_factura(id):
    factura = FacturaAlbaran.query.get(id)

    if factura is None:
        return jsonify({"msg": "Factura no encontrada"}), 404

    resultado = {
        "id": factura.id,
        "proveedor_id": factura.proveedor_id,
        "restaurante_id": factura.restaurante_id,
        "fecha": factura.fecha.isoformat(),
        "monto": factura.monto,
        "descripcion": factura.descripcion
    }

    return jsonify(resultado), 200


@api.route('/facturas/<int:id>', methods=['PUT'])
@jwt_required()
def editar_factura(id):
    factura = FacturaAlbaran.query.get(id)

    if factura is None:
        return jsonify({"msg": "Factura no encontrada"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    factura.proveedor_id = data.get("proveedor_id", factura.proveedor_id)
    factura.restaurante_id = data.get("restaurante_id", factura.restaurante_id)
    factura.fecha = data.get("fecha", factura.fecha)
    factura.monto = data.get("monto", factura.monto)
    factura.descripcion = data.get("descripcion", factura.descripcion)

    try:
        db.session.commit()
        return jsonify({"msg": "Factura actualizada"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar factura", "error": str(e)}), 500


@api.route('/facturas/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_factura(id):
    factura = FacturaAlbaran.query.get(id)

    if factura is None:
        return jsonify({"msg": "Factura no encontrada"}), 404

    try:
        db.session.delete(factura)
        db.session.commit()
        return jsonify({"msg": "Factura eliminada correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar factura", "error": str(e)}), 500


@api.route('/proveedores', methods=['GET'])
@jwt_required()
def get_proveedores():
    restaurante_id = request.args.get("restaurante_id", type=int)
    if restaurante_id:
        proveedores = Proveedor.query.filter_by(restaurante_id=restaurante_id).all()
    else:
        
        proveedores = Proveedor.query.all()
    resultados = [
        {
            "id": p.id,
            "nombre": p.nombre,
            "categoria": p.categoria,
            "restaurante_id": p.restaurante_id,
            "telefono": p.telefono,
            "direccion": p.direccion
        }
        for p in proveedores
    ]
    return jsonify(resultados), 200


@api.route('/proveedores', methods=['POST'])
@jwt_required()
def crear_proveedor():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    nombre = data.get("nombre")
    categoria = data.get("categoria")
    restaurante_id = data.get("restaurante_id")
    telefono = data.get("telefono")
    direccion = data.get("direccion")

    if not nombre or not restaurante_id:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    try:
        nuevo_proveedor = Proveedor(
            nombre=nombre,
            categoria=categoria,
            restaurante_id=restaurante_id,
            telefono=telefono,
            direccion=direccion,
        )
        db.session.add(nuevo_proveedor)
        db.session.commit()
        return jsonify({"msg": "Proveedor creado correctamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear proveedor", "error": str(e)}), 500


@api.route('/proveedores/<int:id>', methods=['GET'])
@jwt_required()
def obtener_proveedor(id):
    proveedor = Proveedor.query.get(id)

    if proveedor is None:
        return jsonify({"msg": "Proveedor no encontrado"}), 404

    resultado = {
        "id": proveedor.id,
        "nombre": proveedor.nombre,
        "categoria": proveedor.categoria,
        "restaurante_id": proveedor.restaurante_id,
        "telefono": proveedor.telefono,
        "direccion": proveedor.direccion
    }

    return jsonify(resultado), 200


@api.route('/proveedores/<int:id>', methods=['PUT'])
@jwt_required()
def editar_proveedor(id):
    proveedor = Proveedor.query.get(id)

    if proveedor is None:
        return jsonify({"msg": "Proveedor no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    proveedor.nombre = data.get("nombre", proveedor.nombre)
    proveedor.categoria = data.get("categoria", proveedor.categoria)
    proveedor.restaurante_id = data.get(
        "restaurante_id", proveedor.restaurante_id)
    proveedor.telefono = data.get("telefono", proveedor.telefono)
    proveedor.direccion = data.get("direccion", proveedor.direccion)

    try:
        db.session.commit()
        return jsonify({"msg": "Proveedor actualizado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar proveedor", "error": str(e)}), 500


@api.route('/proveedores/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_proveedor(id):
    proveedor = Proveedor.query.get(id)

    if proveedor is None:
        return jsonify({"msg": "Proveedor no encontrado"}), 404

    try:
        db.session.delete(proveedor)
        db.session.commit()
        return jsonify({"msg": "Proveedor eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar proveedor", "error": str(e)}), 500


@api.route('/margen', methods=['GET'])
@jwt_required()
def get_margen():
    margenes = MargenObjetivo.query.all()

    resultados = []
    for m in margenes:
        resultados.append({
            "id": m.id,
            "restaurante_id": m.restaurante_id,
            "porcentaje_min": m.porcentaje_min,
            "porcentaje_max": m.porcentaje_max
        })

    return jsonify(resultados), 200


@api.route('/margen', methods=['POST'])
@jwt_required()
def crear_margen():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    restaurante_id = data.get("restaurante_id")
    porcentaje_min = data.get("porcentaje_min")
    porcentaje_max = data.get("porcentaje_max")

    if not restaurante_id or porcentaje_min is None or porcentaje_max is None:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    try:
        nuevo_margen = MargenObjetivo(
            restaurante_id=restaurante_id,
            porcentaje_min=porcentaje_min,
            porcentaje_max=porcentaje_max
        )
        db.session.add(nuevo_margen)
        db.session.commit()
        return jsonify({"msg": "Margen creado correctamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear el margen", "error": str(e)}), 500


@api.route('/margen/<int:id>', methods=['GET'])
@jwt_required()
def obtener_margen(id):
    margen = MargenObjetivo.query.get(id)

    if margen is None:
        return jsonify({"msg": "Margen no encontrado"}), 404

    resultado = {
        "id": margen.id,
        "restaurante_id": margen.restaurante_id,
        "porcentaje_min": margen.porcentaje_min,
        "porcentaje_max": margen.porcentaje_max
    }

    return jsonify(resultado), 200


@api.route('/margen/<int:id>', methods=['PUT'])
@jwt_required()
def editar_margen(id):
    margen = MargenObjetivo.query.get(id)

    if margen is None:
        return jsonify({"msg": "Margen no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    margen.restaurante_id = data.get("restaurante_id", margen.restaurante_id)
    margen.porcentaje_min = data.get("porcentaje_min", margen.porcentaje_min)
    margen.porcentaje_max = data.get("porcentaje_max", margen.porcentaje_max)

    try:
        db.session.commit()
        return jsonify({"msg": "Margen actualizado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar margen", "error": str(e)}), 500


@api.route('/margen/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_margen(id):
    margen = MargenObjetivo.query.get(id)

    if margen is None:
        return jsonify({"msg": "Margen no encontrado"}), 404

    try:
        db.session.delete(margen)
        db.session.commit()
        return jsonify({"msg": "Margen eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar margen", "error": str(e)}), 500


@api.route('/restaurantes', methods=['GET'])
@jwt_required()
def get_restaurantes():
    restaurantes = Restaurante.query.all()
    resultados = []
    for r in restaurantes:
        resultados.append({
            "id": r.id,
            "nombre": r.nombre,
            "direccion": r.direccion,
            "email_contacto": r.email_contacto,
            "telefono": r.telefono,
            "usuarios": [{
                "nombre": u.nombre,
                "id": u.id,
                "rol": u.rol
            }
                for u in r.usuarios
            ]
            # "usuarios": [u.serialize() for u in r.usuarios]
        })

    return jsonify(resultados), 200


@api.route('/restaurantes', methods=['POST'])
@jwt_required()
def crear_restaurante():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    nombre = data.get("nombre")
    direccion = data.get("direccion")
    email_contacto = data.get("email_contacto")
    telefono = data.get("telefono")

    if not nombre:
        return jsonify({"msg": "El campo 'nombre' es obligatorio"}), 400

    try:
        nuevo = Restaurante(
            nombre=nombre,
            direccion=direccion,
            email_contacto=email_contacto,
            telefono=telefono
        )
        db.session.add(nuevo)
        db.session.commit()
        return jsonify({
            "msg": "Restaurante creado correctamente",
            "nuevo": nuevo.serialize()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear el restaurante", "error": str(e)}), 500


@api.route('/restaurantes/<int:id>', methods=['GET'])
@jwt_required()
def obtener_restaurante(id):
    restaurante = Restaurante.query.get(id)

    if restaurante is None:
        return jsonify({"msg": "Restaurante no encontrado"}), 404

    resultado = {
        "id": restaurante.id,
        "nombre": restaurante.nombre,
        "direccion": restaurante.direccion,
        "email_contacto": restaurante.email_contacto
    }

    return jsonify(resultado), 200


@api.route('/restaurantes/<int:id>', methods=['PUT'])
@jwt_required()
def editar_restaurante(id):
    restaurante = Restaurante.query.get(id)

    if restaurante is None:
        return jsonify({"msg": "Restaurante no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    restaurante.nombre = data.get("nombre", restaurante.nombre)
    restaurante.direccion = data.get("direccion", restaurante.direccion)
    restaurante.email_contacto = data.get(
        "email_contacto", restaurante.email_contacto)

    try:
        db.session.commit()
        return jsonify({"msg": "Restaurante actualizado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar restaurante", "error": str(e)}), 500


@api.route('/restaurantes/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_restaurante(id):
    try:
        current_user_id = get_jwt_identity()
        current_user = db.session.get(Usuario, current_user_id)

        if not current_user or current_user.rol != "admin":
            return jsonify({"error": "Solo el admin puede eliminar restaurantes"}), 403

        data = request.get_json()
        if not data:
            return jsonify({"error": "Datos no recibidos"}), 400

        admin_password = data.get("adminPassword")
        if not admin_password or not check_password_hash(current_user.password, admin_password):
            return jsonify({"error": "Contraseña del administrador incorrecta"}), 401

        restaurante = Restaurante.query.get(id)
        if restaurante is None:
            return jsonify({"error": "Restaurante no encontrado"}), 404

        db.session.delete(restaurante)
        db.session.commit()
        return jsonify({"msg": "Restaurante eliminado correctamente"}), 200

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            "error": "Este restaurante no puede ser eliminado porque tiene datos asociados (usuarios, ventas, gastos, etc.)"
        }), 409

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Error inesperado al eliminar el restaurante",
            "detalle": str(e)
        }), 500



@api.route("/gastos/resumen-mensual", methods=["GET"])
@jwt_required()
def resumen_gastos_mensual():
    try:
        user_id = int(get_jwt_identity())
        usuario = db.session.query(Usuario).get(user_id)

        if not usuario:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        restaurante_id = usuario.restaurante_id

        mes = int(request.args.get("mes", 0))
        anio = int(request.args.get("ano", 0))

        if not mes or not anio:
            return jsonify({"msg": "Mes y año son requeridos"}), 400

        gastos = db.session.query(
            Proveedor.nombre.label("proveedor"),
            extract("day", Gasto.fecha).label("dia"),
            func.sum(Gasto.monto).label("total")
        ).join(Proveedor).filter(
            Gasto.restaurante_id == restaurante_id,
            extract("month", Gasto.fecha) == mes,
            extract("year", Gasto.fecha) == anio
        ).group_by(Proveedor.nombre, extract("day", Gasto.fecha)).all()

        # Organizar datos en formato tipo tabla
        resumen = {}
        totales = {}
        proveedores = set()
        dias = set()

        for fila in gastos:
            proveedor = fila.proveedor
            dia = int(fila.dia)
            monto = float(fila.total)

            proveedores.add(proveedor)
            dias.add(dia)

            if proveedor not in resumen:
                resumen[proveedor] = {}
            resumen[proveedor][dia] = monto

            totales[proveedor] = totales.get(proveedor, 0) + monto

        return jsonify({
            "proveedores": sorted(proveedores),
            "dias": sorted(dias),
            "datos": resumen,
            "totales": totales
        }), 200

    except Exception as e:
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


@api.route('/cambiar-password', methods=['PUT'])
@jwt_required()
def cambiar_password():
    data = request.get_json()
    actual = data.get("actual")
    nueva = data.get("nueva")

    if not actual or not nueva:
        return jsonify({"msg": "Faltan datos"}), 400

    user_id = get_jwt_identity()
    user = Usuario.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if not check_password_hash(user.password, actual):
        return jsonify({"msg": "Contraseña actual incorrecta"}), 401

    user.password = generate_password_hash(nueva)
    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada correctamente"}), 200


@api.route("/gastos/porcentaje-mensual", methods=["GET"])
@jwt_required()
def porcentaje_gasto_mensual():
    try:
        user_id = int(get_jwt_identity())
        usuario = Usuario.query.get(user_id)
        if not usuario or not usuario.restaurante_id:
            return jsonify({"msg": "Usuario no válido"}), 404

        restaurante_id = usuario.restaurante_id
        mes = int(request.args.get("mes", 0))
        anio = int(request.args.get("ano", 0))

        if not mes or not anio:
            return jsonify({"msg": "Mes y año requeridos"}), 400

        total_gastos = db.session.query(
            func.sum(Gasto.monto)
        ).filter(
            Gasto.restaurante_id == restaurante_id,
            extract("month", Gasto.fecha) == mes,
            extract("year", Gasto.fecha) == anio
        ).scalar() or 0

        total_ventas = db.session.query(
            func.sum(Venta.monto)
        ).filter(
            Venta.restaurante_id == restaurante_id,
            extract("month", Venta.fecha) == mes,
            extract("year", Venta.fecha) == anio
        ).scalar() or 0

        porcentaje = round((total_gastos / total_ventas)
                           * 100, 2) if total_ventas else 0

        return jsonify({
            "gastos": round(total_gastos, 2),
            "ventas": round(total_ventas, 2),
            "porcentaje": porcentaje
        }), 200

    except Exception as e:
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


@api.route('/api/encargado/resumen-porcentaje/<int:restaurante_id>/<int:mes>/<int:ano>', methods=['GET'])
@jwt_required()
def resumen_porcentaje(restaurante_id, mes, ano):

    ventas = db.session.query(func.sum(Venta.monto)).filter(
        Venta.restaurante_id == restaurante_id,
        extract('month', Venta.fecha) == mes,
        extract('year', Venta.fecha) == ano
    ).scalar() or 0

    gastos = db.session.query(func.sum(Gasto.monto)).filter(
        Gasto.restaurante_id == restaurante_id,
        extract('month', Gasto.fecha) == mes,
        extract('year', Gasto.fecha) == ano
    ).scalar() or 0

    porcentaje = round((gastos / ventas) * 100, 2) if ventas > 0 else 0

    return jsonify({
        "ventas": round(ventas, 2),
        "gastos": round(gastos, 2),
        "porcentaje": porcentaje
    }), 200


@api.route("/gastos/resumen-diario", methods=["GET"])
@jwt_required()
def resumen_diario_chef_encargado():
    try:
        user_id = int(get_jwt_identity())
        usuario = Usuario.query.get(user_id)

        if not usuario or not usuario.restaurante_id:
            return jsonify({"msg": "Usuario no válido"}), 404

        restaurante_id = usuario.restaurante_id
        mes = request.args.get("mes", type=int)
        ano = request.args.get("ano", type=int)

        if not mes or not ano:
            return jsonify({"msg": "Faltan parámetros"}), 400

        ventas_diarias = db.session.query(
            extract("day", Venta.fecha).label("dia"),
            func.sum(Venta.monto).label("ventas")
        ).filter(
            Venta.restaurante_id == restaurante_id,
            extract("month", Venta.fecha) == mes,
            extract("year", Venta.fecha) == ano
        ).group_by(
            extract("day", Venta.fecha)
        ).all()

        gastos_diarios = db.session.query(
            extract("day", Gasto.fecha).label("dia"),
            func.sum(Gasto.monto).label("gastos")
        ).filter(
            Gasto.restaurante_id == restaurante_id,
            extract("month", Gasto.fecha) == mes,
            extract("year", Gasto.fecha) == ano
        ).group_by(
            extract("day", Gasto.fecha)
        ).all()

        resumen = []
        dias = set()

        ventas_dict = {int(v.dia): float(v.ventas) for v in ventas_diarias}
        gastos_dict = {int(g.dia): float(g.gastos) for g in gastos_diarios}
        dias.update(ventas_dict.keys())
        dias.update(gastos_dict.keys())

        for dia in sorted(dias):
            ventas = ventas_dict.get(dia, 0)
            gastos = gastos_dict.get(dia, 0)
            porcentaje = round((gastos / ventas) * 100, 2) if ventas > 0 else 0

            resumen.append({
                "dia": dia,
                "ventas": ventas,
                "gastos": gastos,
                "porcentaje": porcentaje
            })

        return jsonify(resumen), 200

    except Exception as e:
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


@api.route("/admin/gastos/resumen-diario", methods=["GET"])
@jwt_required()
def resumen_diario_admin():
    try:
        restaurante_id = request.args.get("restaurante_id", type=int)
        mes = request.args.get("mes", type=int)
        ano = request.args.get("ano", type=int)

        if not restaurante_id or not mes or not ano:
            return jsonify({"msg": "Faltan parámetros"}), 400

        ventas_diarias = db.session.query(
            extract("day", Venta.fecha).label("dia"),
            func.sum(Venta.monto).label("ventas")
        ).filter(
            Venta.restaurante_id == restaurante_id,
            extract("month", Venta.fecha) == mes,
            extract("year", Venta.fecha) == ano
        ).group_by(
            extract("day", Venta.fecha)
        ).all()

        gastos_diarios = db.session.query(
            extract("day", Gasto.fecha).label("dia"),
            func.sum(Gasto.monto).label("gastos")
        ).filter(
            Gasto.restaurante_id == restaurante_id,
            extract("month", Gasto.fecha) == mes,
            extract("year", Gasto.fecha) == ano
        ).group_by(
            extract("day", Gasto.fecha)
        ).all()

        resumen = []
        dias = set()

        ventas_dict = {int(v.dia): float(v.ventas) for v in ventas_diarias}
        gastos_dict = {int(g.dia): float(g.gastos) for g in gastos_diarios}
        dias.update(ventas_dict.keys())
        dias.update(gastos_dict.keys())

        for dia in sorted(dias):
            ventas = ventas_dict.get(dia, 0)
            gastos = gastos_dict.get(dia, 0)
            porcentaje = round((gastos / ventas) * 100, 2) if ventas > 0 else 0

            resumen.append({
                "dia": dia,
                "ventas": ventas,
                "gastos": gastos,
                "porcentaje": porcentaje
            })

        return jsonify(resumen), 200

    except Exception as e:
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


@api.route('/gastos/categorias-resumen', methods=['GET'])
@jwt_required()
def gastos_por_categoria():
    try:
        user_id = int(get_jwt_identity())
        usuario = Usuario.query.get(user_id)

        if not usuario or not usuario.restaurante_id:
            return jsonify({"msg": "Usuario no válido"}), 404

        restaurante_id = usuario.restaurante_id
        mes = int(request.args.get("mes", 0))
        ano = int(request.args.get("ano", 0))

        if not mes or not ano:
            return jsonify({"msg": "Mes y año requeridos"}), 400

        resumen = db.session.query(
            Gasto.categoria,
            func.sum(Gasto.monto).label("total")
        ).filter(
            Gasto.restaurante_id == restaurante_id,
            extract("month", Gasto.fecha) == mes,
            extract("year", Gasto.fecha) == ano
        ).group_by(Gasto.categoria).all()

        resultado = [{"categoria": r.categoria or "Sin categoría",
                      "total": float(r.total)} for r in resumen]

        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


@api.route("/ventas/resumen-diario", methods=["GET"])
@jwt_required()
def resumen_ventas_diario():
    try:
        user_id = int(get_jwt_identity())
        usuario = Usuario.query.get(user_id)

        if not usuario or not usuario.restaurante_id:
            return jsonify({"msg": "Usuario no válido"}), 404

        restaurante_id = usuario.restaurante_id
        mes = int(request.args.get("mes", 0))
        ano = int(request.args.get("ano", 0))

        if not mes or not ano:
            return jsonify({"msg": "Mes y año requeridos"}), 400

        ventas_diarias = db.session.query(
            extract("day", Venta.fecha).label("dia"),
            func.sum(Venta.monto).label("monto")
        ).filter(
            Venta.restaurante_id == restaurante_id,
            extract("month", Venta.fecha) == mes,
            extract("year", Venta.fecha) == ano
        ).group_by(
            extract("day", Venta.fecha)
        ).order_by(
            extract("day", Venta.fecha)
        ).all()

        resultado = [{"dia": int(row.dia), "monto": float(row.monto)}
                     for row in ventas_diarias]

        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


@api.route('/admin/resumen-general', methods=['GET'])
@jwt_required()
def resumen_general_admin():
    try:
        # Obtener mes y año actual si no se pasan como query
        from datetime import datetime
        mes = int(request.args.get("mes", datetime.now().month))
        anio = int(request.args.get("ano", datetime.now().year))

        restaurantes = Restaurante.query.all()
        resumen = []

        for r in restaurantes:
            # Ventas totales del mes
            total_ventas = db.session.query(
                db.func.sum(Venta.monto)
            ).filter(
                Venta.restaurante_id == r.id,
                db.extract("month", Venta.fecha) == mes,
                db.extract("year", Venta.fecha) == anio
            ).scalar() or 0

            # Gastos totales del mes
            total_gastos = db.session.query(
                db.func.sum(Gasto.monto)
            ).filter(
                Gasto.restaurante_id == r.id,
                db.extract("month", Gasto.fecha) == mes,
                db.extract("year", Gasto.fecha) == anio
            ).scalar() or 0

            porcentaje_gasto = round(
                (total_gastos / total_ventas) * 100, 2) if total_ventas > 0 else 0

            resumen.append({
                "restaurante_id": r.id,
                "nombre": r.nombre,
                "venta_total": round(total_ventas, 2),
                "porcentaje_gasto": porcentaje_gasto
            })

        return jsonify(resumen), 200

    except Exception as e:
        return jsonify({"msg": "Error al generar el resumen", "error": str(e)}), 500


@api.route("/admin/ventas-diarias", methods=["GET"])
@jwt_required()
def ventas_diarias_admin():
    try:
        restaurante_id = request.args.get("restaurante_id")
        mes = int(request.args.get("mes"))
        ano = int(request.args.get("ano"))

        if not restaurante_id or not mes or not ano:
            return jsonify({"msg": "Faltan parámetros"}), 400

        ventas = db.session.query(Venta).filter(
            Venta.restaurante_id == restaurante_id,
            extract("month", Venta.fecha) == mes,
            extract("year", Venta.fecha) == ano
        ).order_by(Venta.fecha.asc()).all()

        return jsonify([v.serialize() for v in ventas]), 200

    except Exception as e:
        return jsonify({"msg": "Error cargando ventas diarias", "error": str(e)}), 500


@api.route('/admin/resumen-porcentaje', methods=['GET'])
@jwt_required()
def admin_resumen_porcentaje():
    try:
        restaurante_id = request.args.get("restaurante_id")
        mes = int(request.args.get("mes"))
        ano = int(request.args.get("ano"))

        if not restaurante_id or not mes or not ano:
            return jsonify({"msg": "Parámetros incompletos"}), 400

        total_ventas = db.session.query(func.sum(Venta.monto)).filter(
            Venta.restaurante_id == restaurante_id,
            extract('month', Venta.fecha) == mes,
            extract('year', Venta.fecha) == ano
        ).scalar() or 0

        total_gastos = db.session.query(func.sum(Gasto.monto)).filter(
            Gasto.restaurante_id == restaurante_id,
            extract('month', Gasto.fecha) == mes,
            extract('year', Gasto.fecha) == ano
        ).scalar() or 0

        porcentaje = round((total_gastos / total_ventas) *
                           100, 2) if total_ventas > 0 else 0
        promedio_diario = round(
            total_ventas / 30, 2) if total_ventas > 0 else 0
        proyeccion = round((total_ventas / (mes * 30)) * 30,
                           2) if mes > 0 and total_ventas > 0 else 0

        return jsonify({
            "total_ventas": round(total_ventas, 2),
            "total_gastos": round(total_gastos, 2),
            "porcentaje_gasto": porcentaje,
            "promedio_diario": promedio_diario,
            "proyeccion_mensual": proyeccion
        }), 200

    except Exception as e:
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


@api.route("/admin/gastos/por-dia", methods=["GET"])
@jwt_required()
def gastos_por_dia_admin():
    try:
        user_id = int(get_jwt_identity())
        usuario = Usuario.query.get(user_id)
        if not usuario or usuario.rol != "admin":
            return jsonify({"msg": "Acceso no autorizado"}), 403
        mes = int(request.args.get("mes", 0))
        anio = int(request.args.get("ano", 0))
        if not mes or not anio:
            return jsonify({"msg": "Mes y año requeridos"}), 400
        total_gastado = db.session.query(func.sum(Gasto.monto)).filter(
            extract("month", Gasto.fecha) == mes,
            extract("year", Gasto.fecha) == anio
        ).scalar() or 0
        restaurantes_activos = db.session.query(
            Restaurante.id).filter(Restaurante.activo == True).count()
        proveedor_mas_usado = db.session.query(
            Proveedor.nombre, func.count(Gasto.id).label("cantidad")
        ).join(Gasto).filter(
            extract("month", Gasto.fecha) == mes,
            extract("year", Gasto.fecha) == anio
        ).group_by(Proveedor.nombre).order_by(desc("cantidad")).first()
        proveedor_nombre = proveedor_mas_usado[0] if proveedor_mas_usado else "Sin datos"
        restaurante_top = db.session.query(
            Restaurante.nombre, func.sum(Gasto.monto).label("total")
        ).join(Gasto).filter(
            extract("month", Gasto.fecha) == mes,
            extract("year", Gasto.fecha) == anio
        ).group_by(Restaurante.nombre).order_by(desc("total")).first()
        restaurante_nombre = restaurante_top[0] if restaurante_top else "Sin datos"
        return jsonify({
            "total_gastado": round(total_gastado, 2),
            "restaurantes_activos": restaurantes_activos,
            "proveedor_top": proveedor_nombre,
            "restaurante_top": restaurante_nombre
        }), 200
    except Exception as e:
        return jsonify({"msg": "Error interno", "error": str(e)}), 500


# NUEVOS ENDPOINTS gASTOS

@api.route('/resumen-gastos', methods=['GET'])
@jwt_required()
def resumen_gastos_admin():
    try:
        from datetime import datetime
        mes = int(request.args.get("mes", datetime.now().month))
        ano = int(request.args.get("ano", datetime.now().year))
        restaurantes = Restaurante.query.all()
        total_gastado = 0
        proveedor_contador = {}
        restaurante_gastos = {}
        for r in restaurantes:
            # Gastos totales del restaurante
            gastos = Gasto.query.filter(
                Gasto.restaurante_id == r.id,
                db.extract("month", Gasto.fecha) == mes,
                db.extract("year", Gasto.fecha) == ano
            ).all()
            for g in gastos:
                total_gastado += g.monto
                # Contar proveedores
                if g.proveedor_id:
                    proveedor_contador[g.proveedor_id] = proveedor_contador.get(g.proveedor_id, 0) + 1
            # Sumar gasto total por restaurante
            restaurante_gastos[r.nombre] = restaurante_gastos.get(r.nombre, 0) + sum([g.monto for g in gastos])
        # Proveedor más usado
        proveedor_top = "No disponible"
        if proveedor_contador:
            proveedor_id = max(proveedor_contador, key=proveedor_contador.get)
            proveedor = Proveedor.query.get(proveedor_id)
            proveedor_top = proveedor.nombre if proveedor else "No disponible"
        # Restaurante con más gasto
        restaurante_top = "No disponible"
        if restaurante_gastos:
            restaurante_top = max(restaurante_gastos, key=restaurante_gastos.get)
        resumen = {
            "total_gastado": round(total_gastado, 2),
            "restaurantes_activos": len(restaurantes),
            "proveedor_top": proveedor_top,
            "restaurante_top": restaurante_top
        }
        return jsonify(resumen), 200
    except Exception as e:
        return jsonify({ "msg": "Error al obtener el resumen", "error": str(e) }), 500

@api.route("/gasto-por-restaurante", methods=["GET"])
@jwt_required()
def gasto_por_restaurante():
    try:
        # Obtener parámetros de la URL
        mes_str = request.args.get("mes")
        ano_str = request.args.get("ano")
        # Validación: asegurarse de que existan ambos parámetros
        if not mes_str or not ano_str:
            return jsonify({"msg": "Faltan parámetros 'mes' y 'ano'"}), 422
        # Convertir a enteros
        mes = int(mes_str)
        ano = int(ano_str)
        # Obtener todos los restaurantes
        restaurantes = Restaurante.query.all()
        resultado = []
        for r in restaurantes:
            gastos = db.session.query(db.func.sum(Gasto.monto)).filter(
                Gasto.restaurante_id == r.id,
                db.extract("month", Gasto.fecha) == mes,
                db.extract("year", Gasto.fecha) == ano
            ).scalar() or 0
            resultado.append({
                "restaurante": r.nombre,
                "total_gastado": round(gastos, 2)
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({
            "msg": "Error al obtener los gastos por restaurante",
            "error": str(e)
        }), 500

@api.route('/gasto-evolucion-mensual', methods=['GET'])
@jwt_required()
def evolucion_gasto_mensual():
    try:
        from datetime import datetime
        ano = int(request.args.get("ano", datetime.now().year))
        # Obtener todos los restaurantes
        restaurantes = Restaurante.query.all()
        if not restaurantes:
            return jsonify([]), 200
        resultado = []
        # Por cada mes del año
        for mes in range(1, 13):
            total_mes = 0
            for restaurante in restaurantes:
                gastos = Gasto.query.filter(
                    Gasto.restaurante_id == restaurante.id,
                    db.extract('year', Gasto.fecha) == ano,
                    db.extract('month', Gasto.fecha) == mes
                ).all()
                total_mes += sum([g.monto for g in gastos])
            resultado.append({
                "mes": mes,
                "total_gastado": round(total_mes, 2)
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"msg": "Error al calcular la evolución mensual", "error": str(e)}), 500
    
@api.route('/proveedores-top', methods=['GET'])
@jwt_required()
def get_proveedores_top():
    mes = request.args.get("mes")
    ano = request.args.get("ano")
    if not mes or not ano:
        return jsonify({"msg": "Parámetros mes y año requeridos"}), 400
    try:
        resultados = (
            db.session.query(
                Proveedor.nombre,
                func.count(Gasto.id).label("veces_usado"),
                func.sum(Gasto.monto).label("total_gastado")
            )
            .join(Gasto, Gasto.proveedor_id == Proveedor.id)
            .filter(func.extract("month", Gasto.fecha) == int(mes))
            .filter(func.extract("year", Gasto.fecha) == int(ano))
            .group_by(Proveedor.nombre)
            .order_by(func.sum(Gasto.monto).desc())
            .limit(5)
            .all()
        )
        data = []
        for nombre, veces_usado, total_gastado in resultados:
            data.append({
                "nombre": nombre,
                "veces_usado": veces_usado,
                "total_gastado": float(total_gastado) if total_gastado else 0.0
            })
        return jsonify(data), 200
    except Exception as e:
        print("Error en get_proveedores_top:", e)
        return jsonify({"msg": "Error al obtener proveedores", "error": str(e)}), 500
    
#Endpoints Vista Ventas

@api.route('/resumen-ventas', methods=['GET'])
@jwt_required()
def resumen_ventas_admin():
    try:
        from datetime import datetime
        mes = int(request.args.get("mes", datetime.now().month))
        ano = int(request.args.get("ano", datetime.now().year))
        restaurantes = Restaurante.query.all()
        total_vendido = 0
        restaurante_ventas = {}
        for r in restaurantes:
            ventas = Venta.query.filter(
                Venta.restaurante_id == r.id,
                db.extract("month", Venta.fecha) == mes,
                db.extract("year", Venta.fecha) == ano
            ).all()
            monto_total_restaurante = sum([v.monto for v in ventas])
            total_vendido += monto_total_restaurante
            restaurante_ventas[r.nombre] = monto_total_restaurante
        restaurante_top = "No disponible"
        if restaurante_ventas:
            restaurante_top = max(restaurante_ventas, key=restaurante_ventas.get)
        promedio_por_restaurante = (
            round(total_vendido / len(restaurante_ventas), 2)
            if restaurante_ventas else 0
        )
        resumen = {
            "total_vendido": round(total_vendido, 2),
            "restaurantes_con_ventas": len(restaurante_ventas),
            "restaurante_top": restaurante_top,
            "promedio_por_restaurante": promedio_por_restaurante
        }
        return jsonify(resumen), 200
    except Exception as e:
        return jsonify({ "msg": "Error al obtener el resumen de ventas", "error": str(e) }), 500

@api.route('/venta-evolucion-mensual', methods=['GET'])
@jwt_required()
def evolucion_venta_mensual():
    try:
        from datetime import datetime
        ano = int(request.args.get("ano", datetime.now().year))
        restaurantes = Restaurante.query.all()
        if not restaurantes:
            return jsonify([]), 200
        resultado = []
        for mes in range(1, 13):
            total_mes = 0
            for restaurante in restaurantes:
                ventas = Venta.query.filter(
                    Venta.restaurante_id == restaurante.id,
                    db.extract('year', Venta.fecha) == ano,
                    db.extract('month', Venta.fecha) == mes
                ).all()
                total_mes += sum([v.monto for v in ventas])
            resultado.append({
                "mes": mes,
                "total_vendido": round(total_mes, 2)
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"msg": "Error al calcular la evolución mensual de ventas", "error": str(e)}), 500

@api.route("/ventas-por-restaurante", methods=["GET"])
@jwt_required()
def ventas_por_restaurante():
    try:
        mes_str = request.args.get("mes")
        ano_str = request.args.get("ano")
        if not mes_str or not ano_str:
            return jsonify({"msg": "Faltan parámetros 'mes' y 'ano'"}), 422
        mes = int(mes_str)
        ano = int(ano_str)
        restaurantes = Restaurante.query.all()
        resultado = []
        for r in restaurantes:
            ventas = db.session.query(db.func.sum(Venta.monto)).filter(
                Venta.restaurante_id == r.id,
                db.extract("month", Venta.fecha) == mes,
                db.extract("year", Venta.fecha) == ano
            ).scalar() or 0
            resultado.append({
                "restaurante": r.nombre,
                "total_vendido": round(ventas, 2)
            })
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({
            "msg": "Error al obtener las ventas por restaurante",
            "error": str(e)
        }), 500

@api.route('/restaurantes-top', methods=['GET'])
@jwt_required()
def get_restaurantes_top():
    mes = request.args.get("mes")
    ano = request.args.get("ano")
    if not mes or not ano:
        return jsonify({"msg": "Parámetros mes y año requeridos"}), 400
    try:
        resultados = (
            db.session.query(
                Restaurante.nombre,
                func.count(Venta.id).label("ventas_realizadas"),
                func.sum(Venta.monto).label("total_vendido")
            )
            .join(Venta, Venta.restaurante_id == Restaurante.id)
            .filter(func.extract("month", Venta.fecha) == int(mes))
            .filter(func.extract("year", Venta.fecha) == int(ano))
            .group_by(Restaurante.nombre)
            .order_by(func.sum(Venta.monto).desc())
            .limit(5)
            .all()
        )
        data = []
        for nombre, ventas_realizadas, total_vendido in resultados:
            data.append({
                "nombre": nombre,
                "ventas_realizadas": ventas_realizadas,
                "total_vendido": float(total_vendido) if total_vendido else 0.0
            })
        return jsonify(data), 200
    except Exception as e:
        print("Error en get_restaurantes_top:", e)
        return jsonify({"msg": "Error al obtener restaurantes top", "error": str(e)}), 500
    
#aLERT BORRAR rESTAURANTE

@api.route('/restaurantes/<int:id>/tiene-ventas', methods=['GET'])
@jwt_required()
def restaurante_tiene_ventas(id):
    try:
        ventas = Venta.query.filter_by(restaurante_id=id).first()
        tiene_ventas = ventas is not None
        return jsonify({"tieneVentas": tiene_ventas}), 200
    except Exception as e:
        return jsonify({"msg": "Error al verificar ventas del restaurante", "error": str(e)}), 500
    
#Nuevo endpoint Ventas

@api.route('/ventas/encargado', methods=['GET'])
@jwt_required()
def obtener_ventas_encargado():
    mes = request.args.get("mes", type=int)
    ano = request.args.get("ano", type=int)
    user_id = get_jwt_identity()
    user = Usuario.query.get(user_id)
    if not user or not user.restaurante_id:
        return jsonify({"msg": "Usuario no válido o sin restaurante asignado"}), 400
    try:
        ventas = Venta.query.filter(
            Venta.restaurante_id == user.restaurante_id,
            db.extract("month", Venta.fecha) == mes,
            db.extract("year", Venta.fecha) == ano
        ).all()
        resultados = []
        for v in ventas:
            resultados.append({
                "id": v.id,
                "fecha": v.fecha.isoformat(),
                "monto": v.monto,
                "turno": v.turno,
                "restaurante_id": v.restaurante_id
            })
        return jsonify(resultados), 200
    except Exception as e:
        return jsonify({"msg": "Error al obtener ventas", "error": str(e)}), 500

@api.route("/ventas-detalle", methods=["GET"])
@jwt_required()
def ventas_detalle_por_restaurante():
    try:
        mes = request.args.get("mes")
        ano = request.args.get("ano")
        restaurante_id = request.args.get("restaurante_id")
        if not mes or not ano or not restaurante_id:
            return jsonify({"msg": "Faltan parámetros"}), 422
        ventas = Venta.query.filter(
            Venta.restaurante_id == int(restaurante_id),
            db.extract("month", Venta.fecha) == int(mes),
            db.extract("year", Venta.fecha) == int(ano)
        ).all()
        return jsonify([v.serialize() for v in ventas]), 200
    except Exception as e:
        return jsonify({
            "msg": "Error al obtener ventas detalladas",
            "error": str(e)
        }), 500

def limpiar_email(texto):
    texto = unicodedata.normalize('NFKD', texto).encode('ascii', 'ignore').decode('utf-8')
    return texto.lower().replace(' ', '').replace('&', '')

@api.route("/seed", methods=["GET"])
def seed():
    nombres_restaurantes = [
        "La Marea", "Tango Grill", "Internacional Bar", "Mar & Terra",
        "Sabor Criollo", "Pasta & Vino", "Fusión Oriental", "El Rincón Vegano",
        "Tapas Urbanas", "Bistró Mediterráneo"
    ]

    estados_gasto = ["dentro"] * 3 + ["limite"] * 3 + ["fuera"] * 4
    random.shuffle(estados_gasto)

    restaurantes = []
    for i, nombre in enumerate(nombres_restaurantes):
        clean_name = limpiar_email(nombre)
        restaurante = Restaurante(
            nombre=nombre,
            direccion=f"Calle {random.randint(1, 200)}, Ciudad",
            telefono=f"6{random.randint(10000000, 99999999)}",
            email_contacto=f"contacto.{clean_name}@ohmychef.com"
        )
        db.session.add(restaurante)
        restaurante.estado_gasto = estados_gasto[i]
        restaurantes.append(restaurante)
    db.session.commit()

    print("🏗️ Restaurantes creados.")

    apellidos = ["Gómez", "Pérez", "Rodríguez", "Fernández", "López", "Martínez"]
    nombres_chef = ["Laura", "Carlos", "Sofía", "Pedro", "Ana", "Miguel", "Lucía", "David", "Elena", "Javier"]
    nombres_encargado = ["Andrés", "Patricia", "Raúl", "Beatriz", "Tomás", "Irene", "Diego", "Clara", "Rubén", "Nuria"]

    for i, restaurante in enumerate(restaurantes):
        clean_name = limpiar_email(restaurante.nombre)

        if restaurante.nombre == "La Marea":
            email_encargado = "heiderfandino@gmail.com"
            email_chef = "heideralfonsoo@gmail.com"
        else:
            email_encargado = f"encargado.{clean_name}@ohmychef.com"
            email_chef = f"chef.{clean_name}@ohmychef.com"

        encargado = Usuario(
            nombre=f"{nombres_encargado[i]} {random.choice(apellidos)}",
            email=email_encargado,
            rol="encargado",
            status="active",
            restaurante_id=restaurante.id,
            password=generate_password_hash("123456")
        )
        chef = Usuario(
            nombre=f"{nombres_chef[i]} {random.choice(apellidos)}",
            email=email_chef,
            rol="chef",
            status="active",
            restaurante_id=restaurante.id,
            password=generate_password_hash("123456")
        )
        db.session.add(encargado)
        db.session.add(chef)

    admin = Usuario(
        nombre="Admin Principal",
        email="ohmychefapp@gmail.com",
        rol="admin",
        status="active",
        restaurante_id=None,
        password=generate_password_hash("123456")
    )
    db.session.add(admin)
    db.session.commit()

    print("👤 Admin y usuarios creados.")

    print("➕ Creando proveedores...")

    proveedores_reales = [
        {"nombre": "Gas y Energía", "categoria": "otros"},
        {"nombre": "Distribuidora Coca-Cola", "categoria": "bebidas"},
        {"nombre": "Bebidas Alianza", "categoria": "bebidas"},
        {"nombre": "Limpieza Total", "categoria": "limpieza"},
        {"nombre": "Soluciones Higiénicas", "categoria": "limpieza"},
        {"nombre": "Embalajes Ruiz", "categoria": "otros"},
        {"nombre": "Lácteos del Sur", "categoria": "alimentos"},
        {"nombre": "Aguas Claras", "categoria": "bebidas"},
        {"nombre": "Verduras Frescas", "categoria": "alimentos"},
        {"nombre": "Higiene Express", "categoria": "limpieza"},
    ]

    proveedores_por_restaurante = {}

    for restaurante in restaurantes:
        lista = []
        for p in proveedores_reales:
            clean_rest = limpiar_email(restaurante.nombre)
            email = f"{p['nombre'].lower().replace(' ', '').replace('&','')}@{clean_rest}.com"
            prov = Proveedor(
                nombre=p["nombre"],
                categoria=p["categoria"],
                direccion=f"Calle Proveedor, Ciudad",
                telefono=f"6{random.randint(10000000, 99999999)}",
                email_contacto=email,
                restaurante_id=restaurante.id
            )
            db.session.add(prov)
            lista.append(prov)
        proveedores_por_restaurante[restaurante.id] = lista

    db.session.commit()

    print("💰 Generando gastos y ventas desde enero...")

    fecha_inicio = date(2025, 1, 1)
    hoy = date.today()
    ultimo_dia = monthrange(hoy.year, hoy.month)[1]
    fecha_fin = date(hoy.year, hoy.month, ultimo_dia)
    dias = (fecha_fin - fecha_inicio).days

    for restaurante in restaurantes:
        chef = Usuario.query.filter_by(rol='chef', restaurante_id=restaurante.id).first()
        proveedores = proveedores_por_restaurante[restaurante.id]

        for i in range(dias):
            fecha = fecha_inicio + timedelta(days=i)

            gastos_del_dia = []
            for _ in range(3):  # ← SOLO 3 gastos diarios
                proveedor = random.choice(proveedores)

                if restaurante.estado_gasto == "dentro":
                    monto = round(random.uniform(10, 50), 2)
                elif restaurante.estado_gasto == "limite":
                    monto = round(random.uniform(20, 60), 2)
                else:
                    monto = round(random.uniform(40, 80), 2)

                gasto = Gasto(
                    fecha=fecha,
                    monto=monto,
                    categoria=proveedor.categoria,
                    proveedor_id=proveedor.id,
                    usuario_id=chef.id,
                    restaurante_id=restaurante.id,
                    nota=f"Gasto de {proveedor.nombre}"
                )
                db.session.add(gasto)
                gastos_del_dia.append(monto)

            total_gastos_dia = sum(gastos_del_dia)

            if restaurante.estado_gasto == "dentro":
                porcentaje = random.uniform(0.25, 0.30)
            elif restaurante.estado_gasto == "limite":
                porcentaje = random.uniform(0.30, 0.33)
            else:
                porcentaje = random.uniform(0.36, 0.42)

            total_venta_dia = round(total_gastos_dia / porcentaje, 2)

            venta = Venta(
                fecha=fecha,
                turno="tarde",
                monto=total_venta_dia,
                restaurante_id=restaurante.id
            )
            db.session.add(venta)

    db.session.commit()
    print("✅ Base de datos reiniciada con éxito.")
    return jsonify({"msg": "Base de datos reiniciada con éxito."}), 200
