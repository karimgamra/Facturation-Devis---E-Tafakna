import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { X, FileText, Calculator } from 'lucide-react';

interface CreateInvoiceModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'invoice',
    client: '',
    amount: '',
    dueDate: '',
    description: '',
    items: [{ description: '', quantity: 1, price: 0 }]
  });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Calculate total amount
  const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  // Prepare the PDF
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.text(formData.type === 'invoice' ? 'FACTURE' : 'DEVIS', 10, 20);

  // Add client info
  doc.setFontSize(12);
  doc.text(`Client: ${formData.client}`, 10, 30);
  doc.text(`Date d'échéance: ${formData.dueDate}`, 10, 40);

  // Add items header
  doc.text('Articles:', 10, 50);

  // Starting position for items
  let y = 60;

  // Add each item
  formData.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.description} - Qté: ${item.quantity} - Prix unitaire: ${item.price.toFixed(2)} TND - Total: ${(item.quantity * item.price).toFixed(2)} TND`,
      10,
      y
    );
    y += 10;
  });

  // Add total amount
  doc.text(`Total: ${totalAmount.toFixed(2)} TND`, 10, y + 10);

  // Save PDF
  doc.save(`${formData.type}_${formData.client}_${new Date().toISOString().split('T')[0]}.pdf`);

  // Call onSubmit if needed to pass form data elsewhere
  onSubmit({
    ...formData,
    amount: totalAmount
  });
};

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#1c6ae4] bg-opacity-10 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-[#1c6ae4]" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Nouveau {formData.type === 'invoice' ? 'Facture' : 'Devis'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de document</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="invoice"
                  checked={formData.type === 'invoice'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mr-2"
                />
                Facture
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="quote"
                  checked={formData.type === 'quote'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mr-2"
                />
                Devis
              </label>
            </div>
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              placeholder="Nom du client"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date d'échéance</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Articles/Services</label>
              <button
                type="button"
                onClick={addItem}
                className="text-[#1c6ae4] hover:text-blue-700 text-sm font-medium"
              >
                + Ajouter un article
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent text-sm"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      placeholder="Qté"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent text-sm"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      placeholder="Prix unitaire"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent text-sm"
                      value={item.price}
                      onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Total</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{totalAmount.toLocaleString()} TND</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#1c6ae4] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Créer {formData.type === 'invoice' ? 'la facture' : 'le devis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;