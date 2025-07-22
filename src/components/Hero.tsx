import React from 'react';
import { FileText, Play, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 fill-current" />
              Made in Tunisia
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Générez, suivez et encaissez vos{' '}
              <span className="text-[#1c6ae4]">factures sans stress</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Devis, factures, relances automatiques, tout est centralisé dans E-Tafakna. 
              Simplifiez votre gestion financière et ne perdez plus jamais une facture.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-[#1c6ae4] hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <FileText className="w-5 h-5 inline mr-2" />
                Créer une facture
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 border border-gray-300 hover:border-gray-400">
                <Play className="w-5 h-5 inline mr-2" />
                Découvrir la démo
              </button>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">93%</div>
                <div className="text-sm text-gray-600">réduisent les impayés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2 sem</div>
                <div className="text-sm text-gray-600">temps d'adaptation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">support client</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Facture #2024-001</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Payée
                  </span>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-gray-600">Client: Startup Tech SARL</p>
                  <p className="text-gray-600">Montant: 2,500 TND</p>
                  <p className="text-gray-600">Échéance: 15 Dec 2024</p>
                </div>
                <div className="flex justify-between items-center">
                  <button className="text-[#1c6ae4] hover:text-blue-700 font-medium">
                    Voir détails
                  </button>
                  <button className="bg-[#1c6ae4] text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Relancer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;