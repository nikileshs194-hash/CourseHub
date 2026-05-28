require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const studentsRouter = require('./routes/students');
const coursesRouter = require('./routes/courses');
const registrationsRouter = require('./routes/registrations');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'MIT Mysore CRMS API', status: 'running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
