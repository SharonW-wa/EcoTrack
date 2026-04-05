import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { wasteAPI } from '@/services/api';
import {
  Leaf,
  CheckCircle,
  XCircle,
  Info,
  Recycle,
  AlertTriangle
} from 'lucide-react';
import "../styles/WasteCategories.css";

interface WasteCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  examples: string[];
  disposalInstructions: string;
  recyclable: boolean;
  environmentalImpact: string;
}

export default function WasteCategories() {
  const [categories, setCategories] = useState<WasteCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to get image URLs from public folder
  const getCategoryImage = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    switch (name) {
      case 'plastic':
        return '/images/plastic-icon.jpeg';
      case 'paper':
        return '/images/paper-icon.jpeg';
      case 'glass':
        return '/images/glass-icon.jpeg';
      case 'metal':
        return '/images/metal-icon.jpeg';
      case 'organic':
        return '/images/organic-icon.jpeg';
      case 'e-waste':
      case 'electronic':
      case 'electronics':
        return '/images/e-waste-icon.jpeg';
      default:
        return '/images/plastic-icon.jpg';
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await wasteAPI.getAll();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }
      } catch (error) {
        console.error('Error fetching waste categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
            <Recycle className="w-4 h-4 mr-2" />
            Waste Classification Guide
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Learn to Sort Your Waste
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Proper waste segregation is the first step towards effective recycling. 
            Learn how to categorize different types of waste for proper disposal.
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Waste Categories</h2>
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                      selectedCategory?.id === category.id
                        ? 'bg-white shadow-lg ring-2 ring-green-500'
                        : 'bg-white/50 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Custom Image */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-green-100 flex items-center justify-center">
                        <img 
                          src={getCategoryImage(category.name)} 
                          alt={category.name} 
                          className="w-10 h-10 object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{category.description}</p>
                      </div>
                      {category.recyclable ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Category Details */}
          <div className="lg:col-span-2">
            {selectedCategory && (
              <motion.div
                key={selectedCategory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  {/* Header with Image */}
                  <div className="relative h-48 bg-gradient-to-r from-green-600 to-emerald-700">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-6 flex items-center space-x-4">
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                        <img 
                          src={getCategoryImage(selectedCategory.name)} 
                          alt={selectedCategory.name} 
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedCategory.name}</h2>
                        <p className="text-white/80 text-sm mt-1">{selectedCategory.description}</p>
                        <Badge className="mt-2 bg-white/20 text-white border-0">
                          {selectedCategory.recyclable ? 'Recyclable' : 'Non-Recyclable'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Examples */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Info className="w-5 h-5 mr-2 text-blue-500" />
                          Common Examples
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCategory.examples.map((example, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Disposal Instructions */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Recycle className="w-5 h-5 mr-2 text-green-500" />
                          How to Dispose
                        </h3>
                        <p className="text-gray-600">{selectedCategory.disposalInstructions}</p>
                      </div>
                    </div>

                    {/* Environmental Impact */}
                    <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-100">
                      <h3 className="text-lg font-semibold text-amber-800 mb-2 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Environmental Impact
                      </h3>
                      <p className="text-amber-700">{selectedCategory.environmentalImpact}</p>
                    </div>

                    {/* Tips */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Leaf className="w-5 h-5 mr-2 text-green-500" />
                        Recycling Tips
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-green-800 text-sm">
                            <strong>Do:</strong> Clean and dry items before recycling to prevent contamination.
                          </p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-red-800 text-sm">
                            <strong>Don't:</strong> Mix different types of waste in the same bin.
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-blue-800 text-sm">
                            <strong>Tip:</strong> Flatten containers to save space in recycling bins.
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-purple-800 text-sm">
                            <strong>Remember:</strong> Check local recycling guidelines for specific requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Educational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
            <CardContent className="p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    Why Proper Waste Segregation Matters
                  </h2>
                  <p className="text-green-100 mb-6">
                    When waste is properly sorted, recycling becomes more efficient and effective. 
                    Contaminated recycling can lead to entire batches being sent to landfills.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Reduces Landfill Waste</h4>
                        <p className="text-green-100 text-sm">Proper recycling diverts waste from landfills</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Conserves Resources</h4>
                        <p className="text-green-100 text-sm">Recycled materials reduce the need for raw materials</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Saves Energy</h4>
                        <p className="text-green-100 text-sm">Recycling uses less energy than producing new materials</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-yellow-300 mb-2">70%</div>
                    <p className="text-green-100 text-sm">of waste can be recycled</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-yellow-300 mb-2">17</div>
                    <p className="text-green-100 text-sm">trees saved per ton of paper</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-yellow-300 mb-2">95%</div>
                    <p className="text-green-100 text-sm">energy saved recycling aluminum</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div className="text-4xl font-bold text-yellow-300 mb-2">450</div>
                    <p className="text-green-100 text-sm">years for plastic to decompose</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}