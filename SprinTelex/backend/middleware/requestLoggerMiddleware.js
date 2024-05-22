const express = require('express');

const requestLoggerMiddleware = (req, res, next) => {
  console.log('Incoming Request:', req.method, req.path);
  // Removed logging of Authorization header for security reasons
  next();
};

module.exports = requestLoggerMiddleware;