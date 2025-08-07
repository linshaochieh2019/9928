const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeRoles('teacher'), (req, res) => {
  res.json({ message: `Welcome Teacher ID: ${req.user.id}` });
});

module.exports = router;
