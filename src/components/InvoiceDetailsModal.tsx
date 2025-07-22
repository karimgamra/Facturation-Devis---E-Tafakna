import React from 'react';
import { X, FileText, Calendar, User, DollarSign, Download, Send, Edit } from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdDate: string;
  type: 'invoice' | 'quote';
}

interface InvoiceDetailsModalProps {
  invoice: Invoice;
  onClose: () => void;
  onStatusChange: (invoiceId: string, newStatus: Invoice['status']) => void;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({ 
  invoice, 
  onClose, 
  onStatusChange 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Payée';
      case 'sent': return 'Envoyée';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulée';
      default: return 'Brouillon';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#1c6ae4] bg-opacity-10 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-[#1c6ae4]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {invoice.type === 'invoice' ? 'Facture' : 'Devis'} #{invoice.number}
                </h2>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(invoice.status)}`}>
                  {getStatusText(invoice.status)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Client Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium text-gray-900">{invoice.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Montant</p>
                  <p className="font-medium text-gray-900">{invoice.amount.toLocaleString()} TND</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Date de création</p>
                  <p className="font-medium text-gray-900">{new Date(invoice.createdDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Date d'échéance</p>
                  <p className="font-medium text-gray-900">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Preview */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Articles/Services</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Service de consultation juridique</span>
                  <span className="font-medium">{invoice.amount.toLocaleString()} TND</span>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>{invoice.amount.toLocaleString()} TND</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le statut</h3>
            <div className="flex flex-wrap gap-2">
              {['draft', 'sent', 'paid', 'overdue', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(invoice.id, status as Invoice['status'])}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    invoice.status === status
                      ? getStatusColor(status)
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getStatusText(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1c6ae4] text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Send className="w-4 h-4" />
              Envoyer par email
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsModal;