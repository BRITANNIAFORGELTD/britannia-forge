// Vercel serverless function wrapper
const { createServer } = require('http');
const { parse } = require('url');
const express = require('express');

// Import your existing server
const app = require('../dist/index.js');

module.exports = (req, res) => {
  return app(req, res);
};