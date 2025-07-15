from flask_restful import Resource
from config import db
from models.alternative import Alternative
from models.criteria import Criteria
from models.calculate import Calculate

class SawRoute(Resource):
    def get(self): 
        alternatives = Alternative.query.all()
        criterias = Criteria.query.all()
        calculates = Calculate.query.all()

        normalized_data = {alt.id: {} for alt in alternatives}
        weights = {criteria.kriteria: criteria.bobot for criteria in criterias}

        # Menghitung nilai normalisasi untuk setiap kriteria
        for criteria in criterias:
            values = [
                calculate.nilai
                for calculate in calculates
                if calculate.criteria_id == criteria.id and calculate.nilai > 0
            ]

            if not values:
                continue

            min_value = 0
            max_value = 100

            if criteria.atribut.capitalize() == "Benefit":
                for calculate in calculates:
                    if calculate.criteria_id == criteria.id:
                        normalized_data[calculate.alternative_id][criteria.kriteria] = (
                            calculate.nilai / max_value if max_value > 0 else 0
                        )

            elif criteria.atribut.capitalize() == "Cost":
                for calculate in calculates:
                    if calculate.criteria_id == criteria.id:
                        normalized_data[calculate.alternative_id][criteria.kriteria] = (
                            min_value / calculate.nilai if calculate.nilai > 0 else 0
                        )
            # Menghitung nilai preferensi berdasarkan bobot
            preferences = {}
            for alt_id, criteria_scores in normalized_data.items():
                preferences[alt_id] = sum(
                    criteria_scores[kriteria] * weights[kriteria]
                    for kriteria in criteria_scores
                    if kriteria in weights
                )

            # Perankingan berdasarkan skor
            ranked_alternatives = []
            ranked_alternatives = sorted(
                [
                    {
                        "id": alt.id,
                        "nama": alt.nama,
                        "atribut": alt.atribut,
                        "skor": preferences[alt.id],
                    }
                    for alt in alternatives
                    if alt.id in preferences
                ],
                key=lambda x: x["skor"],
                reverse=True,
            )

        return {
            "normalizedMatrix": normalized_data,
            "preferences": preferences,
            "rankedAlternatives": ranked_alternatives,
        }