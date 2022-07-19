from flask import Flask, send_file, request
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
import werkzeug
import json
import time
import keras
import numpy as np
import cv2

from algorithms.backtracking import solve_sudoku_backtracking
from algorithms.norvig import solve_sudoku_norvig, to_norvig_grid, norvig_to_sudoku
from algorithms.ml import solve_sudoku_ml_inference, solve_sudoku_ml_once
from algorithms.validate import valid_solution
from image.digits import extract_digits
from image.warp import board_threshold

# Initialize app
app = Flask(__name__)
CORS(app)
api = Api(app)

# Load ML model
model = keras.models.load_model('../sudoku.model')

class NumpyArrayEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def convert_to_image(blob):
    image_bytes = blob.read()
    
    return cv2.imdecode(np.frombuffer(image_bytes, np.uint8), -1)

class Board(Resource):
    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
        parse.add_argument('threshold', type=int, location='form')
        args = parse.parse_args()

        res = board_threshold(convert_to_image(args['file']), args['threshold'])

        response = send_file(
            res,
            mimetype="image/png"
        )
        
        return response

class Digits(Resource):
    def post(self):
        parse = reqparse.RequestParser()
        parse.add_argument('file', type=werkzeug.datastructures.FileStorage, location='files')
        args = parse.parse_args()

        res = extract_digits(convert_to_image(args['file']))

        encodedNumpyData = json.dumps(res, cls=NumpyArrayEncoder)

        return {"sudoku": encodedNumpyData}

class AlgorithmBacktracking(Resource):
    def post(self):
        json_data = request.json
        
        sudoku = json_data["sudoku"]

        start = time.time()
        solve_sudoku_backtracking(sudoku, 0, 0)
        elapsed = time.time() - start

        encodedNumpyData = json.dumps(sudoku, cls=NumpyArrayEncoder)
        return {"sudoku": encodedNumpyData, "duration": elapsed*1000, "solved": valid_solution(sudoku)}

class AlgorithmNorvig(Resource):
    def post(self):
        json_data = request.json
        sudoku = json_data["sudoku"]

        grid = to_norvig_grid(sudoku)
        start = time.time()
        norvig = solve_sudoku_norvig(grid)
        elapsed = time.time() - start
        if not norvig:
            encodedNumpyData = json.dumps(sudoku, cls=NumpyArrayEncoder)
            return {"sudoku": encodedNumpyData, "duration": elapsed*1000, "solved": valid_solution(sudoku)}
        res = np.array(norvig_to_sudoku(norvig), dtype=int)

        encodedNumpyData = json.dumps(res, cls=NumpyArrayEncoder)
        return {"sudoku": encodedNumpyData, "duration": elapsed*1000, "solved": valid_solution(res)}

class AlgorithmMachineLearningOnce(Resource):
    def post(self):
        json_data = request.json
        sudoku = np.array(json_data["sudoku"])

        start = time.time()
        res = solve_sudoku_ml_once(model, sudoku)
        elapsed = time.time() - start

        encodedNumpyData = json.dumps(res, cls=NumpyArrayEncoder)
        return {"sudoku": encodedNumpyData, "duration": elapsed*1000, "solved": valid_solution(res)}

class AlgorithmMachineLearningInference(Resource):
    def post(self):
        json_data = request.json
        sudoku = np.array(json_data["sudoku"])

        start = time.time()
        res = solve_sudoku_ml_inference(model, sudoku)
        elapsed = time.time() - start

        encodedNumpyData = json.dumps(res, cls=NumpyArrayEncoder)
        return {"sudoku": encodedNumpyData, "duration": elapsed*1000, "solved": valid_solution(res)}

api.add_resource(Board, '/board')
api.add_resource(Digits, '/digits')
api.add_resource(AlgorithmBacktracking, '/algorithms/backtracking')
api.add_resource(AlgorithmNorvig, '/algorithms/norvig')
api.add_resource(AlgorithmMachineLearningOnce, '/algorithms/ml_once')
api.add_resource(AlgorithmMachineLearningInference, '/algorithms/ml_inference')



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=9877)