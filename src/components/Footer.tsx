import React from 'react';
import { ArrowRight, FileText, Clock, TrendingUp } from 'lucide-react';

const Footer = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1c6ae4] to-blue-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Gagnez du temps, soyez payé à temps
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Rejoignez des milliers d'entreprises tunisiennes qui ont choisi E-Tafakna 
              pour simplifier leur gestion de facturation et améliorer leur trésorerie.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
                <FileText className="w-12 h-12 text-white mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">5,000+</div>
                <div className="text-blue-100">Factures créées</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
                <Clock className="w-12 h-12 text-white mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">70%</div>
                <div className="text-blue-100">Temps économisé</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-xl p-6 text-center">
                <TrendingUp className="w-12 h-12 text-white mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">85%</div>
                <div className="text-blue-100">Satisfaction client</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#1c6ae4] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <FileText className="w-5 h-5 inline mr-2" />
                Lancer mon premier devis
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#1c6ae4] transition-all duration-300">
                Planifier une démo
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-blue-400 border-opacity-30">
              <p className="text-blue-100 text-center">
                © 2024 E-Tafakna - Tous droits réservés | 
                <span className="font-semibold"> Made in Tunisia</span> avec ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;