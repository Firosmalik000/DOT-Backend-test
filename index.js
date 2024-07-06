const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const UserRoute = require('./routes/UserRoute.js');
const ProductRoute = require('./routes/ProductRoute.js');
const AuthRoute = require('./routes/AuthRoute.js');
const SequelizeStore = require('connect-session-sequelize');
// untuk connect ke database
const db = require('./config/Database.js');

const app = express();
dotenv.config();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
});
// connect ke database
// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: 'auto' },
  })
);

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());

// router
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

// membuat table session
// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log(`Server running on port ${process.env.APP_PORT}`);
});
