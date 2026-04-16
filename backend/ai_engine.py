import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle
import os

# Training data (Dummy for prototype)
# Real / Verified: 1, Fake / Suspicious: 0
TRAINING_DATA = [
    ("Flood warning in Chennai. Evacuate to higher ground.", 1),
    ("Government announces relief fund for cyclone victims.", 1),
    ("Satellite imagery confirms landslide in northern district.", 1),
    ("Drink warm water to cure all viruses instantly.", 0),
    ("Free money being distributed by government at every shop.", 0),
    ("Network towers are falling everywhere, run to the hills now!", 0),
    ("Official emergency broadcast: Storm approaching at 100kmph.", 1),
    ("Miracle cure for earthquake injuries discovered in turmeric.", 0),
]

class MisinformationDetector:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.model = MultinomialNB()
        self._train()

    def _train(self):
        texts, labels = zip(*TRAINING_DATA)
        X = self.vectorizer.fit_transform(texts)
        self.model.fit(X, labels)

    def analyze(self, text: str):
        X = self.vectorizer.transform([text])
        prediction = self.model.predict(X)[0]
        probs = self.model.predict_proba(X)[0]
        confidence = probs[prediction]

        if prediction == 1:
            if confidence > 0.8:
                return "Verified", confidence, "Matches official reporting patterns."
            else:
                return "Suspicious", confidence, "Fact-check required. Language pattern is unusual."
        else:
            return "Fake", confidence, "Contains hallmarks of misinformation or unverified claims."

detector = MisinformationDetector()

def get_detector():
    return detector
