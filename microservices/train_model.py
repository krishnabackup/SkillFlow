import pandas as pd 
import numpy as np 
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from scipy.sparse import hstack
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score,roc_auc_score

df = pd.read_csv("user_course_pairs.csv")


train,test = train_test_split(df,test_size=0.2,random_state=42,stratify=df['label'])


# Fit a single vectorizer to the union of user and course text
all_texts = pd.concat([train['user_text'].fillna(''), train['course_text'].fillna('')])
shared_vec = TfidfVectorizer(max_features=8000, ngram_range=(1,2))
shared_vec.fit(all_texts)

# Transform with the shared vectorizer
X_user_train = shared_vec.transform(train['user_text'].fillna(''))
X_course_train = shared_vec.transform(train['course_text'].fillna(''))
X_train = hstack([X_user_train, X_course_train, X_user_train.multiply(X_course_train)])

X_user_test = shared_vec.transform(test['user_text'].fillna(''))
X_course_test = shared_vec.transform(test['course_text'].fillna(''))
X_test = hstack([X_user_test, X_course_test, X_user_test.multiply(X_course_test)])

y_train = train['label'].values
y_test = test['label'].values

print("Train shape:", X_train.shape)

# model
clf = LogisticRegression(
    max_iter=2000,
    solver='lbfgs',
    penalty='l2',
    tol=1e-3,
    n_jobs=-1
)
clf.fit(X_train, y_train)

# eval
p = clf.predict_proba(X_test)[:,1]
print("ROC AUC:", roc_auc_score(y_test, p))
print("Accuracy:", accuracy_score(y_test, (p>0.5).astype(int)))

# persist
joblib.dump({'shared_vec' : shared_vec , 'model': clf}, 'skill_match_model.joblib')