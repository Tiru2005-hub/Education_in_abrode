"""
EduVerse AI – Flask Backend
Run: python app.py
"""
from flask import Flask
from flask_cors import CORS

from routes.career   import career_bp
from routes.roi      import roi_bp
from routes.loan     import loan_bp
from routes.chatbot  import chatbot_bp
from routes.timeline import timeline_bp

app = Flask(__name__)
CORS(app)  # Allow React frontend on localhost:3000

# Register blueprints
app.register_blueprint(career_bp)
app.register_blueprint(roi_bp)
app.register_blueprint(loan_bp)
app.register_blueprint(chatbot_bp)
app.register_blueprint(timeline_bp)

@app.route("/")
def health():
    return {"status": "EduVerse AI backend running", "version": "1.0.0"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)
