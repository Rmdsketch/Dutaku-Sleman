from config import db
from models.calculate import Calculate
from sqlalchemy import func

class Alternative(db.Model):
    __tablename__ = 'alternatives'

    id = db.Column(db.String(3), primary_key=True)
    nama = db.Column(db.String(64),  nullable=False)
    atribut = db.Column(db.String(64), nullable=False)
    
    calculates = db.relationship('Calculate', backref='alternatives')
    
    def __init__(self, id, nama, atribut):
        self.id = id or self.generate_unique_id()
        self.nama = nama
        self.atribut = atribut
        
    @staticmethod
    def generate_unique_id():
        alternative = db.session.query(func.count(Alternative.id)).scalar()
        return f"A{alternative + 1:02}"