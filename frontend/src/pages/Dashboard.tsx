import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { quotesAPI, authAPI } from '@/services/api';
import {
  Leaf,
  MapPin,
  Gift,
  Recycle,
  TrendingUp,
  Award,
  Calendar,
  ArrowRight,
  Target,
  Users
} from 'lucide-react';

interface EcoQuote {
  id: string;
  quote: string;
  author: string;
}

interface LeaderboardUser {
  id: string;
  fullName: string;
  rewardPoints: number;
  recyclingCount: number;
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [quote, setQuote] = useState<EcoQuote | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refreshUser();
        const [quoteData, leaderboardData] = await Promise.all([
          quotesAPI.getRandom(),
          authAPI.getLeaderboard()
        ]);
        setQuote(quoteData);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getNextLevelPoints = (points: number) => {
    const levels = [0, 100, 250, 500, 1000, 2000, 5000];
    for (const level of levels) {
      if (points < level) return level;
    }
    return 10000;
  };

  const getLevel = (points: number) => {
    if (points >= 5000) return { name: 'Eco Master', color: 'bg-purple-500' };
    if (points >= 2000) return { name: 'Green Champion', color: 'bg-blue-500' };
    if (points >= 1000) return { name: 'Earth Guardian', color: 'bg-teal-500' };
    if (points >= 500) return { name: 'Eco Warrior', color: 'bg-green-500' };
    if (points >= 250) return { name: 'Nature Lover', color: 'bg-yellow-500' };
    if (points >= 100) return { name: 'Green Starter', color: 'bg-orange-500' };
    return { name: 'Eco Newbie', color: 'bg-gray-400' };
  };

  const userPoints = user?.rewardPoints || 0;
  const nextLevelPoints = getNextLevelPoints(userPoints);
  const currentLevel = getLevel(userPoints);
  const progress = Math.min((userPoints / nextLevelPoints) * 100, 100);

  const recentActivity = user?.recyclingHistory?.slice(-5).reverse() || [];

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
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your recycling journey overview
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Points</p>
                    <p className="text-3xl font-bold">{userPoints}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Recycling Activities</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {user?.recyclingHistory?.length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Current Level</p>
                    <p className="text-xl font-bold text-gray-900">{currentLevel.name}</p>
                  </div>
                  <div className={`w-12 h-12 ${currentLevel.color} rounded-full flex items-center justify-center`}>
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Recycled</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {user?.recyclingHistory?.reduce((sum, h) => sum + h.quantity, 0).toFixed(1) || 0}kg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Level Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-600" />
                    Level Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {currentLevel.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {userPoints} / {nextLevelPoints} points
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <p className="text-sm text-gray-500 mt-2">
                    {nextLevelPoints - userPoints} more points to reach the next level!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Recent Activity
                  </CardTitle>
                  <Link to="/rewards">
                    <Button variant="ghost" size="sm" className="text-green-600">
                      View All <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Recycle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Recycled {activity.quantity}kg of {activity.wasteType}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(activity.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700">
                            +{activity.pointsEarned} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Recycle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No recycling activity yet</p>
                      <Link to="/recycling-centers">
                        <Button className="mt-4 bg-green-600 hover:bg-green-700">
                          Find Recycling Centers
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Link to="/recycling-centers">
                      <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center">
                        <MapPin className="w-6 h-6 mb-2 text-blue-600" />
                        <span className="text-sm">Find Centers</span>
                      </Button>
                    </Link>
                    <Link to="/rewards">
                      <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center">
                        <Gift className="w-6 h-6 mb-2 text-purple-600" />
                        <span className="text-sm">Redeem Points</span>
                      </Button>
                    </Link>
                    <Link to="/waste-categories">
                      <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center">
                        <Leaf className="w-6 h-6 mb-2 text-green-600" />
                        <span className="text-sm">Waste Guide</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Daily Quote */}
            {quote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <CardContent className="p-6">
                    <Leaf className="w-8 h-8 mb-4 opacity-50" />
                    <p className="text-lg italic mb-3">"{quote.quote}"</p>
                    <p className="text-sm text-green-100">— {quote.author}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Top Recyclers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.slice(0, 5).map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                            index === 1 ? 'bg-gray-100 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900">{user.fullName}</span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          {user.rewardPoints} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
