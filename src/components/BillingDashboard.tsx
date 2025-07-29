import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Send, 
  Download, 
  Edit, 
  Trash2, 
  MoreVertical, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle 
} from 'lucide-react';
import CreateInvoiceModal from './CreateInvoiceModal';
import InvoiceDetailsModal from './InvoiceDetailsModal';
import CreateInvoicePage from './CreateInvoicePage';

interface Invoice {
  id: string;
  user_id: string;
  contract_id: string;
  number: string;
  client: string; // May need to be optional or fetched separately
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdDate: string;
  type: 'invoice' | 'quote';
}

const BillingDashboard = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3000/api/invoices');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Response:', data);
      const mappedInvoices = Array.isArray(data) ? data.map((inv: any) => ({
        id: inv.id || '',
        user_id: inv.user_id || '',
        contract_id: inv.contract_id || '',
        number: inv.number || '',
        client: inv.client || 'Unknown',
        amount: parseFloat(inv.total_ttc || 0).toFixed(2),
        status: mapStatus(inv.status || 'draft'),
        dueDate: inv.due_date || '',
        createdDate: inv.created_at || new Date().toISOString().split('T')[0],
        type: inv.type === 'facture' ? 'invoice' : inv.type === 'devise' ? 'quote' : 'invoice'
      })) : [];
      setInvoices(mappedInvoices);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      setError(error.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (status: string) => {
    const statusMap: { [key: string]: Invoice['status'] } = {
      'en_attente': 'sent',
      'payée': 'paid',
      'en_retard': 'overdue',
      'annulée': 'cancelled',
      'draft': 'draft'
    };
    return statusMap[status.toLowerCase()] || 'draft';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'sent': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesType = typeFilter === 'all' || invoice.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalAmount = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0).toFixed(2);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0).toFixed(2);
  const pendingAmount = invoices.filter(inv => inv.status === 'sent').reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0).toFixed(2);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0).toFixed(2);

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: invoiceData.user_id,
          contract_id: invoiceData.contract_id,
          number: invoiceData.type === 'quote' ? `DEV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}` : `${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
          type: invoiceData.type,
          status: 'draft',
          total_ttc: parseFloat(invoiceData.amount).toFixed(2),
          due_date: invoiceData.dueDate,
          encaissé: 0.00,
          en_attente: parseFloat(invoiceData.amount).toFixed(2),
          en_retard: 0.00
        })
      });
      if (response.ok) fetchInvoices();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setShowCreateModal(false);
    }
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/invoices/${invoiceId}`, { method: 'DELETE' });
      if (response.ok) fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleStatusChange = async (invoiceId: string, newStatus: Invoice['status']) => {
    try {
      const response = await fetch(`http://localhost:3000/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: mapStatusInverse(newStatus),
          total_ttc: parseFloat(invoices.find(inv => inv.id === invoiceId)?.amount || 0).toFixed(2)
        })
      });
      if (response.ok) fetchInvoices();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const mapStatusInverse = (status: Invoice['status']) => {
    const statusMap: { [key: string]: string } = {
      'sent': 'en_attente',
      'paid': 'payée',
      'overdue': 'en_retard',
      'cancelled': 'annulée',
      'draft': 'draft'
    };
    return statusMap[status] || 'draft';
  };

  if (showCreatePage) {
    return <CreateInvoicePage onBack={() => setShowCreatePage(false)} />;
  }

  if (loading) {
    return <div className="p-6 text-center">Chargement...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Erreur : {error}</div>;
  }

  return (
    <div className="p-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturation & Devis</h1>
          <p className="text-gray-600">Gérez vos factures, devis et suivez vos paiements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-gray-900">{parseFloat(totalAmount).toLocaleString()} TND</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-[#1c6ae4]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Encaissé</p>
                <p className="text-2xl font-bold text-green-600">{parseFloat(paidAmount).toLocaleString()} TND</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En attente</p>
                <p className="text-2xl font-bold text-blue-600">{parseFloat(pendingAmount).toLocaleString()} TND</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En retard</p>
                <p className="text-2xl font-bold text-red-600">{parseFloat(overdueAmount).toLocaleString()} TND</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par client ou numéro..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent w-full sm:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="draft">Brouillon</option>
                  <option value="sent">Envoyée</option>
                  <option value="paid">Payée</option>
                  <option value="overdue">En retard</option>
                </select>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Tous les types</option>
                  <option value="invoice">Factures</option>
                  <option value="quote">Devis</option>
                </select>
              </div>
              <button
                onClick={() => setShowCreatePage(true)}
                className="bg-[#1c6ae4] hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nouveau document
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Numéro</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Client</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Montant</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Échéance</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.type === 'invoice' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {invoice.type === 'invoice' ? 'Facture' : 'Devis'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">#{invoice.number}</td>
                    <td className="py-4 px-6 text-gray-700">{invoice.client}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">{parseFloat(invoice.amount).toLocaleString()} TND</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invoice.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusText(invoice.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(invoice)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Envoyer"
                        >
                          <Send className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Télécharger PDF"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun document trouvé</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateInvoiceModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateInvoice}
        />
      )}

      {showDetailsModal && selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setShowDetailsModal(false)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default BillingDashboard;