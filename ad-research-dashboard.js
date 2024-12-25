import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Instagram, Facebook, Users, Activity } from 'lucide-react';

const API_URL = 'https://ad-research-api.onrender.com';

const AdResearchDashboard = () => {
  const [activeTab, setActiveTab] = useState('advertisers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US'); // Changed default to US
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'PL', name: 'Poland' },
    { code: 'GB', name: 'United Kingdom' },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${API_URL}/api/search-advertisers?query=${encodeURIComponent(searchQuery)}&country_code=${selectedCountry}`;
      console.log('Fetching:', url);
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Search results:', data);
      setAdvertisers(data.results || []);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ad Research Platform</h1>
        <div className="flex gap-4">
          <Button 
            variant={activeTab === 'advertisers' ? 'default' : 'outline'}
            onClick={() => setActiveTab('advertisers')}
            className="flex items-center gap-2"
          >
            <Users size={16} />
            Advertisers
          </Button>
          <Button 
            variant={activeTab === 'ads' ? 'default' : 'outline'}
            onClick={() => setActiveTab('ads')}
            className="flex items-center gap-2"
          >
            <Activity size={16} />
            Ads
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search advertisers..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
            <Button onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white"
        >
          {countries.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching advertisers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-red-600">
          <p>Error: {error}</p>
          <Button onClick={handleSearch} className="mt-4">
            Retry
          </Button>
        </div>
      )}

      {/* Results */}
      {!loading && !error && advertisers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisers.map(advertiser => (
            <Card key={advertiser.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-lg flex items-start gap-2">
                  <div>
                    {advertiser.name}
                    {advertiser.verification === "blue_verified" && (
                      <span className="inline-block ml-1 text-blue-500">✓</span>
                    )}
                    <div className="text-sm text-gray-500 font-normal">
                      {advertiser.category}
                    </div>
                  </div>
                </CardTitle>
                {advertiser.imageURI && (
                  <img 
                    src={advertiser.imageURI} 
                    alt={advertiser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold">
                        {advertiser.likes?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-gray-500">FB Likes</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold">
                        {advertiser.igFollowers?.toLocaleString() || 0}
                      </div>
                      <div className="text-xs text-gray-500">IG Followers</div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center pt-2">
                    {advertiser.id && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => window.open(`https://facebook.com/${advertiser.id}`, '_blank')}
                      >
                        <Facebook size={16} />
                        Profile
                      </Button>
                    )}
                    {advertiser.igUsername && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => window.open(`https://instagram.com/${advertiser.igUsername}`, '_blank')}
                      >
                        <Instagram size={16} />
                        Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && advertisers.length === 0 && searchQuery && (
        <div className="text-center py-8 text-gray-600">
          No advertisers found for your search.
        </div>
      )}
    </div>
  );
};

export default AdResearchDashboard;