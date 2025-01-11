from flask_restful import Resource
from flask import request
from schemas.criteria import criteria_schema, criterias_schema
from config import db
from models.criteria import Criteria

class CriteriaRoute(Resource):
    def get(self, identifier=None):
        if identifier is not None:
            criteria = Criteria.query.get(identifier)
            return criteria_schema.dump(criteria)
        else:
            criterias = Criteria.query.all()
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
        criteria.kode = data["kode"]
        criteria.kriteria = data["kriteria"]
        criteria.bobot = data["bobot"]
        criteria.atribut = data["atribut"]

        db.session.commit()
        result = criteria_schema.dump(criteria)
        return {"status": "Success", "data": result}, 204

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