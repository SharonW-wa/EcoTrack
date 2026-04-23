import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Users, Search, Shield, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.102:5000/api';
const getToken = () => localStorage.getItem('token');

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getLevel = (pts: number) => {
    if (pts >= 5000) return 'Eco Master';
    if (pts >= 2000) return 'Green Champion';
    if (pts >= 1000) return 'Earth Guardian';
    if (pts >= 500) return 'Eco Warrior';
    if (pts >= 100) return 'Green Starter';
    return 'Eco Newbie';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <p className="text-gray-400 text-sm mt-1">{users.length} registered users</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-gray-200 placeholder-gray-500 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
          />
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium px-5 py-3">User</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Email</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Points</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Level</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Role</th>
                  <th className="text-left text-gray-400 font-medium px-5 py-3">Verified</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="text-center text-gray-500 py-8">Loading...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-gray-500 py-8">No users found</td></tr>
                )}
                {filtered.map((u, i) => (
                  <tr key={u.id} className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-900/50'}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center text-green-200 text-xs font-bold">
                          {u.fullName?.charAt(0) || '?'}
                        </div>
                        <span className="text-gray-200 font-medium">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{u.email}</td>
                    <td className="px-5 py-3 text-green-400 font-semibold">{u.rewardPoints || 0}</td>
                    <td className="px-5 py-3 text-gray-300">{getLevel(u.rewardPoints || 0)}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-purple-950 text-purple-300' : 'bg-gray-800 text-gray-300'
                      }`}>
                        {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block w-2 h-2 rounded-full ${u.isVerified ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-gray-400 text-xs ml-2">{u.isVerified ? 'Verified' : 'Pending'}</span>
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