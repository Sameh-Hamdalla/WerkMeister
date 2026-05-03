from datetime import date

from sqlalchemy import Column, Integer, String

from database import Base


class Tool(Base):
    # Diese Klasse wird von SQLAlchemy als Tabelle "tools" in SQLite abgebildet.
    __tablename__ = "tools"

    # Primaerschluessel: eindeutige ID fuer Bearbeiten, Loeschen und Sortierung.
    id = Column(Integer, primary_key=True, index=True)

    # Stammdaten, die im Frontend-Formular gepflegt werden.
    name = Column(String(100), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    location = Column(String(100), nullable=False)
    condition = Column(String(50), nullable=False)

    # Eingangsdatum im ISO-Format YYYY-MM-DD. String reicht hier, weil keine
    # komplexen Datumsberechnungen in der Datenbank noetig sind.
    received_date = Column(
        String(10), nullable=False, default=lambda: date.today().isoformat()
    )

    # Optionaler Wartungstermin. Wenn er leer ist, steht in der DB NULL.
    maintenance_date = Column(String(10), nullable=True)
