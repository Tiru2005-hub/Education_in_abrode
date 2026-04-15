from flask import Blueprint, jsonify

timeline_bp = Blueprint("timeline", __name__)

@timeline_bp.route("/timeline", methods=["GET"])
def get_timeline():
    return jsonify({"message": "Timeline route stub"})
