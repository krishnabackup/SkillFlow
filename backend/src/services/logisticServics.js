const res = await fetch('http://127.0.0.1:8000/recommend', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ user_text: 'html css react', top_n: 10 })
});
const recs = await res.json();

console.log(recs)