const { user } = require('../db/models/user');

const signup = async (req, res, next) => {
  const body = req.body;

  if (!['1', '2'].includes(body.userType) && !body.email) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email is required for userType 1 and 2',
    });
  }

  const newUser = await user.create({
    nik: body.nik,
    email: body.email,
    userType: body.userType,
    userName: body.userName,
    password: body.password,
    status: 'active',
  });

  if (!newUser) {
    return res.status(500).json({
      status: 'fail',
      message: 'User creation failed',
    });
  }

  return res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    data: newUser,
  });
};

module.exports = { signup };
