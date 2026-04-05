import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { centersAPI } from '@/services/api';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Recycle,
  Search,
  Navigation,
  ExternalLink,
  Building2
} from 'lucide-react';

interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  acceptedWaste: string[];
  operatingHours: string;
  distance?: number;
}

export default function RecyclingCenters() {
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<RecyclingCenter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWasteType, setSelectedWasteType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');

  const wasteTypes = ['all', 'plastic', 'paper', 'glass', 'metal', 'organic'];

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await centersAPI.getAll();
        setCenters(data);
        setFilteredCenters(data);
      } catch (error) {
        console.error('Error fetching recycling centers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  useEffect(() => {
    let filtered = centers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (center) =>
          center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          center.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by waste type
    if (selectedWasteType !== 'all') {
      filtered = filtered.filter((center) =>
        center.acceptedWaste.includes(selectedWasteType)
      );
    }

    setFilteredCenters(filtered);
  }, [searchQuery, selectedWasteType, centers]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLocationError('');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          try {
            const nearbyCenters = await centersAPI.getNearby(latitude, longitude);
            setFilteredCenters(nearbyCenters);
          } catch {
            console.error('Error fetching nearby centers');
          }
        },
        () => {
          setLocationError('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const getDirections = (center: RecyclingCenter) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`;
    window.open(url, '_blank');
  };

  const getWasteTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      plastic: 'bg-red-100 text-red-700',
      paper: 'bg-teal-100 text-teal-700',
      glass: 'bg-green-100 text-green-700',
      metal: 'bg-yellow-100 text-yellow-700',
      organic: 'bg-emerald-100 text-emerald-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
            <MapPin className="w-4 h-4 mr-2" />
            Find Recycling Centers
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Recycling Centers in Kenya
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the nearest recycling facilities near you. Filter by waste type and get directions.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {wasteTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedWasteType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedWasteType === type
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                <Button
                  onClick={getUserLocation}
                  variant="outline"
                  className="flex items-center"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Near Me
                </Button>
              </div>
              {locationError && (
                <p className="text-red-500 text-sm mt-3">{locationError}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredCenters.length}</span> recycling centers
          </p>
        </div>

        {/* Centers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center, index) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-green-600" />
                    </div>
                    {center.distance && (
                      <Badge className="bg-blue-100 text-blue-700">
                        {center.distance.toFixed(1)} km
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {center.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{center.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{center.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{center.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{center.operatingHours}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Accepted Waste:</p>
                    <div className="flex flex-wrap gap-1">
                      {center.acceptedWaste.map((type) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className={getWasteTypeColor(type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => getDirections(center)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCenters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No centers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    Can't Find a Center Near You?
                  </h2>
                  <p className="text-blue-100 mb-6">
                    We're constantly expanding our network of recycling partners across Kenya. 
                    If you know of a recycling center that should be listed, let us know!
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Recycle className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Partner With Us</h4>
                        <p className="text-blue-100 text-sm">Are you a recycling facility? Join our network.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Suggest a Center</h4>
                        <p className="text-blue-100 text-sm">Help us expand our database.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Contact Us
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
