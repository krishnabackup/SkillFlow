from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Load model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-large")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-large")

# User profile data (simulate your existing data)
goal = "Full-stack Developer"
experience = "Junior Developer"
skills = ["JavaScript", "React", "Node.js"]

# Create structured prompt for roadmap generation
user_prompt = f"""
You are an expert career mentor who creates structured skill-learning roadmaps.
Your job is to return a JSON roadmap for a learner.
Generate a skill roadmap for a user who wants to become a {goal} or learn a {goal}.
Use the following existing skills: {skills} with Experience {experience}.
Each roadmap must contain multiple "stages" showing what to learn first, next, and finally.
It should also include totalduration of roadmap.
Output the roadmap in structured JSON following this format:
{{
 "title": string,
 "totalduration": number,
 "stages": [
 {{
 "stage": string,
 "description": string,
"durationperweeks": number,
"skills": [string],
"recommended_courses": [string]
}}
 ]
}}
"""

# Tokenize input prompt
inputs = tokenizer(user_prompt, return_tensors="pt")

# Generate output tokens (you can adjust max_length for longer outputs)
outputs = model.generate(**inputs, max_length=512, num_return_sequences=1)

# Decode and print output text
generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
print(generated_text)
