const signup = (req, res, next) => {
  // Logic for user signup
  res.status(201).json({
    status: 'success',
    message: 'User signed up successfully',
  });
};

module.exports = { signup };
