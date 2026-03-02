from flask import Flask, request, jsonify
from flask_cors import CORS
from bratchoku import Bratchoku

app = Flask(__name__)
CORS(app)

@app.route("/api/python/play", methods=["POST"])
def play():
    data = request.get_json()
    
    if not data or "blackBitboard" not in data or "whiteBitboard" not in data:
        return jsonify({"error": "Missing bitboards"}), 400
    bratchoku = Bratchoku()
    
    blackBitboard = int(data['blackBitboard'], 16)
    whiteBitboard = int(data['whiteBitboard'], 16)
    depth = 4

    result = bratchoku.play(blackBitboard, whiteBitboard, depth)
    time = result[1]
    if time == 0.00: 
        time = 0.01
    

    return jsonify({"move": result[0], "depth": depth, "time": result[1], "nodes": result[2], "nps": result[2]/time}), 200

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)