import random
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import joblib
classifier = joblib.load(
    './svm_model.pkl')
sc = joblib.load(
    './scaler.pkl')


def predict_value(index):
    mnist_image = X_test[index]
    true_label = y_test[index]
    scaled_image = sc.transform(mnist_image.reshape(1, -1))
    predicted_label = classifier.predict(scaled_image)


def predict_canvas(image):
    scaled_image = sc.transform(image.reshape(1, -1))
    predicted_label = classifier.predict(scaled_image)
    return predicted_label[0]
		


# Importing the dataset
train_data = pd.read_csv(
    './mnist_train.csv')
test_data = pd.read_csv(
    './mnist_test.csv')
X_train = train_data.iloc[:, 1:].values
y_train = train_data.iloc[:, 0].values

X_test = test_data.iloc[:, 1:].values
y_test = test_data.iloc[:, 0].values