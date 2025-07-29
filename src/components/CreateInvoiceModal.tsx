import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { X, FileText, Calculator } from 'lucide-react';

interface CreateInvoiceModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

interface Item {
  description: string;
  quantity: number;
  price: number;
}

const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    type: 'invoice',
    client: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    image: null as File | null,
  });

  const [error, setError] = useState<string | null>(null);

  const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'description' ? value as string : parseFloat(value as string);
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, price: 0 }] });
  };

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const isFormValid = () => {
    if (!formData.type || !formData.client.trim() || !formData.dueDate) return false;
    return formData.items.every(item => item.description.trim() && item.quantity > 0 && item.price > 0);
  };

  const generatePdfAndSubmit = () => {
    const totalAmount = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    let y = 20;

    // Header with Image
    doc.setFillColor(26, 106, 228);
    doc.rect(margin, y, pageWidth - 2 * margin, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('E-Tafakna Solutions', margin + 5, y + 10);
    doc.setFontSize(12);
    doc.text('123 Rue Exemple, 1000 Tunis | Email: contact@etafakna.com | Tel: +216 123 456', margin + 5, y + 15);

    if (formData.image) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgData = e.target?.result as string;
        doc.addImage(imgData, 'PNG', margin + 140, y + 2, 40, 16); // Position image on the right
        doc.save(`${formData.type}_${formData.client || 'client'}_${new Date().toISOString().split('T')[0]}.pdf`);
        onSubmit({ ...formData, amount: totalAmount });
      };
      reader.readAsDataURL(formData.image);
    } else {
      y += 25;
      // Title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(20);
      doc.text(formData.type === 'invoice' ? 'FACTURE' : 'DEVIS', pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Client Info
      doc.setFontSize(12);
      doc.text(`Client: ${formData.client}`, margin, y);
      y += 5;
      doc.text(`Date d'échéance: ${formData.dueDate}`, margin, y);
      y += 10;

      // Table Header
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text('#', margin + 5, y + 7);
      doc.text('Description', margin + 20, y + 7);
      doc.text('Quantité', margin + 100, y + 7, { align: 'right' });
      doc.text('Prix Unitaire', margin + 130, y + 7, { align: 'right' });
      doc.text('Total', margin + 160, y + 7, { align: 'right' });
      y += 10;

      // Table Rows
      formData.items.forEach((item, index) => {
        const itemTotal = item.quantity * item.price;
        const rowHeight = 10;
        if (y + rowHeight > pageHeight - 20) {
          doc.addPage();
          y = 20;
          doc.setFillColor(240, 240, 240);
          doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
          doc.setTextColor(0, 0, 0);
          doc.text('#', margin + 5, y + 7);
          doc.text('Description', margin + 20, y + 7);
          doc.text('Quantité', margin + 100, y + 7, { align: 'right' });
          doc.text('Prix Unitaire', margin + 130, y + 7, { align: 'right' });
          doc.text('Total', margin + 160, y + 7, { align: 'right' });
          y += 10;
        }
        doc.setFontSize(10);
        doc.text((index + 1).toString(), margin + 5, y + 7);
        doc.text(item.description, margin + 20, y + 7, { maxWidth: 70 });
        doc.text(item.quantity.toString(), margin + 100, y + 7, { align: 'right' });
        doc.text(`${item.price.toFixed(2)} TND`, margin + 130, y + 7, { align: 'right' });
        doc.text(`${itemTotal.toFixed(2)} TND`, margin + 160, y + 7, { align: 'right' });
        y += rowHeight;
      });

      // Total
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, y, pageWidth - 2 * margin, 10, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text('Total:', margin + 130, y + 7);
      doc.text(`${totalAmount.toFixed(2)} TND`, margin + 160, y + 7, { align: 'right' });
      y += 10;

      // Footer
      doc.setFontSize(8);
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin - 10, pageHeight - 5);
      doc.text('Merci de votre confiance !', pageWidth / 2, pageHeight - 5, { align: 'center' });

      doc.save(`${formData.type}_${formData.client || 'client'}_${new Date().toISOString().split('T')[0]}.pdf`);
      onSubmit({ ...formData, amount: totalAmount });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Créer une {formData.type === 'invoice' ? 'facture' : 'devis'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isFormValid()) {
              setError('Veuillez remplir tous les champs obligatoires avant de télécharger le PDF.');
              return;
            }
            setError(null);
            generatePdfAndSubmit();
          }}
          className="p-6 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
                required
              >
                <option value="invoice">Facture</option>
                <option value="quote">Devis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client</label>
              <input
                type="text"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date d'échéance</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image (Logo/Signature)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, image: file });
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Articles</label>
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    required
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="flex-1 rounded-md border border-gray-300 shadow-sm p-2"
                  />
                  <input
                    type="number"
                    placeholder="Quantité"
                    value={item.quantity}
                    min={1}
                    required
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-20 rounded-md border border-gray-300 shadow-sm p-2"
                  />
                  <input
                    type="number"
                    placeholder="Prix"
                    value={item.price}
                    min={0.01}
                    step="0.01"
                    required
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    className="w-24 rounded-md border border-gray-300 shadow-sm p-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addItem} className="mt-2 text-blue-500 hover:underline">
                Ajouter un article
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${isFormValid() ? 'bg-[#1c6ae4] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <Calculator className="w-4 h-4" />
              Créer {formData.type === 'invoice' ? 'la facture' : 'le devis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;