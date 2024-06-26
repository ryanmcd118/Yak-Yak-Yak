const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const authController = require('./controllers/authController');

/**
 * handle parsing request body
 */
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * define route handlers
 */
app.use('/auth', authRouter);

app.use('/posts', postsRouter);

app.get('/secret', authController.verifyUser, (req, res) => {
  return res.status(200).json('here is some secret info!');
});

/**
 * serve the bundle file in production mode
 * AND
 * handle requests for static files
 */
if (process.env.NODE_ENV === 'production') {
  app.use('/build', express.static(path.join(__dirname, '../build/')));

  app.get('/', (req, res) =>
    res.status(200).sendFile(path.join(__dirname, '../index.html')));
}

/*
catch-all route handler for any requests to an unknown route
*/
app.get('*', (req, res) => {
  return res.status(404).json();
});

/*
global error handler
*/
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: 'An error occurred',
  };
  const error = { ...defaultErr, ...err };
  return res.status(error.status).json(error.message);
});

/*
start server
*/
app.listen(3000);

module.exports = app;
