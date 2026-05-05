TOOL_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    condition TEXT NOT NULL,
    received_date TEXT NOT NULL,
    maintenance_date TEXT
)
"""
