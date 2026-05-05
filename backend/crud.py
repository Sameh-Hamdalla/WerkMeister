from contextlib import closing

from database import get_connection


def row_to_dict(row):
    return dict(row) if row else None


def create_tool(tool_data: dict):
    with closing(get_connection()) as connection:
        cursor = connection.execute(
            """
            INSERT INTO tools (
                name,
                category,
                location,
                condition,
                received_date,
                maintenance_date
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                tool_data["name"],
                tool_data["category"],
                tool_data["location"],
                tool_data["condition"],
                tool_data["received_date"],
                tool_data.get("maintenance_date"),
            ),
        )
        connection.commit()
        return get_tool(cursor.lastrowid)


def get_tools():
    with closing(get_connection()) as connection:
        rows = connection.execute(
            """
            SELECT
                id,
                name,
                category,
                location,
                condition,
                received_date,
                maintenance_date
            FROM tools
            ORDER BY id DESC
            """
        ).fetchall()
        return [row_to_dict(row) for row in rows]


def get_tool(tool_id: int):
    with closing(get_connection()) as connection:
        row = connection.execute(
            """
            SELECT
                id,
                name,
                category,
                location,
                condition,
                received_date,
                maintenance_date
            FROM tools
            WHERE id = ?
            """,
            (tool_id,),
        ).fetchone()
        return row_to_dict(row)


def update_tool(tool_id: int, data: dict):
    if not get_tool(tool_id):
        return None

    with closing(get_connection()) as connection:
        connection.execute(
            """
            UPDATE tools
            SET
                name = ?,
                category = ?,
                location = ?,
                condition = ?,
                received_date = ?,
                maintenance_date = ?
            WHERE id = ?
            """,
            (
                data["name"],
                data["category"],
                data["location"],
                data["condition"],
                data["received_date"],
                data.get("maintenance_date"),
                tool_id,
            ),
        )
        connection.commit()

    return get_tool(tool_id)


def delete_tool(tool_id: int):
    tool = get_tool(tool_id)

    if not tool:
        return None

    with closing(get_connection()) as connection:
        connection.execute("DELETE FROM tools WHERE id = ?", (tool_id,))
        connection.commit()

    return tool
