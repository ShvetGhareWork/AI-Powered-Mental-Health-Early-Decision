from flask import Flask, request, jsonify
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np

app = Flask(__name__)

# Load Emotion Model (Pipeline-based)
emotion_classifier = pipeline("text-classification", model="nateraw/bert-base-uncased-emotion")

# Load CardiffNLP Sentiment Model
sentiment_tokenizer = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment")
sentiment_model = AutoModelForSequenceClassification.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment")
sentiment_labels = ['negative', 'neutral', 'positive']

# Helper: Normalize to percentage
def normalize(score, total):
    return round((score / total) * 100) if total > 0 else 0

# Helper: Detect depressive/self-harm triggers
def is_mental_trigger(sentence):
    triggers = [
        "i feel", "i'm", "i am", "can’t", "want to die", "worthless", "hopeless",
        "tired", "no one", "cry", "don't want to live", "kill myself"
    ]
    return any(phrase in sentence.lower() for phrase in triggers)

# Sentiment using CardiffNLP
def get_sentiment(text):
    encoded_input = sentiment_tokenizer(text, return_tensors='pt', truncation=True)
    with torch.no_grad():
        output = sentiment_model(**encoded_input)
    scores = output[0][0].numpy()
    probs = np.exp(scores) / np.sum(np.exp(scores))  # softmax
    max_idx = int(np.argmax(probs))
    return {
        "label": sentiment_labels[max_idx].capitalize(),
        "confidence": round(float(probs[max_idx]), 2)
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    textInput = data.get('textInput', '')
    print("🔍 Received text:", textInput)

    # Emotion analysis
    emotion_result = emotion_classifier(textInput, top_k=5)
    formatted_emotions = [
        {"emotion": item["label"], "confidence": round(item["score"], 2)}
        for item in emotion_result
    ]
    emotion_scores = {item["emotion"]: item["confidence"] for item in formatted_emotions}
    total_conf = sum(emotion_scores.values())

    # Define emotional contributors
    def sum_confidence(emotions):
        return sum([emotion_scores.get(e, 0) for e in emotions])

    suicide_score = sum_confidence(["sadness", "grief", "remorse"])
    anxiety_score = sum_confidence(["fear", "nervousness", "confusion"])
    depression_score = sum_confidence(["sadness", "grief", "disappointment"])
    stress_score = sum_confidence(["anger", "fear", "annoyance"])

    # Boost score if depressive sentence pattern
    sentence_boost = 1.2 if is_mental_trigger(textInput) else 1.0

    def classify_risk(score):
        adjusted = normalize(score * sentence_boost, total_conf)
        if adjusted >= 70:
            return "High", adjusted
        elif adjusted >= 40:
            return "Moderate", adjusted
        else:
            return "Low", adjusted

    # Mood Stability
    confidences = list(emotion_scores.values())
    mood_stability = "Unstable" if max(confidences) - min(confidences) > 0.5 else "Stable"

    # Cognitive Clarity
    cognitive_clarity = "Unclear" if emotion_scores.get("confusion", 0) > 0.5 else "Clear"

    # Sentiment analysis
    sentiment = get_sentiment(textInput)

    # Final response
    return jsonify({
        "emotions": formatted_emotions,
        "mental_health": {
            "suicide_risk": {
                "level": classify_risk(suicide_score)[0],
                "percentage": classify_risk(suicide_score)[1]
            },
            "anxiety": {
                "level": classify_risk(anxiety_score)[0],
                "percentage": classify_risk(anxiety_score)[1]
            },
            "depression": {
                "level": classify_risk(depression_score)[0],
                "percentage": classify_risk(depression_score)[1]
            },
            "stress": {
                "level": classify_risk(stress_score)[0],
                "percentage": classify_risk(stress_score)[1]
            },
            "mood_stability": mood_stability,
            "cognitive_clarity": cognitive_clarity
        },
        "sentiment": sentiment
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
