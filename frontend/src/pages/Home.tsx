import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { statsAPI, quotesAPI } from '@/services/api';
import {Leaf, MapPin, Gift, BookOpen, Recycle, ArrowRight, Users, Building2, Award} from 'lucide-react';
import "../styles/Home.css";

interface Stats {
  totalUsers: number;
  totalCenters: number;
  totalFeedback: number;
  totalRecycled: number;
  totalPointsAwarded: number;
}

interface EcoQuote {
  id: string;
  quote: string;
  author: string;
}

const features = [
  {
    icon: Recycle,
    title: 'Waste Categorization',
    description: 'Learn how to properly sort and categorize different types of waste for effective recycling.',
    color: 'from-red-400 to-red-600',
    link: '/waste-categories'
  },
  {
    icon: MapPin,
    title: 'Find Recycling Centers',
    description: 'Locate the nearest recycling facilities with GPS-enabled search and directions.',
    color: 'from-blue-400 to-blue-600',
    link: '/recycling-centers'
  },
  {
    icon: Gift,
    title: 'Earn Rewards',
    description: 'Get reward points for every recycling activity and redeem them for exciting benefits.',
    color: 'from-purple-400 to-purple-600',
    link: '/rewards'
  },
  {
    icon: BookOpen,
    title: 'Eco Education',
    description: 'Access educational content and inspiring quotes to promote sustainable living.',
    color: 'from-green-400 to-green-600',
    link: '/waste-categories'
  }
];

const wasteTypes = [
  { name: 'Plastic', icon: '♳', color: 'bg-red-100 text-red-600', description: 'Bottles, containers, bags' },
  { name: 'Paper', icon: '📄', color: 'bg-teal-100 text-teal-600', description: 'Newspapers, cardboard' },
  { name: 'Glass', icon: '🍾', color: 'bg-green-100 text-green-600', description: 'Bottles, jars' },
  { name: 'Metal', icon: '🔧', color: 'bg-yellow-100 text-yellow-600', description: 'Cans, scrap metal' },
  { name: 'Organic', icon: '🍃', color: 'bg-emerald-100 text-emerald-600', description: 'Food waste, compost' }
];

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [quote, setQuote] = useState<EcoQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, quoteData] = await Promise.all([
          statsAPI.getAll(),
          quotesAPI.getRandom()
        ]);
        setStats(statsData);
        setQuote(quoteData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 heroPattern" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                <Leaf className="w-4 h-4 mr-2" />
                Sustainable Waste Management
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Recycle Today for a{' '}
                <span className="text-yellow-300">Greener Tomorrow</span>
              </h1>
              <p className="text-lg lg:text-xl text-green-100 mb-8 max-w-xl">
                Join Kenya's leading waste management platform. Earn rewards, find recycling centers, 
                and make a positive impact on our environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/waste-categories">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-2xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    {wasteTypes.map((type, index) => (
                      <motion.div
                        key={type.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`${type.color} rounded-2xl p-4 text-center`}
                      >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="font-semibold">{type.name}</div>
                        <div className="text-xs opacity-75">{type.description}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f0fdf4"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0 }}
                >
                  <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Users className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <div className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</div>
                      <div className="text-sm text-gray-500">Active Users</div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Building2 className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <div className="text-3xl font-bold text-gray-900">{stats?.totalCenters || 0}</div>
                      <div className="text-sm text-gray-500">Recycling Centers</div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Recycle className="w-8 h-8 mx-auto text-teal-600 mb-2" />
                      <div className="text-3xl font-bold text-gray-900">{stats?.totalRecycled || 0}kg</div>
                      <div className="text-sm text-gray-500">Waste Recycled</div>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Award className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                      <div className="text-3xl font-bold text-gray-900">{stats?.totalPointsAwarded || 0}</div>
                      <div className="text-sm text-gray-500">Points Awarded</div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How EcoTrack Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform makes recycling easy, rewarding, and impactful. 
              Start your green journey today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.link}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      <div className="mt-4 flex items-center text-green-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eco Quote Section */}
      {quote && (
        <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Leaf className="w-12 h-12 mx-auto mb-6 opacity-50" />
            <blockquote className="text-2xl lg:text-4xl font-light italic mb-6">
              "{quote.quote}"
            </blockquote>
            <cite className="text-lg text-green-100 not-italic">
              — {quote.author}
            </cite>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 lg:p-16 text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of Kenyans who are already making a positive impact on our environment. 
              Sign up today and start earning rewards for your recycling efforts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/recycling-centers">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8">
                  Find Centers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
