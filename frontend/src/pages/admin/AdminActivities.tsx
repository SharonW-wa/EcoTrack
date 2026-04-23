import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Activity } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.102:5000/api';
const getToken = () => localStorage.getItem('token');

export default function AdminActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/admin/activities`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(r => r.json())
      .then(data => {
        setActivities(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Activities</h1>
          <p className="text-gray-400 text-sm mt-1">{activities.length} recycling activities recorded</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium px-5 py-3">User</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Waste Type</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Quantity</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Points</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Center</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-8">Loading...</td>
                  </tr>
                )}
                {!loading && activities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-8">No activities yet</td>
                  </tr>
                )}
                {activities.map((a, i) => (
                  <tr
                    key={a.id || i}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-5 py-3 text-gray-200">{a.fullName || 'Unknown'}</td>
                    <td className="px-5 py-3">
                      <span className="bg-green-950 text-green-400 text-xs px-2 py-0.5 rounded-full capitalize">
                        {a.wasteType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-300">{a.quantity}kg</td>
                    <td className="px-5 py-3 text-green-400 font-semibold">+{a.pointsEarned}</td>
                    <td className="px-5 py-3 text-gray-400">{a.centerId}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {new Date(a.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}