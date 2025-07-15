from flask_restful import Resource
from flask import request
from schemas.calculate import calculate_schema, calculates_schema
from config import db
from models.criteria import Criteria
from models.alternative import Alternative
from models.calculate import Calculate

class CalculateRoute(Resource):
    def get(self, identifier=None):
        if identifier is not None:
            calculate = Calculate.query.get(identifier)
            if not calculate:
                return {"message": "Data tidak ditemukan"}, 404
            return calculate_schema.dump(calculate), 200
        else:
            calculate = Calculate.query.all()
            return calculates_schema.dump(calculate), 200

    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: Tidak ada data!"}, 400

        json_data["id"] = Calculate.generate_unique_id()
        calculate = Calculate.query.filter_by(
            alternative_id=json_data["alternative_id"],
            criteria_id=json_data["criteria_id"],
        ).first()

        if calculate:
            return {
                "status": "Error",
                "message": "Data penilaian sudah ada, anda tidak dapat memasukkan data yang sama lagi!",
            }, 400

        data = calculate_schema.load(json_data)
        calculate = Calculate(**data)

        db.session.add(calculate)
        db.session.commit()
        result = calculate_schema.dump(calculate)
        return {
            "status": "Success",
            "message": "Data penilaian berhasil ditambahkan!",
            "data": result,
        }, 201

    def delete(self, identifier):
        calculate = Calculate.query.filter_by(alternative_id=identifier).all()
        if not calculate:
            return {"message": "Data tidak ditemukan"}, 404
        for data in calculate:
            db.session.delete(data)
        db.session.commit()

        return {
            "status": "Success",
            "message": "Data penilaian berhasil dihapus!",
        }, 200

    def patch(self, identifier):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: Tidak ada data!"}, 400

        calculate = Calculate.query.get(identifier)
        if not calculate:
            return {"message": "Data tidak ditemukan"}, 404

        data = calculate_schema.load(json_data, partial=True)
        for key, value in data.items():
            setattr(calculate, key, value)

        db.session.commit()
        result = calculate_schema.dump(calculate)
        return {
            "status": "Success",
            "message": "Data penilaian berhasil diperbarui!",
            "data": result,
        }, 200