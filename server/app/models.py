from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID unico
    username = db.Column(db.String(80), nullable=False)  # Nombre de usuario
    email = db.Column(db.String(120), unique=True, nullable=False)  # Email unico
    password_hash = db.Column(db.String(128), nullable=False)  # Contraseña hasheada
    tasks = db.relationship('Task', backref='user', lazy=True)  # Relación uno a muchos

    def set_password(self, password):
        # guarda la contraseña
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        # verifica la contraseña
        return check_password_hash(self.password_hash, password)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID tarea
    label = db.Column(db.String(200), nullable=False)  # Texto o titulo de la tarea
    completed = db.Column(db.Boolean, default=False)  # Estado completado o no
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # FK a usuario
