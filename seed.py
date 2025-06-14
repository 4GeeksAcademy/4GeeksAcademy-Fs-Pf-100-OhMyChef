# seed.py
import os
import sys
import random
from datetime import date, timedelta
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash



sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))


from api.models import Proveedor, Gasto, Usuario, Restaurante, Venta
from front.app import app, db

load_dotenv()


with app.app_context():
    print("🔄 Inicializando seed...")

   
    restaurante = Restaurante.query.first()
    if not restaurante:
        restaurante = Restaurante(nombre="Restaurante Demo")
        db.session.add(restaurante)
        db.session.commit()
        print("🏗️ Restaurante creado.")

   
    usuarios = [
        {"nombre": "Admin Seed", "email": "admin@seed.com", "rol": "admin", "restaurante_id": None},
        {"nombre": "Encargado Seed", "email": "encargado@seed.com", "rol": "encargado", "restaurante_id": restaurante.id},
        {"nombre": "Chef Seed", "email": "chef@seed.com", "rol": "chef", "restaurante_id": restaurante.id},
    ]

    for u in usuarios:
        existente = Usuario.query.filter_by(email=u["email"]).first()
        if not existente:
            nuevo = Usuario(
                nombre=u["nombre"],
                email=u["email"],
                rol=u["rol"],
                restaurante_id=u["restaurante_id"],
                password=generate_password_hash("123456")
            )
            db.session.add(nuevo)
            print(f"👤 Usuario {u['rol']} creado: {u['email']}")
    db.session.commit()

    usuario_chef = Usuario.query.filter_by(rol='chef').first()
    usuario_encargado = Usuario.query.filter_by(rol='encargado').first()

    categorias = ["alimentos", "bebidas", "limpieza", "otros"]
    nombres_proveedores = [f"Proveedor {i+1}" for i in range(10)]

    print("🧹 Borrando proveedores, gastos y ventas existentes...")
    Gasto.query.delete()
    Proveedor.query.delete()
    Venta.query.delete()
    db.session.commit()

    print("➕ Creando proveedores...")
    proveedores = []
    for nombre in nombres_proveedores:
        prov = Proveedor(
            nombre=nombre,
            categoria=random.choice(categorias),
            direccion=f"Calle {random.randint(1, 100)}",
            telefono=f"+34 6{random.randint(10000000, 99999999)}",
            restaurante_id=restaurante.id
        )
        db.session.add(prov)
        proveedores.append(prov)
    db.session.commit()

    print("💰 Generando gastos para 31 días...")
    base_fecha = date.today().replace(day=1)
    for prov in proveedores:
        for i in range(31):
            gasto = Gasto(
                fecha=base_fecha + timedelta(days=i),
                monto=round(random.uniform(10, 100), 2),
                categoria=prov.categoria,
                proveedor_id=prov.id,
                usuario_id=usuario_chef.id,
                restaurante_id=restaurante.id,
                nota=f"Gasto auto {i+1} de {prov.nombre}"
            )
            db.session.add(gasto)
    db.session.commit()

    print("📈 Generando ventas para 31 días...")
    for i in range(31):
        venta = Venta(
            fecha=base_fecha + timedelta(days=i),
            turno="mañana",
            monto=round(random.uniform(150, 400), 2),
            restaurante_id=restaurante.id,
           
        )
        db.session.add(venta)
    db.session.commit()

    print("✅ Seed completado con usuarios, 10 proveedores, 31 gastos por proveedor y 31 ventas del mes.")
