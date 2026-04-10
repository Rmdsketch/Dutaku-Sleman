from flask_restful import Resource
from flask_jwt_extended import jwt_required
from config import db
from models.alternative import Alternative
from models.criteria import Criteria
from models.calculate import Calculate
from limiter import limiter

class SawRoute(Resource):
    decorators = [jwt_required(), limiter.limit("30 per minute")]

    def get(self):
        alternatives = Alternative.query.all()
        criterias = Criteria.query.all()
        calculates = Calculate.query.all()

        normalized_data = {alt.id: {} for alt in alternatives}
        weights = {criteria.name: criteria.weight for criteria in criterias}

        preferences = {}

        # Menghitung nilai normalisasi untuk setiap kriteria
        for criteria in criterias:
            values = [
                calculate.value
                for calculate in calculates
                if calculate.criteria_id == criteria.id and calculate.value > 0
            ]

            if not values:
                continue

            max_value = max(values)
            min_value = min(values)

            if criteria.attribute.capitalize() == "Benefit":
                for calculate in calculates:
                    if calculate.criteria_id == criteria.id:
                        normalized_data[calculate.alternative_id][criteria.name] = (
                            calculate.value / max_value if max_value > 0 else 0
                        )

            elif criteria.attribute.capitalize() == "Cost":
                for calculate in calculates:
                    if calculate.criteria_id == criteria.id:
                        normalized_data[calculate.alternative_id][criteria.name] = (
                            min_value / calculate.value
                            if calculate.value > 0
                            else 0
                        )

        # Menghitung nilai preferensi berdasarkan bobot
        for alt_id, criteria_scores in normalized_data.items():
            preferences[alt_id] = sum(
                criteria_scores[name] * weights[name]
                for name in criteria_scores
                if name in weights
            )

        # Perankingan berdasarkan skor
        ranked_alternatives = sorted(
            [
                {
                    "id": alt.id,
                    "name": alt.name,
                    "attribute": alt.attribute,
                    "score": preferences.get(alt.id, 0),
                }
                for alt in alternatives
                if alt.id in preferences
            ],
            key=lambda x: x["score"],
            reverse=True,
        )

        return {
            "normalizedMatrix": normalized_data,
            "preferences": preferences,
            "rankedAlternatives": ranked_alternatives,
        }
