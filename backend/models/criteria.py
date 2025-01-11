from config import db
from models.calculate import Calculate
from sqlalchemy import func

class Criteria(db.Model):
    __tablename__= 'criterias'

    id = db.Column(db.String(2), primary_key=True)
    kriteria = db.Column(db.String(64), nullable=False)
    bobot = db.Column(db.Float, nullable=False)
    atribut = db.Column(db.String(64), nullable=False)

    calculates = db.relationship("Calculate", backref="criterias")

    def __init__(self, id, kriteria, bobot, atribut):
        self.id = id or self.generate_unique_id()
        self.kriteria = kriteria
        self.bobot = bobot
        self.atribut = atribut
        
    @staticmethod
    def generate_unique_id():
        criteria = db.session.query(func.count(Criteria.id)).scalar()
        return f"C{criteria + 1}"