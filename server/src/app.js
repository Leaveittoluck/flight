const express = require('express');
const cors    = require('cors');
const session = require('express-session');
const pgStore = require('connect-pg-simple')(session);
const passport = require('./config/passport');
const pool    = require('./db/pool');
const routes  = require('./routes');
const notFound     = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin:      process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    store: new pgStore({
      pool,
      tableName:            'session',
      schemaName:           'public',
      createTableIfMissing: true,
    }),
    name:             'litl.sid',
    secret:           process.env.SESSION_SECRET || 'dev-secret-change-me-in-production',
    resave:           false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
