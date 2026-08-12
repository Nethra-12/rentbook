require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/complaints', complaintRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
const billRoutes = require('./routes/billRoutes');

app.use('/api/bills', billRoutes);
const PORT = process.env.PORT || 5000;
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api', dashboardRoutes);
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));