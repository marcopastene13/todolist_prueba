from flask import Blueprint, request, jsonify
from app import db
from app.models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # validar campos obligatorios
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Faltan datos"}), 400

    # verificar si el email ya existe
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email ya registrado"}), 400

    # nuevo usuario y guarda password
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Usuario creado con éxito"}), 201

from flask_jwt_extended import create_access_token
from datetime import timedelta

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # valida datos recibidos
    if not data.get('email') or not data.get('password'):
        return jsonify({"message": "Datos faltantes"}), 400

    # busca usuario por email
    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"message": "Email o Contraseña invalidos"}), 401

    # crea token JWT válido por 30 min
    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(minutes=30))

    return jsonify({"access_token": access_token}), 200
