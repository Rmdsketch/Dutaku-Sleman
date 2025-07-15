from config import ma
from models.alternative import Alternative

class AlternativeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Alternative
    
alternative_schema = AlternativeSchema()
alternatives_schema = AlternativeSchema(many=True)