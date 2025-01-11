from config import ma
from models.criteria import Criteria

class CriteriaSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Criteria
    
criteria_schema = CriteriaSchema()
criterias_schema = CriteriaSchema(many=True)