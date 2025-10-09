from pymongo import MongoClient
import pandas as pd
import json
import random

client = MongoClient("mongodb://localhost:27017")
db = client.SkillFlow
user_cols = db.users
courses_cols = db.courses


#Load courses into dict

courses = list(courses_cols.find({}))
courses_map = {str(c['_id']) : c for c in courses}
courses_id = list(courses_map.keys())

rows = []

for u in user_cols.find({}):
    uid = str(u['_id'])

    skills = u.get('profile',{}).get('skills',[])
    skills_name = [s['name'] if isinstance(s,dict) else s for s in skills]
    goals = u.get('profile',{}).get('goals',[])
    user_text = " ".join(skills_name + list(map(str,goals)))

    enrolled = [str(e['course']) if isinstance(e,dict) and e.get('course') else str(e) for e in u.get('profile',{}).get('enrollments',[])]
    pos = set(enrolled)
    for cid in pos:
        c = courses_map.get(cid)
        if not c: continue
        course_text = " ".join([c.get('title',''),c.get('description','')] + [s if isinstance(s,str) else s.get('name','') for s in c.get('skills',[])])
        rows.append({'user_id' : uid,'course_id' : cid , 'user_text' :  user_text  , 'course_text' : course_text, 'label' : 1})

    neg_count = max(3, int(len(pos) * 2))
    neg_candidates = [cid for cid in courses_id if cid not in pos]
    neg_samples = random.sample(neg_candidates,min(len(neg_candidates),neg_count))
    for cid in neg_samples:
        c = courses_map[cid]
        course_text = " ".join([c.get('title',''), c.get('description','')] + [s if isinstance(s,str) else s.get('name','') for s in c.get('skills',[])])
        rows.append({'user_id' : uid,'course_id' : cid , 'user_text' :  user_text  , 'course_text' : course_text, 'label' : 0})


df = pd.DataFrame(rows)
df.to_csv('user_course_pairs.csv',index=False)
print("Saved",len(df),"rows")

