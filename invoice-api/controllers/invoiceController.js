
const db = require('../config/db');

// Validation function for invoice data
const validateInvoiceData = (data, isUpdate = false) => {
  const { user_id, contract_id, number, type, status, total_ttc, due_date, encaissé, en_attente, en_retard } = data;
  const errors = [];

  if (!isUpdate && !user_id) errors.push('user_id is required'); // Only required for CREATE
  if (!isUpdate && !contract_id) errors.push('contract_id is required'); // Only required for CREATE
  if (!number) errors.push('number is required');
  if (!type || !['devise', 'facture'].includes(type.toLowerCase())) {
    errors.push('type must be "devise" or "facture" (case-insensitive)');
  }
  if (!status || !['en_attente', 'payée', 'en_retard', 'annulée'].includes(status.toLowerCase())) {
    errors.push('status must be "en_attente", "payée", "en_retard", or "annulée" (case-insensitive)');
  }
  if (total_ttc === undefined || total_ttc < 0) errors.push('total_ttc must be a non-negative number');
  if (!due_date) errors.push('due_date is required');
  if (encaissé !== undefined && (isNaN(encaissé) || encaissé < 0)) errors.push('encaissé must be a non-negative number');
  if (en_attente !== undefined && (isNaN(en_attente) || en_attente < 0)) errors.push('en_attente must be a non-negative number');
  if (en_retard !== undefined && (isNaN(en_retard) || en_retard < 0)) errors.push('en_retard must be a non-negative number');

  return errors;
};

// CREATE
exports.createInvoice = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    if (!db) {
      throw new Error('Database connection is not initialized');
    }
    const invoiceData = {
      user_id: req.body.user_id,
      contract_id: req.body.contract_id,
      number: req.body.number,
      type: req.body.type,
      status: req.body.status,
      total_ttc: req.body.total_ttc,
      due_date: req.body.due_date,
      encaissé: parseFloat(req.body.encaissé) || 0.00,
      en_attente: parseFloat(req.body.en_attente) || 0.00,
      en_retard: parseFloat(req.body.en_retard) || 0.00
    };

    const errors = validateInvoiceData(invoiceData);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const { user_id, contract_id, number, type, status, total_ttc, due_date, encaissé, en_attente, en_retard } = invoiceData;

    const [result] = await db.execute(
      `INSERT INTO invoices (
        id, user_id, contract_id, number, type, status, total_ttc, due_date, encaissé, en_attente, en_retard
      ) VALUES (
        UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [user_id, contract_id, number, type, status, total_ttc, due_date, encaissé, en_attente, en_retard]
    );

    res.status(201).json({ message: 'Invoice created', insertId: result.insertId });
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ error: 'Failed to create invoice', details: err.message });
  }
};

// READ ALL
exports.getAllInvoices = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Database connection is not initialized');
    }
    const [rows] = await db.execute(
      `SELECT id, user_id, contract_id, number, type, status, total_ttc, due_date, 
              encaissé, en_attente, en_retard, created_at 
       FROM invoices 
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Failed to fetch invoices', details: err.message });
  }
};

// READ ONE
exports.getInvoiceById = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Database connection is not initialized');
    }
    const [rows] = await db.execute(
      `SELECT id, user_id, contract_id, number, type, status, total_ttc, due_date, 
              encaissé, en_attente, en_retard, created_at 
       FROM invoices 
       WHERE id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({ error: 'Failed to fetch invoice', details: err.message });
  }
};

// UPDATE
exports.updateInvoice = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Database connection is not initialized');
    }
    const invoiceData = {
      number: req.body.number,
      type: req.body.type,
      status: req.body.status,
      total_ttc: req.body.total_ttc,
      due_date: req.body.due_date,
      encaissé: parseFloat(req.body.encaissé) || 0.00,
      en_attente: parseFloat(req.body.en_attente) || 0.00,
      en_retard: parseFloat(req.body.en_retard) || 0.00
    };

    // Validate input for UPDATE (user_id and contract_id are optional)
    const errors = validateInvoiceData(invoiceData, true);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const { number, type, status, total_ttc, due_date, encaissé, en_attente, en_retard } = invoiceData;

    const [result] = await db.execute(
      `UPDATE invoices
       SET number = ?, type = ?, status = ?, total_ttc = ?, due_date = ?, 
           encaissé = ?, en_attente = ?, en_retard = ?
       WHERE id = ?`,
      [number, type, status, total_ttc, due_date, encaissé, en_attente, en_retard, req.params.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Invoice not found' });

    res.json({ message: 'Invoice updated' });
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ error: 'Failed to update invoice', details: err.message });
  }
};

// DELETE
exports.deleteInvoice = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Database connection is not initialized');
    }
    const [result] = await db.execute('DELETE FROM invoices WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Invoice not found' });
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({ error: 'Failed to delete invoice', details: err.message });
  }
};