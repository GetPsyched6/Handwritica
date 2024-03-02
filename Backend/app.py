from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import base64
import numpy as np
from io import BytesIO
from PIL import Image
from predict import predict_canvas

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/', methods=['POST'])
@cross_origin()
def predict_digit():
    # Get the base64 encoded image data from the request JSON body
    image_data = request.json['image']

    # Decode the base64 image data
    decoded_image_data = base64.b64decode(image_data)

    # Convert the image data to a PIL Image object
    image = Image.open(BytesIO(decoded_image_data)).convert('L')

    # Resize the image to 28x28 pixels (if required)
    resized_image = image.resize((28, 28))

    # Convert the PIL Image to a NumPy array``
    image_array = np.asarray(resized_image)

    # Process the image and make predictions using your model
    predicted_digit = int(predict_canvas(image_array))

    # Return the predicted digit as a JSON response
    return jsonify(predicted_digit=predicted_digit)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
