# serve_model.py
from fastapi import FastAPI
import joblib
import numpy as np
from scipy.sparse import hstack, vstack
from pymongo import MongoClient
from pydantic import BaseModel

app = FastAPI()

# load model
data = joblib.load('skill_match_model.joblib')
shared_vec = data['shared_vec']
model = data['model']

# load courses + precompute course vectors & cache course ids
client = MongoClient("mongodb://localhost:27017")
db = client.SkillFlow
courses = list(db.courses.find({}))
course_ids = [str(c['_id']) for c in courses]
course_texts = [" ".join([c.get('title',''), c.get('description','')] + [s if isinstance(s,str) else s.get('name','') for s in c.get('skills',[])]) for c in courses]

course_matrix = shared_vec.transform(course_texts)  # sparse matrix (n_courses x features)

class Payload(BaseModel):
    user_text: str
    top_n: int = 10

@app.post("/recommend")
def recommend(p: Payload):
    user_v = shared_vec.transform([p.user_text])  # 1 x F
    # create pair matrix: repeat user_v n_courses
    # sparse repeat
    reps = vstack([user_v] * course_matrix.shape[0])  # careful: ok for small n
    pair_X = hstack([reps, course_matrix, reps.multiply(course_matrix)])
    probs = model.predict_proba(pair_X)[:,1]
    idx = np.argsort(probs)[-p.top_n:][::-1]
    return [{'course_id': course_ids[i], 'score': float(probs[i])} for i in idx]
