from config import ma
from models.calculate import Calculate

class CalculateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Calculate
        include_fk = True
        
calculate_schema = CalculateSchema()
calculates_schema = CalculateSchema(many=True)