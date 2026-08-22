fetch('http://localhost:3000/api/enroll', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: "Gabo Test Node",
    email: "test.node@cemproza.com",
    phone: "999888777",
    course: "design"
  }),
  redirect: 'manual'
})
.then(res => {
  console.log("Status:", res.status);
  if (res.status === 307 || res.status === 302) {
    console.log("Redirected to:", res.headers.get('location'));
  } else {
    return res.text().then(text => console.log("Response:", text));
  }
})
.catch(err => console.error("Error:", err));
