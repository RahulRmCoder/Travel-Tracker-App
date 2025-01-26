import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(cookieParser());

// Middleware to verify JWT
function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.redirect('/login');
    }
}

// Login Route
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login POST Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const validPassword = await bcrypt.compare(password, user.password);
            
            if (validPassword) {
                const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
                res.cookie('token', token, { httpOnly: true });
                res.redirect('/');
            } else {
                res.render('login', { error: 'Invalid credentials' });
            }
        } else {
            res.render('login', { error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Server error' });
    }
});

// Signup Route
app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

// Signup POST Route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', 
            [username, hashedPassword]);
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('signup', { error: 'Username already exists' });
    }
});

// Home Route
app.get('/', verifyToken, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT country_code FROM visited_countries_list WHERE user_id = $1', 
            [req.user.id]
        );
        const countries = result.rows.map(row => row.country_code);
        res.render('index', { 
            countries: countries.join(','), 
            total: countries.length 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/login');
    }
});

async function checkVisited(userId) {
  const result = await db.query(
      "SELECT country_code FROM visited_countries_list WHERE user_id = $1", 
      [userId]
  );
  return result.rows.map(row => row.country_code);
}

// Add Country Route (updated)
app.post('/add', verifyToken, async (req, res) => {
  const input = req.body.country;
  try {
      const countryResult = await db.query(
          "SELECT country_code FROM countries WHERE LOWER(country_name) = LOWER($1)",
          [input]
      );

      if (countryResult.rows.length === 0) {
          const countries = await checkVisited(req.user.id);
          return res.render('index', {
              countries: countries.join(','), 
              total: countries.length, 
              error: "Country name does not exist."
          });
      }

      const countryCode = countryResult.rows[0].country_code;
      
      try {
          await db.query(
              "INSERT INTO visited_countries_list (user_id, country_code) VALUES ($1, $2)",
              [req.user.id, countryCode]
          );
          res.redirect('/');
      } catch (err) {
          const countries = await checkVisited(req.user.id);
          res.render('index', {
              countries: countries.join(','), 
              total: countries.length, 
              error: "Country has already been added, try again."
          });
      }
  } catch (err) {
      console.log(err);
      const countries = await checkVisited(req.user.id);
      res.render('index', {
          countries: countries.join(','), 
          total: countries.length, 
          error: "Error adding country, try again."
      });
  }
});
// Logout Route
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});