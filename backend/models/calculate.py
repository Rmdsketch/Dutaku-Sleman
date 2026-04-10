from config import db

BASE_DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
BASE = len(BASE_DIGITS)
MAX_COMBINATIONS = BASE * BASE

class Calculate(db.Model):
    __tablename__ = "calculates"

    id = db.Column(db.String(3), primary_key=True)
    alternative_id = db.Column(db.String(3), db.ForeignKey("alternatives.id"), nullable=False)
    criteria_id = db.Column(db.String(5), db.ForeignKey("criterias.id"), nullable=False)
    value = db.Column(db.Float, nullable=False)

    def __init__(self, id, alternative_id, criteria_id, value):
        self.id = id or self.generate_unique_id()
        self.alternative_id = alternative_id
        self.criteria_id = criteria_id
        self.value = value

    @staticmethod
    def _decode_identifier(identifier):
        if not identifier or len(identifier) != 3 or identifier[0] != "R":
            return None
        try:
            high = BASE_DIGITS.index(identifier[1])
            low = BASE_DIGITS.index(identifier[2])
        except ValueError:
            return None
        return high * BASE + low

    @staticmethod
    def _encode_identifier(value):
        if value >= MAX_COMBINATIONS:
            raise ValueError("Maximum Calculate IDs reached.")
        high = value // BASE
        low = value % BASE
        return f"R{BASE_DIGITS[high]}{BASE_DIGITS[low]}"

    @staticmethod
    def generate_unique_id():
        max_numeric = -1
        for (identifier,) in db.session.query(Calculate.id).all():
            decoded = Calculate._decode_identifier(identifier)
            if decoded is not None:
                max_numeric = max(max_numeric, decoded)
        next_numeric = max_numeric + 1
        return Calculate._encode_identifier(next_numeric)
