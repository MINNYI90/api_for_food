const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection(process.env.DATABASE_URL);

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Hello world!!');
});

// Get all food and drink items
app.get('/food_and_drinks', (req, res) => {
  connection.query('SELECT * FROM food_and_drinks', (err, results) => {
    if (err) {
      console.error('Error fetching food and drinks:', err);
      res.status(500).send('Error fetching items');
    } else {
      res.status(200).json(results);
    }
  });
});

// Get a specific food or drink item by ID
app.get('/food_and_drinks/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM food_and_drinks WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching item by ID:', err);
      res.status(500).send('Error fetching item');
    } else {
      res.status(200).json(results);
    }
  });
});

// Create a new food or drink item
app.post('/food_and_drinks', (req, res) => {
  const { name, category, price, image_url } = req.body;
  connection.query(
    'INSERT INTO food_and_drinks (name, category, price, image_url) VALUES (?, ?, ?, ?)',
    [name, category, price, image_url],
    (err, results) => {
      if (err) {
        console.error('Error adding item:', err);
        res.status(500).send('Error adding item');
      } else {
        res.status(201).json(results);
      }
    }
  );
});

// Get all login users (users table)
app.get('/login', (req, res) => {
  connection.query('SELECT * FROM login', (err, results) => {
    if (err) {
      console.error('Error fetching login users:', err);
      res.status(500).send('Error fetching login data');
    } else {
      res.status(200).json(results);
    }
  });
});

// access the login table
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
  
    // Query to check user credentials
    connection.query(
      'SELECT * FROM login WHERE username = ? AND password = ?',
      [username, password],
      (err, results) => {
        if (err) {
          console.error('Error authenticating user:', err);
          res.status(500).json({ message: 'Internal server error.' });
        } else if (results.length === 0) {
          // If no user matches the credentials
          res.status(401).json({ message: 'Invalid username or password.' });
        } else {
          // If user is authenticated successfully
          const user = results[0];
          res.status(200).json({
            message: 'Login successful!',
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              status: user.status,
              password: user.password,
            },
          });
        }
      }
    );
  });

// Start the server on Vercel
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
  });
  

// Export for Vercel to work correctly
module.exports = app;
