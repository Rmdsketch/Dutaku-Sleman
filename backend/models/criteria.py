import re
from config import db
from models.calculate import Calculate

class Criteria(db.Model):
    __tablename__ = 'criterias'

    id = db.Column(db.String(5), primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    attribute = db.Column(db.String(64), nullable=False)

    calculates = db.relationship("Calculate", backref="criterias")

    def __init__(self, id, name, weight, attribute):
        self.id = id or self.generate_unique_id()
        self.name = name
        self.weight = weight
        self.attribute = attribute

    @staticmethod
    def _max_numeric_suffix():
        ids = db.session.query(Criteria.id).all()
        max_num = 0
        for (identifier,) in ids:
            match = re.search(r"\d+", identifier or "")
            if match:
                max_num = max(max_num, int(match.group()))
        return max_num

    @staticmethod
    def generate_unique_id():
        next_number = Criteria._max_numeric_suffix() + 1
        return f"C{next_number}"
