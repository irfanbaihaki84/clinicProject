const express = require('express');
// require('dotenv').config({ path: `${__dirname}/.env` });
require('dotenv').config({ path: `${process.cwd()}/.env` });

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'REST API is working fine',
//   });
// });

// all routes will be here
const authRoute = require('./route/authRoute');
const AppError = require('./utils/appError');
const catchAsync = require('./utils/catchAsync');
const globalErrorHandler = require('./controller/errorController');
app.use('/api/v1/auth', authRoute);

app.use(
  '',
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  })
);

// error handling middleware
app.use(globalErrorHandler);

const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
