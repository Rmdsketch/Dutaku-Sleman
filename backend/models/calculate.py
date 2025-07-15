from config import db
from sqlalchemy import func

class Calculate(db.Model):
    __tablename__ = "calculates"

    id = db.Column(db.String(3), primary_key=True)
    alternative_id = db.Column(db.String(3), db.ForeignKey("alternatives.id"), nullable=False)
    criteria_id = db.Column(db.String(2), db.ForeignKey("criterias.id"), nullable=False)
    nilai = db.Column(db.Float, nullable=False)

    def __init__(self, id, alternative_id, criteria_id, nilai):
        self.id = id or self.generate_unique_id()
        self.alternative_id = alternative_id
        self.criteria_id = criteria_id
        self.nilai = nilai

    @staticmethod
    def generate_unique_id():
        result = db.session.query(func.count(Calculate.id)).scalar()
        return f"R{result + 1:02}"