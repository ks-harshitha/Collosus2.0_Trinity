from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io
import base64
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load your saved model
model = tf.keras.models.load_model('resnet50_retina_model.keras')
model = load_model('C:/Users/LENOVO/Desktop/retina/resnet50_retina_model.keras')
model.summary()
@app.route('/uploads', methods=['POST'])
def predict():
    data = request.get_json()

    if 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    image_data = base64.b64decode(data['image'])
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    image = image.resize((180, 180))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    class_index = np.argmax(prediction)

    # You can map class_index to real labels
    classes = ['Mild', 'Moderate', 'Severe', 'No_DR', 'Proliferate_DR']
    result = classes[class_index]

    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(debug=True)
