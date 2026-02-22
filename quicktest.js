const axios = require('axios');

axios.post('http://localhost:5000/api/auth/register', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
})
.then(res => {
  console.log('SUCCESS!');
  console.log(JSON.stringify(res.data, null, 2));
})
.catch(err => {
  console.log('ERROR!');
  console.log(err.response?.data || err.message);
});