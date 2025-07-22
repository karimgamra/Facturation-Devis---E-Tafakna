const express = require('express');
require('dotenv').config();

const invoiceRoutes = require('./routes/invoices');

const app = express();
app.use(express.json());

app.use('/api/invoices', invoiceRoutes);

app.get('/', (req, res) => {
  res.send('Invoice API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
