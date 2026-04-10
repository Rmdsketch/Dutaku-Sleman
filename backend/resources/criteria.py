from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from schemas.criteria import criteria_schema, criterias_schema
from config import db
from models.criteria import Criteria
from models.calculate import Calculate
from limiter import limiter

class CriteriaRoute(Resource):
    decorators = [jwt_required(), limiter.limit("30 per minute")]

    def get(self, identifier=None):
        if identifier is not None:
            criteria = Criteria.query.get(identifier)
            if not criteria:
                return {"message": "Data kriteria tidak ditemukan"}, 404
            return criteria_schema.dump(criteria)
        else:
            criterias = (
                Criteria.query.order_by(func.length(Criteria.id), Criteria.id).all()
            )
            return criterias_schema.dump(criterias)

    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: Tidak ada data!"}, 400

        json_data["id"] = Criteria.generate_unique_id()
        data = criteria_schema.load(json_data)
        criteria = Criteria(**data)

        db.session.add(criteria)
        db.session.commit()
        result = criteria_schema.dump(criteria)

        return {"status": "success", "data": result}, 201

    def delete(self, identifier):
        criteria = Criteria.query.get(identifier)
        if not criteria:
            return {"message": "Data kriteria tidak ditemukan"}, 404

        Calculate.query.filter_by(criteria_id=identifier).delete(synchronize_session=False)
        db.session.delete(criteria)
        db.session.commit()
        return {
            "status": "Success",
            "message": "Data kriteria berhasil dihapus!",
        }, 200

    def put(self, identifier):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: Tidak ada data!"}, 400

        data = criteria_schema.load(json_data)
        criteria = Criteria.query.get(identifier)
        if not criteria:
            return {"message": "Data kriteria tidak ditemukan"}, 404
        criteria.name = data["name"]
        criteria.weight = data["weight"]
        criteria.attribute = data["attribute"]

        db.session.commit()
        result = criteria_schema.dump(criteria)
        return {"status": "Success", "data": result}, 200

    def patch(self, identifier):
        criteria = Criteria.query.get(identifier)
        if not criteria:
            return {"message": "Data kriteria tidak ditemukan"}, 404

        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: Tidak ada data!"}, 400

        data = criteria_schema.load(json_data, partial=True)
        for key, value in data.items():
            setattr(criteria, key, value)

        db.session.commit()
        result = criteria_schema.dump(criteria)
        return {"status": "Success", "data": result}, 200


class CriteriaWeightRoute(Resource):
    decorators = [jwt_required(), limiter.limit("30 per minute")]

    def patch(self):
        payload = request.get_json()
        if not payload:
            return {"message": "Error: Tidak ada data!"}, 400

        updates = payload.get("weights") or payload.get("data")
        if not isinstance(updates, list) or not updates:
            return {"message": "Error: Format data tidak valid"}, 400

        updated_items = []
        for item in updates:
            criteria_id = item.get("id")
            weight = item.get("weight")
            if not criteria_id or weight is None:
                continue

            criteria = Criteria.query.get(criteria_id)
            if not criteria:
                continue

            try:
                criteria.weight = float(weight)
                updated_items.append(criteria_id)
            except (TypeError, ValueError):
                continue

        if not updated_items:
            return {"message": "Tidak ada data yang diperbarui"}, 400

        db.session.commit()
        return {
            "status": "Success",
            "message": f"{len(updated_items)} bobot kriteria diperbarui.",
            "updated": updated_items,
        }, 200
