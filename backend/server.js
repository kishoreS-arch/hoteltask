const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const { createHotelsTable } = require('./db/database');
const hotelRoutes = require('./routes/hotelRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.use('/api/hotels', hotelRoutes);

const startServer = async () => {
  try {
    await createHotelsTable();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
