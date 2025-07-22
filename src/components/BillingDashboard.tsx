import React, { useState } from 'react';
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
  number: string;
  client: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdDate: string;
  type: 'invoice' | 'quote';
}

const BillingDashboard = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      number: '2024-001',
      client: 'Startup Tech SARL',
      amount: 2500,
      status: 'paid',
      dueDate: '2024-12-15',
      createdDate: '2024-11-15',
      type: 'invoice'
    },
    {
      id: '2',
      number: '2024-002',
      client: 'Cabinet Avocat',
      amount: 1200,
      status: 'sent',
      dueDate: '2024-12-20',
      createdDate: '2024-11-20',
      type: 'invoice'
    },
    {
      id: '3',
      number: '2024-003',
      client: 'Société Import',
      amount: 3800,
      status: 'overdue',
      dueDate: '2024-12-10',
      createdDate: '2024-11-10',
      type: 'invoice'
    },
    {
      id: '4',
      number: 'DEV-2024-001',
      client: 'Freelance Design',
      amount: 850,
      status: 'draft',
      dueDate: '2024-12-25',
      createdDate: '2024-11-25',
      type: 'quote'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // If showing create page, render it instead of dashboard
  if (showCreatePage) {
    return <CreateInvoicePage onBack={() => setShowCreatePage(false)} />;
  }

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

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'sent').reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0);

  const handleCreateInvoice = (invoiceData: any) => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      number: invoiceData.type === 'quote' ? `DEV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}` : `${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      client: invoiceData.client,
      amount: invoiceData.amount,
      status: 'draft',
      dueDate: invoiceData.dueDate,
      createdDate: new Date().toISOString().split('T')[0],
      type: invoiceData.type
    };
    setInvoices([...invoices, newInvoice]);
    setShowCreateModal(false);
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
  };

  const handleStatusChange = (invoiceId: string, newStatus: Invoice['status']) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId ? { ...inv, status: newStatus } : inv
    ));
  };

  return (
    <div className="p-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Facturation & Devis</h1>
          <p className="text-gray-600">Gérez vos factures, devis et suivez vos paiements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-gray-900">{totalAmount.toLocaleString()} TND</p>
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
                <p className="text-2xl font-bold text-green-600">{paidAmount.toLocaleString()} TND</p>
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
                <p className="text-2xl font-bold text-blue-600">{pendingAmount.toLocaleString()} TND</p>
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
                <p className="text-2xl font-bold text-red-600">{overdueAmount.toLocaleString()} TND</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions and Filters */}
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

          {/* Table */}
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
                    <td className="py-4 px-6 font-medium text-gray-900">{invoice.amount.toLocaleString()} TND</td>
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

      {/* Modals */}
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