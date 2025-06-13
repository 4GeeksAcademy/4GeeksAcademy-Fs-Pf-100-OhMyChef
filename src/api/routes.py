"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, Usuario, Venta, Gasto, FacturaAlbaran, Proveedor, MargenObjetivo, Restaurante
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, func, extract
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
import json
import traceback

api = Blueprint('api', __name__)


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
            "rol": u.rol
        })

    return jsonify(resultados), 200


@api.route("/register", methods=["POST"])
@jwt_required(optional=True)
def register():
    try:
        data = request.json

        if not data.get("email") or not data.get("password") or not data.get("rol") or not data.get("nombre"):
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        total_users = db.session.scalar(
            select(func.count()).select_from(Usuario))

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

        hashed_password = generate_password_hash(data["password"])
        new_user = Usuario(
            nombre=data["nombre"],
            email=data["email"],
            password=hashed_password,
            rol=data["rol"],
            restaurante_id=data.get("restaurante_id")
        )
        db.session.add(new_user)
        db.session.commit()

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
        "restaurante_id": usuario.restaurante_id
    }

    return jsonify(resultado), 200


@api.route('/usuarios/<int:id>', methods=['PUT'])
@jwt_required()
def editar_usuario(id):
    usuario = Usuario.query.get(id)

    if usuario is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"msg": "Datos no recibidos"}), 400

    usuario.nombre = data.get("nombre", usuario.nombre)
    usuario.email = data.get("email", usuario.email)
    usuario.password = data.get("password", usuario.password)
    usuario.rol = data.get("rol", usuario.rol)
    usuario.restaurante_id = data.get("restaurante_id", usuario.restaurante_id)

    try:
        db.session.commit()
        return jsonify({"msg": "Usuario actualizado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar el usuario", "error": str(e)}), 500


@api.route('/usuarios/<int:id>', methods=['DELETE'])
@jwt_required()
def eliminar_usuario(id):
    usuario = Usuario.query.get(id)

    if usuario is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    try:
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({"msg": "Usuario eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar el usuario", "error": str(e)}), 500


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
        # ❗ Validación: no permitir duplicados por fecha, turno y restaurante
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
        return jsonify({"msg": "Venta creada correctamente"}), 201

    except Exception as e:
        db.session.rollback()
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

            db.session.commit()
            return jsonify({"msg": "Gastos registrados correctamente"}), 201

        except Exception as e:
            db.session.rollback()
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
            return jsonify({"msg": "Gasto registrado correctamente"}), 201
        except Exception as e:
            db.session.rollback()
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
        return jsonify({"msg": "Gasto actualizado"}), 200
    except Exception as e:
        db.session.rollback()
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
    proveedores = Proveedor.query.all()

    resultados = []
    for p in proveedores:
        resultados.append({
            "id": p.id,
            "nombre": p.nombre,
            "categoria": p.categoria,
            "restaurante_id": p.restaurante_id
        })

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

    if not nombre or not restaurante_id:
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    try:
        nuevo_proveedor = Proveedor(
            nombre=nombre,
            categoria=categoria,
            restaurante_id=restaurante_id
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
        "restaurante_id": proveedor.restaurante_id
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
    restaurante = Restaurante.query.get(id)

    if restaurante is None:
        return jsonify({"msg": "Restaurante no encontrado"}), 404

    try:
        db.session.delete(restaurante)
        db.session.commit()
        return jsonify({"msg": "Restaurante eliminado correctamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar restaurante", "error": str(e)}), 500


@api.route("/private", methods=["GET"])
@jwt_required()
def get_user_info():
    try:
        # 🔁 aquí parseamos el JSON
        user_identity = json.loads(get_jwt_identity())
        user_id = user_identity["id"]

        usuario = db.session.get(Usuario, user_id)

        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        data = usuario.serialize()

        if usuario.restaurante_id:
            restaurante = db.session.get(Restaurante, usuario.restaurante_id)
            if restaurante:
                data["restaurante_nombre"] = restaurante.nombre

        return jsonify({"user": data}), 200

    except Exception as e:
        return jsonify({"error": "Algo salió mal"}), 500


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
