import os
import sqlite3
from contextlib import closing
from datetime import date
from pathlib import Path

from models import TOOL_TABLE_SQL

# SQLite-Datei fuer die Werkzeugdaten. Auf Render kann der Pfad spaeter ueber
# SQLITE_DB_PATH auf eine persistente Disk zeigen.
DB_PATH = Path(os.getenv("SQLITE_DB_PATH", "tools.db"))
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with closing(get_connection()) as connection:
        connection.execute(TOOL_TABLE_SQL)
        migrate_tools_table(connection)
        connection.commit()


def migrate_tools_table(connection):
    columns = {
        row["name"]
        for row in connection.execute("PRAGMA table_info(tools)").fetchall()
    }

    if "received_date" not in columns:
        today = date.today().isoformat()
        connection.execute(
            "ALTER TABLE tools "
            f"ADD COLUMN received_date TEXT NOT NULL DEFAULT '{today}'"
        )

    if "maintenance_date" not in columns:
        connection.execute("ALTER TABLE tools ADD COLUMN maintenance_date TEXT")
