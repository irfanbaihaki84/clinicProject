const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'REST API is working fine',
  });
});

// all routes will be here
const authRoute = require('./route/authRoute');
app.use('/api/v1/auth', authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
