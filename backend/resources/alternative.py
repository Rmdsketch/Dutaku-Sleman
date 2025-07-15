from flask_restful import Resource
from flask import request
from schemas.alternative import alternative_schema, alternatives_schema
from config import db
from models.alternative import Alternative

class AlternativeRoute(Resource):
    def get(self, identifier=None):
        if identifier is not None:
            alternative = Alternative.query.get(identifier)
            return alternative_schema.dump(alternative)
        else:
            alternatives = Alternative.query.all()
            return alternatives_schema.dump(alternatives)

    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: no data"}, 400

        json_data["id"] = Alternative.generate_unique_id()
        alternative = Alternative.query.filter_by(
            nama=json_data["nama"], atribut=json_data["atribut"]
        ).first()

        if alternative:
            return {
                "message": "Data alternatif sudah tersedia, silakan masukkan nama dan atribut berbeda!"
            }, 400

        data = alternative_schema.load(json_data)
        data["atribut"] = data["atribut"].capitalize()
        alternative = Alternative(**data)
        db.session.add(alternative)
        db.session.commit()
        result = alternative_schema.dump(alternative)
        return {
            "status": "Success",
            "message": "Data alternatif berhasil ditambahkan!",
            "data": result,
        }, 201

    def delete(self, identifier):
        alternative = Alternative.query.get(identifier)
        db.session.delete(alternative)
        db.session.commit()

        return {
            "status": "Success",
            "message": "Data alternatif berhasil dihapus!",
        }, 200

    def put(self, identifier):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: no data"}, 400

        data = alternative_schema.load(json_data)
        alternative = Alternative.query.filter_by(
            nama=json_data["nama"], atribut=json_data["atribut"]
        ).first()

        if alternative:
            return {
                "message": "Data alternatif sudah tersedia, silakan masukkan nama dan atribut berbeda!"
            }, 400
        alternative = Alternative.query.get(identifier)
        alternative.nama = data["nama"]
        alternative.atribut = data["atribut"]

        db.session.commit()
        result = alternative_schema.dump(alternative)
        return {
            "status": "Success",
            "message": "Data alternatif berhasil diperbarui!",
            "data": result,
        }, 200
        
    def patch(self, identifier):
        alternative = Alternative.query.get(identifier)
        if not alternative:
            return {"message": "Data alternatif tidak ditemukan"}, 404

        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: no data"}, 400

        data = alternative_schema.load(json_data, partial=True)
        for key, value in data.items():
            setattr(alternative, key, value)

        db.session.commit()
        result = alternative_schema.dump(alternative)
        return {"status": "Success", "data": result}, 200