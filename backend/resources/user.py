from flask_restful import Resource
from flask import request
from schemas.user import user_schema, users_schema
from config import db
from models.user import User, Role

class UserRoute(Resource):
    def get(self, identifier=None):
        if identifier is not None:
            user = User.query.get(identifier)
            if not user:
                return {"message": "User tidak ditemukan"}, 404
            return user_schema.dump(user), 200
        else:
            users = User.query.all()
            return users_schema.dump(users), 200

    def delete(self, identifier):

        user = User.query.get(identifier)
        if not user:
            return {"message": "User tidak ditemukan"}, 404

        db.session.delete(user)
        db.session.commit()

        return {"status": "User dihapus"}, 204



    def put(self, identifier):
        json_data = request.get_json()
        if not json_data:
            return {"message": "Error: Tidak ada data!"}, 400

        user = User.query.get(identifier)
        if not user:
            return {"message": "User tidak ditemukan"}, 404

        user.username = json_data.get("username", user.username)
        user.email = json_data.get("email", user.email)

        if "password" in json_data:
            user.set_password(json_data["password"])

        role_name = json_data.get("role", None)
        if role_name:
            role_name = role_name.capitalize()
            if role_name in Role.__members__:
                user.role = Role[role_name].value
            else:
                return {
                    "message": "Error: Role tidak valid. Pilih salah satu: Admin atau Juri"
                }, 400

        db.session.commit()
        return {"status": "Success", "data": user_schema.dump(user)}, 200

    def patch(self, identifier):
        user = User.query.get(identifier)
        if not user:
            return {"message": "Error: User tidak ditemukan"}, 404

        json_data = request.get_json()
        if not json_data:
            return {"message": "Tidak ada data!"}, 400

        data = user_schema.load(json_data, partial=True)
        for key, value in data.items():
            if key == "password":
                user.set_password(value)
            else:
                setattr(user, key, value)

        db.session.commit()
        result = user_schema.dump(user)
        return {"status": "Success", "data": result}, 200