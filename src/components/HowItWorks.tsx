import React from 'react';
import { FileText, Send, Bell, CreditCard, BarChart3 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: FileText,
      title: "Créez un devis ou une facture",
      description: "Utilisez nos templates ou créez votre propre modèle en quelques clics"
    },
    {
      number: 2,
      icon: Send,
      title: "Envoyez à votre client",
      description: "Par email, SMS ou générez un lien de paiement personnalisé"
    },
    {
      number: 3,
      icon: Bell,
      title: "Relances automatiques activées",
      description: "Notre système gère les rappels selon vos paramètres"
    },
    {
      number: 4,
      icon: CreditCard,
      title: "Le client peut payer ou signer",
      description: "Paiement en ligne sécurisé ou signature électronique de devis"
    },
    {
      number: 5,
      icon: BarChart3,
      title: "Suivez tout depuis votre dashboard",
      description: "Tableaux de bord en temps réel et notifications instantanées"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un processus simple et automatisé pour ne plus jamais perdre de temps sur vos factures
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 last:mb-0">
              <div className="flex-shrink-0">
                <div className="bg-[#1c6ae4] text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="bg-gray-50 rounded-xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#1c6ae4] bg-opacity-10 rounded-lg p-3 flex-shrink-0">
                      <step.icon className="w-6 h-6 text-[#1c6ae4]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block flex-shrink-0 ml-8">
                  <div className="w-px h-12 bg-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;