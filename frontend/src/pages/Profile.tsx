import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Edit2,
  Save,
  Award,
  Recycle,
  Calendar,
  MapPin,
  Leaf
} from 'lucide-react';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch fresh user data when component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [refreshUser]);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Update form data when user data changes
  useEffect(() => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
  }, [user]);

  const getLevel = (points: number) => {
    if (points >= 5000) return { name: 'Eco Master', color: 'bg-purple-500' };
    if (points >= 2000) return { name: 'Green Champion', color: 'bg-blue-500' };
    if (points >= 1000) return { name: 'Earth Guardian', color: 'bg-teal-500' };
    if (points >= 500) return { name: 'Eco Warrior', color: 'bg-green-500' };
    if (points >= 250) return { name: 'Nature Lover', color: 'bg-yellow-500' };
    if (points >= 100) return { name: 'Green Starter', color: 'bg-orange-500' };
    return { name: 'Eco Newbie', color: 'bg-gray-400' };
  };

  const handleSave = async () => {
    setLoading(true);
    // In a real app, you would make an API call here
    toast.success('Profile updated successfully!');
    setIsEditing(false);
    setLoading(false);
    await refreshUser();
  };

  const userPoints = user?.rewardPoints || 0;
  const currentLevel = getLevel(userPoints);
  const recyclingCount = user?.recyclingHistory?.length || 0;
  const totalRecycled = user?.recyclingHistory?.reduce((sum, h) => sum + h.quantity, 0) || 0;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account and view your achievements</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1"
          >
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <div className={`absolute -bottom-2 -right-2 w-10 h-10 ${currentLevel.color} rounded-full flex items-center justify-center border-4 border-white`}>
                    <Award className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
                <p className="text-gray-500 text-sm">{user?.email}</p>

                <Badge className={`mt-3 ${currentLevel.color} text-white`}>
                  {currentLevel.name}
                </Badge>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{recyclingCount}</p>
                      <p className="text-xs text-gray-500">Activities</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{totalRecycled.toFixed(1)}kg</p>
                      <p className="text-xs text-gray-500">Recycled</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Member since {memberSince}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            fullName: user?.fullName || '',
                            email: user?.email || '',
                            phone: user?.phone || ''
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">  
                    <Leaf className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{userPoints}</p>
                  <p className="text-xs text-gray-500">Total Points</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">   
                    <Recycle className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{recyclingCount}</p>
                  <p className="text-xs text-gray-500">Recycling Activities</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2"> 
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(user?.recyclingHistory?.map(h => h.centerId)).size || 0}
                  </p>
                  <p className="text-xs text-gray-500">Centers Visited</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Recycle className="w-5 h-5 mr-2 text-green-600" />
                Recent Recycling Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user?.recyclingHistory && user.recyclingHistory.length > 0 ? (
                <div className="space-y-3">
                  {user.recyclingHistory.slice().reverse().slice(0, 5).map((activity) => (
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
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
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
                  <p className="text-sm text-gray-400">Start recycling to see your activity here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}