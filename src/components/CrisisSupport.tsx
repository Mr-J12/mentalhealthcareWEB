import React, { useState } from 'react';
import { Phone, MessageSquare, Shield, ExternalLink, AlertTriangle } from 'lucide-react';

const CrisisSupport: React.FC = () => {
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  const crisisResources = [
    {
      id: 'suicide',
      title: 'Suicide Prevention',
      description: '988 Suicide & Crisis Lifeline',
      phone: '988',
      text: 'Text 988',
      available: '24/7',
      color: 'from-red-500 to-pink-500',
      icon: Shield
    },
    {
      id: 'crisis',
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741',
      phone: '741741',
      text: 'Text HOME',
      available: '24/7',
      color: 'from-blue-500 to-cyan-500',
      icon: MessageSquare
    },
    {
      id: 'domestic',
      title: 'Domestic Violence',
      description: 'National Domestic Violence Hotline',
      phone: '1-800-799-7233',
      text: 'Text START to 88788',
      available: '24/7',
      color: 'from-purple-500 to-indigo-500',
      icon: Shield
    },
    {
      id: 'mental',
      title: 'Mental Health',
      description: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      text: 'Visit website',
      available: '24/7',
      color: 'from-green-500 to-emerald-500',
      icon: Phone
    }
  ];

  const copingStrategies = [
    "Take slow, deep breaths",
    "Ground yourself: 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste",
    "Call a trusted friend or family member",
    "Go to a safe, public place",
    "Remove yourself from immediate danger",
    "Remember: This feeling will pass",
    "Use positive self-talk",
    "Focus on the present moment"
  ];

  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Crisis Support</h2>
          <p className="text-sm text-gray-600">Immediate help when you need it most</p>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="bg-red-100 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Emergency?</h3>
            <p className="text-sm text-red-700 mb-2">
              If you're in immediate danger, call 911 or go to your nearest emergency room.
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              Call 911 Now
            </button>
          </div>
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Crisis Hotlines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crisisResources.map((resource) => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedResource(resource.id === selectedResource ? null : resource.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${resource.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`tel:${resource.phone}`}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {resource.phone}
                      </a>
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        <MessageSquare className="w-4 h-4" />
                        {resource.text}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Available {resource.available}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immediate Coping Strategies */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Immediate Coping Strategies</h3>
        <div className="space-y-3">
          {copingStrategies.map((strategy, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-sm text-gray-700">{strategy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Help */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">Find Professional Help</h3>
        <div className="space-y-3">
          <a
            href="https://www.psychologytoday.com/us/therapists"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-800">Psychology Today</p>
              <p className="text-sm text-gray-600">Find therapists in your area</p>
            </div>
          </a>
          <a
            href="https://www.samhsa.gov/find-help/national-helpline"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-800">SAMHSA Treatment Locator</p>
              <p className="text-sm text-gray-600">Find treatment facilities</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupport;