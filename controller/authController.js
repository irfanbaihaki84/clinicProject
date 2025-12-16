const user = require('../db/models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (!['1', '2'].includes(body.userType)) {
    throw new AppError('Invalid userType', 400);
  }

  // Check if email already exists
  const existingUser = await user.findOne({ where: { email: body.email } });
  if (existingUser) {
    // return next(new AppError('Email already exists', 400));
    return res.status(400).json({
      status: 'fail',
      message: 'Email already exists',
    });
  }

  if (body.password !== body.confirmPassword) {
    // return next(
    //   new AppError('Password confirmation does not match password', 400)
    // );
    return res.status(400).json({
      status: 'fail',
      message: 'Password confirmation does not match password',
    });
  }

  if (body.userName === '') {
    // return next(new AppError('Username cannot be empty', 400));
    return res.status(400).json({
      status: 'fail',
      message: 'Username cannot be empty',
    });
  }

  const newUser = await user.create({
    nik: body.nik,
    email: body.email,
    userType: body.userType,
    userName: body.userName,
    password: body.password,
    confirmPassword: body.confirmPassword,
    status: 'active',
  });

  if (!newUser) {
    // return next(new AppError('User creation failed', 500));
    return res.status(500).json({
      status: 'error',
      message: 'User creation failed',
    });
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({ id: result.id });

  return res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: result,
  });
});

const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  const existingUser = await user.findOne({ where: { email } });
  if (!existingUser) {
    return next(new AppError('Invalid email or password', 401));
  }

  const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordValid) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken({ id: existingUser.id });

  return res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      token,
    },
  });
});

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const existingUser = await user.findByPk(decoded.id);
    if (!existingUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized',
      });
    }
    req.user = existingUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized',
    });
  }
};

const restrictedTo = (...allowedTypes) => {
  const checkPermission = (req, res, next) => {
    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden',
      });
    }
    return next();
  };
  return checkPermission;
};

module.exports = {
  signup,
  signin,
  authenticate,
  restrictedTo,
};
