/* eslint-env node */
/* eslint-disable no-undef */
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'rizkyprovidervisa_secret_key_2024';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads-rizkyprovidervisa')));

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rizkyprovidervisa'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Ensure countries.flag column exists for storing country flag (emoji or short code)
  db.query("SHOW COLUMNS FROM countries LIKE 'flag'", (err, results) => {
    if (err) {
      console.error('Failed checking columns for countries.flag:', err);
      return;
    }
    if (!results || results.length === 0) {
      db.query('ALTER TABLE countries ADD COLUMN flag VARCHAR(50) NULL AFTER code', (alterErr) => {
        if (alterErr) {
          console.error('Failed adding countries.flag column:', alterErr);
        } else {
          console.log('Added countries.flag column');
        }
      });
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads-rizkyprovidervisa');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admin_users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error server' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  });
});

app.get('/api/countries', (req, res) => {
  db.query('SELECT * FROM countries ORDER BY name', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching countries' });
    }
    res.json(results);
  });
});

app.get('/api/countries/:id', (req, res) => {
  db.query('SELECT * FROM countries WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching country' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Country not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/countries', authenticateToken, upload.single('image'), (req, res) => {
  const { name, code, description, flag } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    'INSERT INTO countries (name, code, flag, image, description) VALUES (?, ?, ?, ?, ?)',
    [name, code, flag || null, image, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating country' });
      }
      res.json({ id: result.insertId, message: 'Country created successfully' });
    }
  );
});

app.put('/api/countries/:id', authenticateToken, upload.single('image'), (req, res) => {
  const { name, code, description, flag } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  let query = 'UPDATE countries SET name = ?, code = ?, flag = ?, description = ?';
  let params = [name, code, flag || null, description];

  if (image) {
    query += ', image = ?';
    params.push(image);
  }

  query += ' WHERE id = ?';
  params.push(req.params.id);

  db.query(query, params, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating country' });
    }
    res.json({ message: 'Country updated successfully' });
  });
});

app.delete('/api/countries/:id', authenticateToken, (req, res) => {
  db.query('DELETE FROM countries WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting country' });
    }
    res.json({ message: 'Country deleted successfully' });
  });
});

app.get('/api/visa-types', (req, res) => {
  const { country_id } = req.query;

  let query = 'SELECT vt.*, c.name as country_name FROM visa_types vt JOIN countries c ON vt.country_id = c.id';
  let params = [];

  if (country_id) {
    query += ' WHERE vt.country_id = ?';
    params.push(country_id);
  }

  query += ' ORDER BY vt.name';

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching visa types' });
    }
    res.json(results);
  });
});

app.post('/api/visa-types', authenticateToken, (req, res) => {
  const { country_id, name } = req.body;

  db.query(
    'INSERT INTO visa_types (country_id, name) VALUES (?, ?)',
    [country_id, name],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating visa type' });
      }
      res.json({ id: result.insertId, message: 'Visa type created successfully' });
    }
  );
});

app.put('/api/visa-types/:id', authenticateToken, (req, res) => {
  const { name } = req.body;

  db.query('UPDATE visa_types SET name = ? WHERE id = ?', [name, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating visa type' });
    }
    res.json({ message: 'Visa type updated successfully' });
  });
});

app.delete('/api/visa-types/:id', authenticateToken, (req, res) => {
  db.query('DELETE FROM visa_types WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting visa type' });
    }
    res.json({ message: 'Visa type deleted successfully' });
  });
});

app.get('/api/visa-categories', (req, res) => {
  const { visa_type_id } = req.query;

  let query = 'SELECT vc.*, vt.name as visa_type_name FROM visa_categories vc JOIN visa_types vt ON vc.visa_type_id = vt.id';
  let params = [];

  if (visa_type_id) {
    query += ' WHERE vc.visa_type_id = ?';
    params.push(visa_type_id);
  }

  query += ' ORDER BY vc.name';

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching visa categories' });
    }
    res.json(results);
  });
});

app.post('/api/visa-categories', authenticateToken, (req, res) => {
  const { visa_type_id, name } = req.body;

  db.query(
    'INSERT INTO visa_categories (visa_type_id, name) VALUES (?, ?)',
    [visa_type_id, name],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating visa category' });
      }
      res.json({ id: result.insertId, message: 'Visa category created successfully' });
    }
  );
});

app.put('/api/visa-categories/:id', authenticateToken, (req, res) => {
  const { name } = req.body;

  db.query('UPDATE visa_categories SET name = ? WHERE id = ?', [name, req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating visa category' });
    }
    res.json({ message: 'Visa category updated successfully' });
  });
});

app.delete('/api/visa-categories/:id', authenticateToken, (req, res) => {
  db.query('DELETE FROM visa_categories WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting visa category' });
    }
    res.json({ message: 'Visa category deleted successfully' });
  });
});

app.get('/api/visa-details', (req, res) => {
  const { visa_category_id } = req.query;

  let query = 'SELECT vd.*, vc.name as category_name FROM visa_details vd JOIN visa_categories vc ON vd.visa_category_id = vc.id';
  let params = [];

  if (visa_category_id) {
    query += ' WHERE vd.visa_category_id = ?';
    params.push(visa_category_id);
  }

  query += ' ORDER BY vd.process_type';

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching visa details' });
    }
    res.json(results);
  });
});

app.post('/api/visa-details', authenticateToken, (req, res) => {
  const { visa_category_id, process_type, processing_time, price, requirements } = req.body;

  db.query(
    'INSERT INTO visa_details (visa_category_id, process_type, processing_time, price, requirements) VALUES (?, ?, ?, ?, ?)',
    [visa_category_id, process_type, processing_time, price, requirements],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating visa detail' });
      }
      res.json({ id: result.insertId, message: 'Visa detail created successfully' });
    }
  );
});

app.put('/api/visa-details/:id', authenticateToken, (req, res) => {
  const { process_type, processing_time, price, requirements } = req.body;

  db.query(
    'UPDATE visa_details SET process_type = ?, processing_time = ?, price = ?, requirements = ? WHERE id = ?',
    [process_type, processing_time, price, requirements, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating visa detail' });
      }
      res.json({ message: 'Visa detail updated successfully' });
    }
  );
});

app.delete('/api/visa-details/:id', authenticateToken, (req, res) => {
  db.query('DELETE FROM visa_details WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting visa detail' });
    }
    res.json({ message: 'Visa detail deleted successfully' });
  });
});

app.get('/api/settings', (req, res) => {
  db.query('SELECT * FROM settings', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching settings' });
    }

    const settings = {};
    results.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });

    res.json(settings);
  });
});

app.put('/api/settings', authenticateToken, (req, res) => {
  const settings = req.body;

  const promises = Object.keys(settings).map(key => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, settings[key], settings[key]],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });

  Promise.all(promises)
    .then(() => res.json({ message: 'Settings updated successfully' }))
    .catch(() => res.status(500).json({ message: 'Error updating settings' }));
});

app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const stats = {};

  db.query('SELECT COUNT(*) as count FROM countries', (err, results) => {
    stats.countries = results[0].count;

    db.query('SELECT COUNT(*) as count FROM visa_types', (err, results) => {
      stats.visa_types = results[0].count;

      db.query('SELECT COUNT(*) as count FROM visa_categories', (err, results) => {
        stats.visa_categories = results[0].count;

        res.json(stats);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
