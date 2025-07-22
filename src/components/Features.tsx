import React from 'react';
import { 
  FileText, 
  CreditCard, 
  Clock, 
  Bell, 
  RefreshCw, 
  PenTool, 
  Download, 
  BarChart3, 
  Users, 
  Link 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Création rapide de devis/facture",
      description: "Interface intuitive pour générer vos documents en quelques clics avec templates personnalisables"
    },
    {
      icon: CreditCard,
      title: "Paiement en ligne",
      description: "Intégration Flouci, D17, Stripe pour encaisser directement depuis vos factures"
    },
    {
      icon: Clock,
      title: "Suivi des paiements",
      description: "Statuts en temps réel : payé, partiellement payé, en retard avec alertes visuelles"
    },
    {
      icon: Bell,
      title: "Notifications intelligentes",
      description: "Push, email et WhatsApp pour rester informé de chaque action client"
    },
    {
      icon: RefreshCw,
      title: "Relances automatiques",
      description: "Scénarios de relance personnalisés selon les échéances et profils clients"
    },
    {
      icon: PenTool,
      title: "Signature électronique",
      description: "Validation de devis en ligne avec signature numérique sécurisée"
    },
    {
      icon: Download,
      title: "Export PDF/Excel",
      description: "Génération automatique avec numérotation conforme aux standards tunisiens"
    },
    {
      icon: BarChart3,
      title: "Dashboard de facturation",
      description: "Tableaux de bord avec KPIs, graphiques et analyses de performance"
    },
    {
      icon: Users,
      title: "Historique client",
      description: "Suivi complet des interactions et transactions par client"
    },
    {
      icon: Link,
      title: "Intégration contrats",
      description: "Synchronisation native avec le module contrats E-Tafakna"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin pour facturer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une suite complète d'outils pour automatiser votre processus de facturation 
            et améliorer votre trésorerie
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-[#1c6ae4] bg-opacity-10 rounded-lg p-3 w-fit mb-6 group-hover:bg-opacity-20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#1c6ae4]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;