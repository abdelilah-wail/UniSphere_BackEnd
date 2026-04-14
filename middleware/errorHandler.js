const errorHandler = (err, req, res, next) => {
  console.error('\n❌ Error:'.red || '\n❌ Error:');
  console.error(err.stack || err.message);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Resource not found (invalid ID format)',
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `Duplicate value for '${field}'. This ${field} is already taken.`,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: messages.join(', '),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired, please login again',
    });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
