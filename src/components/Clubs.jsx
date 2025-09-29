import React, { useState } from 'react';
import { Users, MapPin, Phone, Mail, Globe, Search, Filter, Star, Clock } from 'lucide-react';

const Clubs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const clubs = [
    {
      id: 1,
      name: 'Elite Athletic Club',
      category: 'athletics',
      description: 'Premier training facility for track and field athletes with Olympic-grade equipment.',
      location: 'New York, NY',
      phone: '+1 (555) 123-4567',
      email: 'info@eliteathletic.com',
      website: 'www.eliteathletic.com',
      members: 450,
      rating: 4.8,
      established: 1998,
      image: '🏃‍♂️',
      facilities: ['Track', 'Field Events', 'Gym', 'Pool'],
      coaches: 12
    },
    {
      id: 2,
      name: 'Thunder Soccer Academy',
      category: 'team-sports',
      description: 'Professional soccer training academy developing future champions.',
      location: 'Los Angeles, CA',
      phone: '+1 (555) 234-5678',
      email: 'contact@thundersoccer.com',
      website: 'www.thundersoccer.com',
      members: 320,
      rating: 4.7,
      established: 2005,
      image: '⚽',
      facilities: ['Soccer Fields', 'Training Ground', 'Gym', 'Recovery Center'],
      coaches: 8
    },
    {
      id: 3,
      name: 'Phoenix Basketball Club',
      category: 'team-sports',
      description: 'Community-focused basketball club with programs for all skill levels.',
      location: 'Chicago, IL',
      phone: '+1 (555) 345-6789',
      email: 'hello@phoenixbasket.com',
      website: 'www.phoenixbasket.com',
      members: 280,
      rating: 4.5,
      established: 2010,
      image: '🏀',
      facilities: ['Indoor Courts', 'Outdoor Courts', 'Training Facility'],
      coaches: 6
    },
    {
      id: 4,
      name: 'Ace Tennis Academy',
      category: 'individual',
      description: 'State-of-the-art tennis facility with professional coaching programs.',
      location: 'Miami, FL',
      phone: '+1 (555) 456-7890',
      email: 'info@acetennis.com',
      website: 'www.acetennis.com',
      members: 180,
      rating: 4.9,
      established: 2001,
      image: '🎾',
      facilities: ['Clay Courts', 'Hard Courts', 'Pro Shop', 'Fitness Center'],
      coaches: 15
    },
    {
      id: 5,
      name: 'Iron Fist Martial Arts',
      category: 'combat',
      description: 'Traditional martial arts dojo offering multiple disciplines and self-defense.',
      location: 'Seattle, WA',
      phone: '+1 (555) 567-8901',
      email: 'sensei@ironfist.com',
      website: 'www.ironfist.com',
      members: 150,
      rating: 4.6,
      established: 1995,
      image: '🥋',
      facilities: ['Main Dojo', 'Training Mats', 'Equipment Room', 'Meditation Space'],
      coaches: 4
    },
    {
      id: 6,
      name: 'Aqua Swim Club',
      category: 'individual',
      description: 'Competitive swimming club with programs from beginners to elite athletes.',
      location: 'San Diego, CA',
      phone: '+1 (555) 678-9012',
      email: 'swim@aquaclub.com',
      website: 'www.aquaclub.com',
      members: 200,
      rating: 4.4,
      established: 2008,
      image: '🏊‍♂️',
      facilities: ['Olympic Pool', 'Training Pool', 'Diving Platform', 'Recovery Pool'],
      coaches: 7
    }
  ];

  const categories = [
    { id: 'all', name: 'All Clubs', icon: '🏆' },
    { id: 'athletics', name: 'Athletics', icon: '🏃‍♂️' },
    { id: 'team-sports', name: 'Team Sports', icon: '⚽' },
    { id: 'individual', name: 'Individual Sports', icon: '🎾' },
    { id: 'combat', name: 'Combat Sports', icon: '🥊' }
  ];

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">Clubs Directory</h1>
        <p className="text-blue-600">Discover and connect with sports clubs in your area.</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search clubs by name, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-lg'
                : 'bg-white/70 text-blue-700 hover:bg-blue-50 border border-blue-200'
            }`}
          >
            <span>{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <div
            key={club.id}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Club Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{club.image}</div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">{club.name}</h3>
                  <div className="flex items-center space-x-1">
                    {renderStars(club.rating)}
                    <span className="text-sm text-blue-600 ml-1">({club.rating})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Club Info */}
            <p className="text-blue-700 text-sm mb-4 line-clamp-2">{club.description}</p>

            {/* Club Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-lg font-bold text-blue-900">{club.members}</p>
                <p className="text-xs text-blue-600">Members</p>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <p className="text-lg font-bold text-green-900">{club.coaches}</p>
                <p className="text-xs text-green-600">Coaches</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-blue-800">{club.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <a href={`tel:${club.phone}`} className="text-blue-800 hover:text-blue-600">
                  {club.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <a href={`mailto:${club.email}`} className="text-blue-800 hover:text-blue-600">
                  {club.email}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <a 
                  href={`https://${club.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-800 hover:text-blue-600"
                >
                  {club.website}
                </a>
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-4">
              <p className="text-xs font-medium text-blue-900 mb-2">Facilities:</p>
              <div className="flex flex-wrap gap-1">
                {club.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {/* Established */}
            <div className="flex items-center justify-between text-xs text-blue-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Est. {club.established}</span>
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-sky-500 text-white px-3 py-1 rounded-lg hover:from-blue-600 hover:to-sky-600 transition-all duration-200 text-xs font-medium">
                Contact Club
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-2xl">
          <Users className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">No clubs found</h3>
          <p className="text-blue-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Directory Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{clubs.length}</p>
            <p className="text-blue-100">Total Clubs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{clubs.reduce((sum, club) => sum + club.members, 0).toLocaleString()}</p>
            <p className="text-blue-100">Total Members</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{clubs.reduce((sum, club) => sum + club.coaches, 0)}</p>
            <p className="text-blue-100">Expert Coaches</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">
              {(clubs.reduce((sum, club) => sum + club.rating, 0) / clubs.length).toFixed(1)}
            </p>
            <p className="text-blue-100">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clubs;