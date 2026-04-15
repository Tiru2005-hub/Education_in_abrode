from flask import Blueprint, jsonify

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/chatbot", methods=["GET"])
def get_chatbot():
    return jsonify({"message": "Chatbot route stub"})
