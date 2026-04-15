from flask import Blueprint, jsonify

loan_bp = Blueprint("loan", __name__)

@loan_bp.route("/loan", methods=["GET"])
def get_loan():
    return jsonify({"message": "Loan route stub"})
