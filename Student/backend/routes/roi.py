from flask import Blueprint, jsonify

roi_bp = Blueprint("roi", __name__)

@roi_bp.route("/roi", methods=["GET"])
def get_roi():
    return jsonify({"message": "ROI route stub"})
