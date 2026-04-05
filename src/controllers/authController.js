const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, country, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'username, email and password are required' 
      });
    }

    const existingUser = await pool.query(
      'SELECT user_id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        success: false, 
        error: 'Username or email already exists' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
      INSERT INTO users (username, email, country, password)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, username, email, country, created_at
    `, [username, email, country, hashedPassword]);

    const user = result.rows[0];
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'email and password are required' 
      });
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    const user = result.rows[0];

    if (!user.password) {
      return res.status(401).json({ 
        success: false, 
        error: 'Please register again with a password' 
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        country: user.country
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { register, login };