from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Task, User

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('', methods=['GET'])
@jwt_required()  # Protegemos la ruta para que solo usuarios autenticados puedan acceder
def get_tasks():
    user_id = get_jwt_identity()  # Obtiene ID usuario del token
    tasks = Task.query.filter_by(user_id=user_id).all()  # Tareas del usuario
    result = [{"id": t.id, "label": t.label, "completed": t.completed} for t in tasks]
    return jsonify(result), 200

@tasks_bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data.get('label'):
        return jsonify({"message": "Falta titulo"}), 400

    new_task = Task(label=data['label'], user_id=user_id)
    db.session.add(new_task)
    db.session.commit()

    return jsonify({"message": "Tarea creada", "id": new_task.id}), 201

@tasks_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=id, user_id=user_id).first()

    if not task:
        return jsonify({"message": "Tarea no encontrada"}), 404

    data = request.get_json()
    task.label = data.get('label', task.label)
    task.completed = data.get('completed', task.completed)

    db.session.commit()
    return jsonify({"message": "Tarea actualizada"}), 200

@tasks_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=id, user_id=user_id).first()

    if not task:
        return jsonify({"message": "Tarea no encontrada"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Tarea eliminada"}), 200
