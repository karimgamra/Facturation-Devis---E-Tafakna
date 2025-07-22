import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Eye, 
  Settings
} from 'lucide-react';
import jsPDF from 'jspdf';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  totalHT: number;
}

interface InvoiceSettings {
  enableVAT: boolean;
  variableVATPerLine: boolean;
  defaultVATRate: number;
  enableFiscalStamp: boolean;
  fiscalStampAmount: number;
}

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  siret: string;
  rib: string;
  logo?: string;
}

interface ClientInfo {
  name: string;
  address: string;
  siret: string;
}

const CreateInvoicePage = ({ onBack }: { onBack: () => void }) => {
  const [documentType, setDocumentType] = useState<'invoice' | 'quote'>('invoice');
  const [language, setLanguage] = useState('fr');
  const [currency, setCurrency] = useState('TND');
  const [invoiceNumber, setInvoiceNumber] = useState('2024-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');

  const [settings, setSettings] = useState<InvoiceSettings>({
    enableVAT: true,
    variableVATPerLine: false,
    defaultVATRate: 19,
    enableFiscalStamp: true,
    fiscalStampAmount: 1.00
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'E-Tafakna SARL',
    address: 'Tunis, Tunisie',
    phone: '+216 XX XXX XXX',
    email: 'contact@e-tafakna.com',
    siret: 'XXXXXXXXXXXXXXX',
    rib: 'XX XXX XXXXXXXXXXXXXXX XX'
  });

  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    address: '',
    siret: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: settings.defaultVATRate,
      totalHT: 0
    }
  ]);

  const [showSettings, setShowSettings] = useState(false);

  const currencies = [
    { code: 'TND', name: 'Dinar Tunisien', symbol: 'TND' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'Dollar US', symbol: '$' },
    { code: 'AED', name: 'Dirham UAE', symbol: 'AED' },
    { code: 'SAR', name: 'Riyal Saoudien', symbol: 'SAR' }
  ];

  const vatRates = [7, 12, 19];

  const addItem = () => {
    setItems([...items, {
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: settings.defaultVATRate,
      totalHT: 0
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalHT = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  const calculateTotals = () => {
    const totalHT = items.reduce((sum, item) => sum + item.totalHT, 0);
    const totalVAT = settings.enableVAT ? items.reduce((sum, item) => {
      const vatAmount = (item.totalHT * item.vatRate) / 100;
      return sum + vatAmount;
    }, 0) : 0;
    const fiscalStamp = settings.enableFiscalStamp ? settings.fiscalStampAmount : 0;
    const totalTTC = totalHT + totalVAT + fiscalStamp;

    return { totalHT, totalVAT, fiscalStamp, totalTTC };
  };

  const numberToWords = (num: number): string => {
    const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
    const hundreds = ['', 'cent', 'deux cents', 'trois cents', 'quatre cents', 'cinq cents', 'six cents', 'sept cents', 'huit cents', 'neuf cents'];

    if (num === 0) return 'zéro';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '');
    
    return Math.floor(num).toString(); // Simplified for demo
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const { totalHT, totalVAT, fiscalStamp, totalTTC } = calculateTotals();

    // Add Title
    doc.setFontSize(18);
    doc.text(documentType === 'invoice' ? 'FACTURE' : 'DEVIS', 20, 20);

    // Company Information
    doc.setFontSize(12);
    doc.text('Émetteur:', 20, 30);
    doc.text(companyInfo.name, 20, 38);
    doc.text(companyInfo.address, 20, 46);
    doc.text(`Téléphone: ${companyInfo.phone}`, 20, 54);
    doc.text(`Email: ${companyInfo.email}`, 20, 62);
    doc.text(`SIRET: ${companyInfo.siret}`, 20, 70);
    doc.text(`RIB: ${companyInfo.rib}`, 20, 78);

    // Client Information
    doc.text('Client:', 100, 30);
    doc.text(clientInfo.name || 'N/A', 100, 38);
    doc.text(clientInfo.address || 'N/A', 100, 46);
    doc.text(`SIRET: ${clientInfo.siret || 'N/A'}`, 100, 54);

    // Invoice Details
    doc.text(`${documentType === 'invoice' ? 'Facture' : 'Devis'} N°: ${invoiceNumber}`, 20, 90);
    doc.text(`Date: ${invoiceDate}`, 20, 98);
    if (deliveryDate) {
      doc.text(`Date de livraison: ${deliveryDate}`, 20, 106);
    }

    // Items Table Header
    doc.setFontSize(10);
    doc.text('Description', 20, 120);
    doc.text('Qté', 100, 120);
    doc.text('Prix Unit. HT', 120, 120);
    if (settings.enableVAT && settings.variableVATPerLine) {
      doc.text('TVA %', 150, 120);
    }
    doc.text('Total HT', 170, 120);

    // Items Table Content
    let y = 130;
    items.forEach((item) => {
      doc.text(item.description || 'N/A', 20, y);
      doc.text(item.quantity.toString(), 100, y);
      doc.text(`${item.unitPrice.toFixed(2)} ${currency}`, 120, y);
      if (settings.enableVAT && settings.variableVATPerLine) {
        doc.text(`${item.vatRate}%`, 150, y);
      }
      doc.text(`${item.totalHT.toFixed(2)} ${currency}`, 170, y);
      y += 10;
    });

    // Totals
    y += 10;
    doc.text(`Total HT: ${totalHT.toFixed(2)} ${currency}`, 140, y);
    if (settings.enableVAT) {
      y += 10;
      doc.text(`TVA: ${totalVAT.toFixed(2)} ${currency}`, 140, y);
    }
    if (settings.enableFiscalStamp) {
      y += 10;
      doc.text(`Timbre Fiscal: ${fiscalStamp.toFixed(2)} ${currency}`, 140, y);
    }
    y += 10;
    doc.setFontSize(12);
    doc.text(`Total TTC: ${totalTTC.toFixed(2)} ${currency}`, 140, y);

    // Amount in Words
    y += 10;
    doc.setFontSize(10);
    doc.text(`Montant en lettres: ${numberToWords(Math.floor(totalTTC))} dinars et ${Math.round((totalTTC % 1) * 1000)} millimes`, 20, y);

    // Save PDF
    doc.save(`${documentType}_${invoiceNumber}_${invoiceDate}.pdf`);
  };

  const { totalHT, totalVAT, fiscalStamp, totalTTC } = calculateTotals();

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nouvelle {documentType === 'invoice' ? 'Facture' : 'Devis'}
              </h1>
              <p className="text-gray-600">Créez votre document professionnel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              Réglages
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              <Eye className="w-4 h-4" />
              Aperçu
            </button>
            <button 
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1c6ae4] text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Send className="w-4 h-4" />
              Envoyer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Panel */}
          {showSettings && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Réglages</h3>
                
                {/* Document Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de document</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDocumentType('invoice')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        documentType === 'invoice' 
                          ? 'bg-[#1c6ae4] text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Facture
                    </button>
                    <button
                      onClick={() => setDocumentType('quote')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        documentType === 'quote' 
                          ? 'bg-[#1c6ae4] text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Devis
                    </button>
                  </div>
                </div>

                {/* Language */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>

                {/* Currency */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                  >
                    {currencies.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.name} ({curr.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                {/* VAT Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Activer la TVA</label>
                    <input
                      type="checkbox"
                      checked={settings.enableVAT}
                      onChange={(e) => setSettings({...settings, enableVAT: e.target.checked})}
                      className="rounded border-gray-300 text-[#1c6ae4] focus:ring-[#1c6ae4]"
                    />
                  </div>

                  {settings.enableVAT && (
                    <>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Taux TVA variable par ligne</label>
                        <input
                          type="checkbox"
                          checked={settings.variableVATPerLine}
                          onChange={(e) => setSettings({...settings, variableVATPerLine: e.target.checked})}
                          className="rounded border-gray-300 text-[#1c6ae4] focus:ring-[#1c6ae4]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Taux TVA par défaut</label>
                        <select
                          value={settings.defaultVATRate}
                          onChange={(e) => setSettings({...settings, defaultVATRate: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                        >
                          {vatRates.map(rate => (
                            <option key={rate} value={rate}>{rate}%</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Timbre Fiscal</label>
                    <input
                      type="checkbox"
                      checked={settings.enableFiscalStamp}
                      onChange={(e) => setSettings({...settings, enableFiscalStamp: e.target.checked})}
                      className="rounded border-gray-300 text-[#1c6ae4] focus:ring-[#1c6ae4]"
                    />
                  </div>

                  {settings.enableFiscalStamp && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Montant Timbre Fiscal</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.fiscalStampAmount}
                        onChange={(e) => setSettings({...settings, fiscalStampAmount: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={showSettings ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="bg-white rounded-xl shadow-sm">
              {/* Invoice Header */}
              <div className="p-8 border-b border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Company Info */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-[#1c6ae4] transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Logo de l'entreprise</p>
                        <button className="text-[#1c6ae4] text-sm hover:text-blue-700">Télécharger</button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la société</label>
                        <input
                          type="text"
                          value={companyInfo.name}
                          onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <textarea
                          value={companyInfo.address}
                          onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                          <input
                            type="text"
                            value={companyInfo.phone}
                            onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={companyInfo.email}
                            onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">MF/SIRET</label>
                          <input
                            type="text"
                            value={companyInfo.siret}
                            onChange={(e) => setCompanyInfo({...companyInfo, siret: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">RIB</label>
                          <input
                            type="text"
                            value={companyInfo.rib}
                            onChange={(e) => setCompanyInfo({...companyInfo, rib: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div>
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {documentType === 'invoice' ? 'FACTURE' : 'DEVIS'}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {documentType === 'invoice' ? 'Facture N°' : 'Devis N°'}
                          </label>
                          <input
                            type="text"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date de {documentType === 'invoice' ? 'facture' : 'devis'}
                          </label>
                          <input
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date de livraison</label>
                          <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Informations Client</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
                          <input
                            type="text"
                            value={clientInfo.name}
                            onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                            placeholder="Nom de l'entreprise ou du client"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse client</label>
                          <textarea
                            value={clientInfo.address}
                            onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                            rows={2}
                            placeholder="Adresse complète du client"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">SIRET/MF Client</label>
                          <input
                            type="text"
                            value={clientInfo.siret}
                            onChange={(e) => setClientInfo({...clientInfo, siret: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                            placeholder="Numéro SIRET ou MF"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Articles/Services</h3>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1c6ae4] text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un article
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Description</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 w-24">Quantité</th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 w-32">Prix Unitaire HT</th>
                        {settings.enableVAT && settings.variableVATPerLine && (
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 w-24">TVA %</th>
                        )}
                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 w-32">Prix Total HT</th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-2">
                            <textarea
                              value={item.description}
                              onChange={(e) => updateItem(index, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent resize-none"
                              rows={2}
                              placeholder="Description du service ou produit"
                            />
                          </td>
                          <td className="py-3 px-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                            />
                          </td>
                          <td className="py-3 px-2">
                            <input
                              type="number"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                            />
                          </td>
                          {settings.enableVAT && settings.variableVATPerLine && (
                            <td className="py-3 px-2">
                              <select
                                value={item.vatRate}
                                onChange={(e) => updateItem(index, 'vatRate', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1c6ae4] focus:border-transparent"
                              >
                                {vatRates.map(rate => (
                                  <option key={rate} value={rate}>{rate}%</option>
                                ))}
                              </select>
                            </td>
                          )}
                          <td className="py-3 px-2">
                            <div className="px-3 py-2 bg-gray-50 rounded-lg font-medium">
                              {item.totalHT.toFixed(3)} {currency}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <button
                              onClick={() => removeItem(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              disabled={items.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals Section */}
              <div className="p-8 bg-gray-50 border-t border-gray-200">
                <div className="max-w-md ml-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total HT</span>
                      <span className="font-medium">{totalHT.toFixed(3)} {currency}</span>
                    </div>
                    
                    {settings.enableVAT && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">TVA</span>
                        <span className="font-medium">{totalVAT.toFixed(3)} {currency}</span>
                      </div>
                    )}
                    
                    {settings.enableFiscalStamp && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Timbre Fiscal</span>
                        <span className="font-medium">{fiscalStamp.toFixed(2)} {currency}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-300 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total TTC</span>
                        <span className="text-lg font-bold text-[#1c6ae4]">{totalTTC.toFixed(3)} {currency}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-white rounded-lg border">
                      <p className="text-sm text-gray-600 mb-1">Montant en lettres :</p>
                      <p className="text-sm font-medium text-gray-900">
                        {numberToWords(Math.floor(totalTTC))} dinars et {Math.round((totalTTC % 1) * 1000)} millimes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoicePage;
