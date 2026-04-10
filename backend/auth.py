from flask import jsonify
from flask_jwt_extended import JWTManager

def config_auth(app):
    global jwt
    app.config["JWT_SECRET_KEY"] = "78e9bc2793402c3117a056d1c781c4cae1a805c9c5700ce999d04a4e125c908d"
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"

    jwt = JWTManager(app)

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "message": "Token sudah kedaluwarsa. Silakan login ulang.",
            "error": "token_expired"
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "message": "Token tidak valid.",
            "error": "invalid_token"
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "message": "Akses ditolak. Token tidak ditemukan.",
            "error": "authorization_required"
        }), 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "message": "Token telah dicabut.",
            "error": "token_revoked"
        }), 401