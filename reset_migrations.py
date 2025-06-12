import os
import shutil
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import subprocess

# Cargar variables de entorno desde .env
load_dotenv()

# Obtener la URL de la base de datos
database_url = os.getenv("DATABASE_URL")

if not database_url:
    print("❌ No se encontró la variable DATABASE_URL en el entorno.")
    exit(1)

print("🔌 Conectando a la base de datos...")
engine = create_engine(database_url)

with engine.connect() as conn:
    try:
        # Intentar borrar la tabla alembic_version
        conn.execute(text("DROP TABLE IF EXISTS alembic_version"))
        conn.commit()
        print("✅ Tabla alembic_version eliminada.")
    except Exception as e:
        print("⚠️ Error al eliminar alembic_version:", e)
        exit(1)

# Borrar carpeta de migraciones si existe
if os.path.isdir("migrations"):
    shutil.rmtree("migrations")
    print("🧹 Carpeta 'migrations/' eliminada.")

# Ejecutar comandos flask para reiniciar migraciones
print("🚀 Reiniciando migraciones...")

subprocess.run(["pipenv", "run", "flask", "db", "init"])
subprocess.run(["pipenv", "run", "flask", "db", "migrate", "-m", "Initial"])
subprocess.run(["pipenv", "run", "flask", "db", "upgrade"])

print("✅ Migraciones reiniciadas y base de datos actualizada.")
