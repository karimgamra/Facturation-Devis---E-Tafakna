import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Freemium",
      price: "0",
      period: "Gratuit",
      icon: Star,
      description: "Parfait pour démarrer",
      features: [
        "3 factures par mois",
        "Création manuelle de devis",
        "Export PDF basique",
        "Suivi des paiements",
        "Support email"
      ],
      popular: false,
      buttonText: "Commencer gratuitement",
      buttonStyle: "bg-gray-600 hover:bg-gray-700"
    },
    {
      name: "Pro",
      price: "29",
      period: "par mois",
      icon: Zap,
      description: "Pour les professionnels",
      features: [
        "Factures illimitées",
        "Relances automatiques",
        "Templates personnalisés",
        "Signature électronique",
        "Intégration contrats",
        "Analytics avancées",
        "Support prioritaire"
      ],
      popular: true,
      buttonText: "Essayer 14 jours gratuits",
      buttonStyle: "bg-[#1c6ae4] hover:bg-blue-700"
    },
    {
      name: "Premium",
      price: "59",
      period: "par mois",
      icon: Crown,
      description: "Pour les entreprises",
      features: [
        "Tout du plan Pro",
        "Notifications WhatsApp",
        "Paiements en ligne",
        "API complète",
        "Multi-utilisateurs",
        "Intégration ERP",
        "Support téléphonique",
        "Formation dédiée"
      ],
      popular: false,
      buttonText: "Contactez-nous",
      buttonStyle: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Commencez gratuitement et évoluez selon vos besoins
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                plan.popular ? 'border-2 border-[#1c6ae4] shadow-xl' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#1c6ae4] text-white px-4 py-2 rounded-full text-sm font-medium">
                    Le plus populaire
                  </div>
                </div>
              )}
              
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <plan.icon className="w-8 h-8 text-[#1c6ae4]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">TND</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{plan.period}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Partenaires de confiance en Tunisie
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">Attijari Bank</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">Ooredoo</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">Flouci</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
              <span className="font-semibold text-gray-700">D17</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;