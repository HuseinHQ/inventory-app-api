require('dotenv').config();
const express = require('express');
const mainRoutes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const { HOST, PORT, NODE_ENV } = process.env;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[index.js]: Server is running at ${HOST}:${PORT} - ${NODE_ENV}`);
});
