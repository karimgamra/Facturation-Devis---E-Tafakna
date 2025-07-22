import React, { useEffect, useState } from 'react';
import { MoreVertical, Eye, Send, Download } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Summary state
  const [summary, setSummary] = useState({
    chiffreAffaires: 0,
    encaisse: 0,
    enAttente: 0,
    enRetard: 0,
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/invoices/');
        setInvoices(data);

        // Compute summary
        const chiffreAffaires = data.reduce(
          (acc, invoice) => acc + parseFloat(invoice.total_ttc || 0),
          0
        );
        const encaisse = data.reduce(
          (acc, invoice) => acc + parseFloat(invoice.encaissé || 0),
          0
        );
        const enAttente = data.reduce(
          (acc, invoice) => acc + parseFloat(invoice.en_attente || 0),
          0
        );
        const enRetard = data.reduce(
          (acc, invoice) => acc + parseFloat(invoice.en_retard || 0),
          0
        );

        setSummary({
          chiffreAffaires,
          encaisse,
          enAttente,
          enRetard,
        });
      } catch (err) {
        setError('Erreur lors du chargement des factures');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'payée':
        return 'bg-green-100 text-green-800';
      case 'en_attente':
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_retard':
      case 'en retard':
        return 'bg-red-100 text-red-800';
      case 'brouillon':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format number as "1,234.56 TND"
  const formatCurrency = (num) =>
    num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TND';

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tableau de bord intuitif
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualisez l'état de vos factures en un coup d'œil et agissez rapidement
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#1c6ae4] to-blue-600 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Dashboard Facturation</h3>
                  <p className="text-blue-100">Gérez vos factures et suivez vos paiements</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all">
                    Nouveau devis
                  </button>
                  <button className="bg-white text-[#1c6ae4] px-4 py-2 rounded-lg hover:bg-gray-50 transition-all font-medium">
                    Nouvelle facture
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center text-gray-500 py-12">Chargement...</div>
              ) : error ? (
                <div className="text-center text-red-500 py-12">{error}</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-[#1c6ae4]">
                        {formatCurrency(summary.chiffreAffaires)}
                      </div>
                      <div className="text-sm text-gray-600">Chiffre d'affaires</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(summary.encaisse)}
                      </div>
                      <div className="text-sm text-gray-600">Encaissé</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-600">
                        {formatCurrency(summary.enAttente)}
                      </div>
                      <div className="text-sm text-gray-600">En attente</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(summary.enRetard)}
                      </div>
                      <div className="text-sm text-gray-600">En retard</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 text-sm font-medium text-gray-500">Facture</th>
                          <th className="text-left py-3 text-sm font-medium text-gray-500">Client</th>
                          <th className="text-left py-3 text-sm font-medium text-gray-500">Montant</th>
                          <th className="text-left py-3 text-sm font-medium text-gray-500">Statut</th>
                          <th className="text-left py-3 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 font-medium text-gray-900">#{invoice.number}</td>
                            <td className="py-4 text-gray-700">{invoice.user_id}</td> {/* Adjust client info if available */}
                            <td className="py-4 font-medium text-gray-900">{formatCurrency(parseFloat(invoice.total_ttc))}</td>
                            <td className="py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
                              >
                                {invoice.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <Eye className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <Send className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <Download className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <MoreVertical className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
