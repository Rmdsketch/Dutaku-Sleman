from config import db
from models.calculate import Calculate
from sqlalchemy import func, text

class Alternative(db.Model):
    __tablename__ = 'alternatives'

    id = db.Column(db.String(3), primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    attribute = db.Column(db.String(64), nullable=False)

    calculates = db.relationship('Calculate', backref='alternatives')

    def __init__(self, id, name, attribute):
        self.id = id or self.generate_unique_id()
        self.name = name
        self.attribute = attribute

    @staticmethod
    def generate_unique_id():
        result = db.session.execute(
            text(
                """
            SELECT id FROM alternatives
            ORDER BY CAST(SUBSTRING(id, 2) AS UNSIGNED) DESC
            LIMIT 1
            """
            )
        ).fetchone()

        if not result or not result[0]:
            return "A01"

        try:
            numeric_part = int(result[0][1:])
        except (ValueError, TypeError):
            numeric_part = db.session.query(func.count(Alternative.id)).scalar()

        return f"A{numeric_part + 1:02}"
