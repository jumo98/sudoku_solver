from image.digits import extract_digits
from image.warp import board_threshold
from flask import Flask, send_file
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
import werkzeug
import json

import numpy as np
import cv2

app = Flask(__name__)
CORS(app)
api = Api(app)

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

        print(args)

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
        print(args)

        # cv2.imwrite("blah.png", convert_to_image(args['file']))

        res = extract_digits(convert_to_image(args['file']))

        encodedNumpyData = json.dumps(res, cls=NumpyArrayEncoder)  # use dump() to write array into file
        print("Printing JSON serialized NumPy array")

        return {"sudoku": encodedNumpyData}

api.add_resource(Board, '/board')
api.add_resource(Digits, '/digits')

if __name__ == '__main__':
    app.run(debug=True)