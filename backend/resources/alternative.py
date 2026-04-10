from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from schemas.alternative import alternative_schema, alternatives_schema
from config import db
from models.alternative import Alternative
from limiter import limiter

class AlternativeRoute(Resource):
    decorators = [jwt_required(), limiter.limit("30 per minute")]

    def get(self, identifier=None):
        if identifier is not None:
            alternative = Alternative.query.get(identifier)
            if not alternative:
                return {"message": "Data alternatif tidak ditemukan"}, 404
            return alternative_schema.dump(alternative)
        else:
            alternatives = Alternative.query.all()
            return alternatives_schema.dump(alternatives)

    def post(self):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: no data"}, 400

        attribute_value = json_data.get("attribute")
        if attribute_value:
            attribute_value = attribute_value.capitalize()
            json_data["attribute"] = attribute_value

        alternative = Alternative.query.filter_by(
            name=json_data.get("name"), attribute=attribute_value
        ).first()

        if alternative:
            return {
                "message": "Data alternatif sudah tersedia, silakan masukkan name dan attribute berbeda!"
            }, 400

        json_data["id"] = Alternative.generate_unique_id()
        data = alternative_schema.load(json_data)
        data["attribute"] = data["attribute"].capitalize()
        attempt = 0
        while attempt < 5:
            try:
                json_data["id"] = Alternative.generate_unique_id()
                data = alternative_schema.load(json_data)
                data["attribute"] = data["attribute"].capitalize()
                alternative = Alternative(**data)
                db.session.add(alternative)
                db.session.commit()
                result = alternative_schema.dump(alternative)
                return {
                    "status": "Success",
                    "message": "Data alternatif berhasil ditambahkan!",
                    "data": result,
                }, 201
            except IntegrityError as exc:
                db.session.rollback()
                message = str(exc.orig)
                if "Duplicate entry" in message and "alternatives.PRIMARY" in message:
                    attempt += 1
                    continue
                raise

    def delete(self, identifier):
        alternative = Alternative.query.get(identifier)
        if not alternative:
            return {"message": "Data alternatif tidak ditemukan"}, 404
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
        duplicate = Alternative.query.filter_by(
            name=json_data["name"], attribute=json_data["attribute"]
        ).first()

        if duplicate:
            return {
                "message": "Data alternatif sudah tersedia, silakan masukkan name dan attribute berbeda!"
            }, 400

        alternative = Alternative.query.get(identifier)
        if not alternative:
            return {"message": "Data alternatif tidak ditemukan"}, 404
        alternative.name = data["name"]
        alternative.attribute = data["attribute"]

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
