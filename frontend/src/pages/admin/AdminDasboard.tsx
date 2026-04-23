import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Users, Recycle, MapPin, MessageSquare, TrendingUp, Award } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.102:5000/api';
const getToken = () => localStorage.getItem('token');

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [topRecyclers, setTopRecyclers] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      };
      try {
        const [statsRes, leaderRes, activitiesRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`, { headers }),
          fetch(`${API_URL}/leaderboard`, { headers }),
          fetch(`${API_URL}/admin/activities?limit=5`, { headers }),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (leaderRes.ok) setTopRecyclers(await leaderRes.json());
        if (activitiesRes.ok) setRecentActivities(await activitiesRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users, color: 'text-blue-400', bg: 'bg-blue-950/40', border: 'border-blue-900/50' },
    { label: 'Total Activities', value: stats?.totalActivities ?? '—', icon: Recycle, color: 'text-green-400', bg: 'bg-green-950/40', border: 'border-green-900/50' },
    { label: 'Waste Recycled', value: stats?.totalWasteRecycled ? `${parseFloat(stats.totalWasteRecycled).toFixed(1)}kg` : '—', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-900/50' },
    { label: 'Recycling Centers', value: stats?.totalCenters ?? '—', icon: MapPin, color: 'text-purple-400', bg: 'bg-purple-950/40', border: 'border-purple-900/50' },
    { label: 'Feedback Submitted', value: stats?.totalFeedback ?? '—', icon: MessageSquare, color: 'text-yellow-400', bg: 'bg-yellow-950/40', border: 'border-yellow-900/50' },
    { label: 'Points Awarded', value: stats?.totalPoints ?? '—', icon: Award, color: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-900/50' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back. Here's what's happening on EcoTrack.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-xs font-medium">{label}</p>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{loading ? '...' : value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Recyclers */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-green-500" /> Top Recyclers
            </h2>
            <div className="space-y-3">
              {topRecyclers.length === 0 && <p className="text-gray-500 text-sm">No data yet</p>}
              {topRecyclers.map((u, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-yellow-500 text-black' :
                      i === 1 ? 'bg-gray-400 text-black' :
                      i === 2 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'
                    }`}>{i + 1}</span>
                    <span className="text-gray-200 text-sm">{u.fullName}</span>
                  </div>
                  <span className="text-green-400 text-sm font-semibold">{u.rewardPoints} pts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Recycle className="w-4 h-4 text-green-500" /> Recent Activities
            </h2>
            <div className="space-y-3">
              {recentActivities.length === 0 && <p className="text-gray-500 text-sm">No activities yet</p>}
              {recentActivities.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div>
                    <p className="text-gray-200 text-sm">{a.wasteType} — {a.quantity}kg</p>
                    <p className="text-gray-500 text-xs">{a.fullName || 'User'} · {new Date(a.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">+{a.pointsEarned} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
