const express = require('express');
require('dotenv').config();
const cors = require('cors'); // Add this line to import the cors package
const invoiceRoutes = require('./routes/invoices');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow only your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type'] // Allowed headers
}));

app.use(express.json());

app.use('/api/invoices', invoiceRoutes);

app.get('/', (req, res) => {
  res.send('Invoice API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});