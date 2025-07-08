import React, { useState } from 'react';
import { Book, Search, Tag, ExternalLink, Heart, Brain, Smile } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'audio' | 'exercise';
  url: string;
  tags: string[];
  readTime?: string;
}

const ResourceLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Anxiety: A Comprehensive Guide',
      description: 'Learn about anxiety disorders, symptoms, and evidence-based treatment approaches.',
      category: 'anxiety',
      type: 'article',
      url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
      tags: ['anxiety', 'mental health', 'coping'],
      readTime: '8 min'
    },
    {
      id: '2',
      title: 'Mindfulness Meditation for Beginners',
      description: 'A step-by-step guide to starting your mindfulness practice.',
      category: 'mindfulness',
      type: 'exercise',
      url: 'https://www.mindful.org/how-to-meditate/',
      tags: ['mindfulness', 'meditation', 'stress relief'],
      readTime: '5 min'
    },
    {
      id: '3',
      title: 'Cognitive Behavioral Therapy Techniques',
      description: 'Practical CBT strategies you can use in daily life.',
      category: 'therapy',
      type: 'article',
      url: 'https://www.psychologytoday.com/us/therapy-types/cognitive-behavioral-therapy',
      tags: ['CBT', 'therapy', 'tools'],
      readTime: '12 min'
    },
    {
      id: '4',
      title: 'Dealing with Depression: Self-Help Strategies',
      description: 'Evidence-based self-help techniques for managing depression.',
      category: 'depression',
      type: 'article',
      url: 'https://www.nhs.uk/mental-health/self-help/guides/depression/',
      tags: ['depression', 'self-help', 'coping'],
      readTime: '10 min'
    },
    {
      id: '5',
      title: 'Progressive Muscle Relaxation',
      description: 'A guided relaxation technique to reduce physical tension.',
      category: 'stress',
      type: 'exercise',
      url: 'https://www.uofmhealth.org/health-library/uz2225',
      tags: ['relaxation', 'stress relief', 'exercise'],
      readTime: '15 min'
    },
    {
      id: '6',
      title: 'Building Healthy Sleep Habits',
      description: 'Tips for improving sleep quality and mental health.',
      category: 'wellness',
      type: 'article',
      url: 'https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep',
      tags: ['sleep', 'wellness', 'mental health'],
      readTime: '7 min'
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Book },
    { id: 'anxiety', name: 'Anxiety', icon: Brain },
    { id: 'depression', name: 'Depression', icon: Heart },
    { id: 'mindfulness', name: 'Mindfulness', icon: Smile },
    { id: 'therapy', name: 'Therapy', icon: Brain },
    { id: 'stress', name: 'Stress', icon: Heart },
    { id: 'wellness', name: 'Wellness', icon: Smile }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-red-100 text-red-700';
      case 'audio': return 'bg-green-100 text-green-700';
      case 'exercise': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 h-full overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
          <Book className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Resource Library</h2>
          <p className="text-sm text-gray-600">Helpful resources for your mental health journey</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                    {resource.type}
                  </span>
                  {resource.readTime && (
                    <span className="text-xs text-gray-500">{resource.readTime}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8">
          <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No resources found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;