const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const { default: errorHandler } = require('./middleware/errorHandler');
const { default: router } = require('./routers');

const app = express();

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())

// Routes
app.get('/', (req, res) => res.status(200).json({ message: "Backend up and running...!" }))
app.use('/api', router);

// Middlewares
app.use(errorHandler);


module.exports = app