import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { rewardsAPI, centersAPI } from '@/services/api';
import { toast } from 'sonner';
import {
  Gift,
  Trophy,
  Star,
  History,
  Recycle,
  CheckCircle,
  ShoppingBag,
  Coffee,
  Ticket
} from 'lucide-react';

interface RecyclingCenter {
  id: string;
  name: string;
}

interface Reward {
  id: string;
  points: number;
  type: string;
  description: string;
  createdAt: string;
}

const rewardOptions = [
  { id: 'eco-bag', name: 'Eco-Friendly Shopping Bag', points: 100, icon: ShoppingBag },
  { id: 'coffee', name: 'Free Coffee Voucher', points: 250, icon: Coffee },
  { id: 'movie', name: 'Movie Ticket', points: 500, icon: Ticket },
  { id: 'discount', name: '20% Store Discount', points: 750, icon: Gift },
  { id: 'plant', name: 'Potted Plant', points: 1000, icon: Recycle },
];

export default function Rewards() {
  const { user, refreshUser } = useAuth();
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [showRedeemForm, setShowRedeemForm] = useState(false);
  
  // Form states
  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [centerId, setCenterId] = useState('');
  const [selectedReward, setSelectedReward] = useState('');

  const wasteTypes = ['plastic', 'paper', 'glass', 'metal', 'organic'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centersData, rewardsData] = await Promise.all([
          centersAPI.getAll(),
          rewardsAPI.getAll()
        ]);
        setCenters(centersData);
        setRewards(rewardsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRecordRecycling = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wasteType || !quantity || !centerId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await rewardsAPI.recordRecycling(
        wasteType,
        parseFloat(quantity),
        centerId
      );
      
      toast.success(`Earned ${result.pointsEarned} points!`);
      await refreshUser();
      
      // Refresh rewards history
      const rewardsData = await rewardsAPI.getAll();
      setRewards(rewardsData);
      
      // Reset form
      setWasteType('');
      setQuantity('');
      setCenterId('');
      setShowRecordForm(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to record recycling activity');
    }
  };

  const handleRedeemPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReward) {
      toast.error('Please select a reward');
      return;
    }

    const reward = rewardOptions.find(r => r.id === selectedReward);
    if (!reward) return;

    const userPoints = user?.rewardPoints || 0;
    if (userPoints < reward.points) {
      toast.error(`You need ${reward.points} points for this reward`);
      return;
    }

    try {
      await rewardsAPI.redeemPoints(reward.points, reward.name);
      
      toast.success(`Successfully redeemed ${reward.name}!`);
      await refreshUser();
      
      // Refresh rewards history
      const rewardsData = await rewardsAPI.getAll();
      setRewards(rewardsData);
      
      setSelectedReward('');
      setShowRedeemForm(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to redeem points');
    }
  };

  const getLevel = (points: number) => {
    if (points >= 5000) return { name: 'Eco Master', color: 'bg-purple-500', next: 10000 };
    if (points >= 2000) return { name: 'Green Champion', color: 'bg-blue-500', next: 5000 };
    if (points >= 1000) return { name: 'Earth Guardian', color: 'bg-teal-500', next: 2000 };
    if (points >= 500) return { name: 'Eco Warrior', color: 'bg-green-500', next: 1000 };
    if (points >= 250) return { name: 'Nature Lover', color: 'bg-yellow-500', next: 500 };
    if (points >= 100) return { name: 'Green Starter', color: 'bg-orange-500', next: 250 };
    return { name: 'Eco Newbie', color: 'bg-gray-400', next: 100 };
  };

  const userPoints = user?.rewardPoints || 0;
  const currentLevel = getLevel(userPoints);
  const progress = Math.min((userPoints / currentLevel.next) * 100, 100);

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
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-4">
            <Gift className="w-4 h-4 mr-2" />
            Rewards Program
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Earn Rewards for Recycling
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every recycling activity earns you points. Redeem them for exciting rewards!
          </p>
        </motion.div>

        {/* Points Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white h-full">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Your Current Points</p>
                    <p className="text-5xl font-bold">{userPoints}</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-100">{currentLevel.name}</span>
                    <span className="text-green-100">{userPoints} / {currentLevel.next} pts</span>
                  </div>
                  <Progress value={progress} className="h-3 bg-white/20" />
                </div>
                
                <p className="text-green-100 text-sm">
                  {currentLevel.next - userPoints} more points to reach the next level!
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowRecordForm(!showRecordForm)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Recycle className="w-4 h-4 mr-2" />
                    Record Recycling
                  </Button>
                  <Button
                    onClick={() => setShowRedeemForm(!showRedeemForm)}
                    variant="outline"
                    className="w-full"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Redeem Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Record Recycling Form */}
        {showRecordForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Recycle className="w-5 h-5 mr-2 text-green-600" />
                  Record Recycling Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRecordRecycling} className="grid md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="wasteType">Waste Type</Label>
                    <Select value={wasteType} onValueChange={setWasteType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {wasteTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity (kg)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="center">Recycling Center</Label>
                    <Select value={centerId} onValueChange={setCenterId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select center" />
                      </SelectTrigger>
                      <SelectContent>
                        {centers.map((center) => (
                          <SelectItem key={center.id} value={center.id}>
                            {center.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Redeem Points Form */}
        {showRedeemForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-purple-600" />
                  Redeem Your Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRedeemPoints}>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {rewardOptions.map((reward) => {
                      const Icon = reward.icon;
                      const canAfford = userPoints >= reward.points;
                      
                      return (
                        <button
                          key={reward.id}
                          type="button"
                          onClick={() => setSelectedReward(reward.id)}
                          disabled={!canAfford}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            selectedReward === reward.id
                              ? 'border-green-500 bg-green-50'
                              : canAfford
                              ? 'border-gray-200 hover:border-green-300'
                              : 'border-gray-100 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-purple-600" />
                            </div>
                            <Badge className={canAfford ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                              {reward.points} pts
                            </Badge>
                          </div>
                          <p className="font-medium text-gray-900 mt-2">{reward.name}</p>
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    type="submit"
                    disabled={!selectedReward}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Redeem Selected Reward
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Reward History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="w-5 h-5 mr-2 text-green-600" />
                    Reward History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {rewards.length > 0 ? (
                    <div className="space-y-3">
                      {rewards.slice().reverse().map((reward) => (
                        <div
                          key={reward.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              reward.type === 'earned' ? 'bg-green-100' : 'bg-purple-100'
                            }`}>
                              {reward.type === 'earned' ? (
                                <Recycle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Gift className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{reward.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(reward.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <Badge className={reward.type === 'earned' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}>
                            {reward.type === 'earned' ? '+' : ''}{reward.points} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No reward history yet</p>
                      <p className="text-sm text-gray-400">Start recycling to earn points!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Recycle</p>
                        <p className="text-sm text-gray-500">Take your waste to a recycling center</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Record</p>
                        <p className="text-sm text-gray-500">Log your recycling activity</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Earn</p>
                        <p className="text-sm text-gray-500">Get 10 points per kg recycled</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-bold text-sm">4</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Redeem</p>
                        <p className="text-sm text-gray-500">Exchange points for rewards</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Points Value */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
                <CardContent className="p-6">
                  <Star className="w-8 h-8 mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Points Value</h3>
                  <p className="text-purple-100 text-sm mb-4">
                    Every kilogram of recycled waste earns you 10 points. 
                    The more you recycle, the more rewards you unlock!
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-100">1 kg Plastic</span>
                      <span className="font-semibold">10 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-100">1 kg Paper</span>
                      <span className="font-semibold">10 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-100">1 kg Glass</span>
                      <span className="font-semibold">10 pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-100">1 kg Metal</span>
                      <span className="font-semibold">10 pts</span>
                    </div>
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
