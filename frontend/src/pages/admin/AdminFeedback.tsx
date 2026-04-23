import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.102:5000/api';
const getToken = () => localStorage.getItem('token');

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/feedback`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(r => r.json())
      .then(data => {
        setFeedback(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Feedback</h1>
          <p className="text-gray-400 text-sm mt-1">{feedback.length} submissions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {loading && (
            <p className="text-gray-500">Loading...</p>
          )}
          {!loading && feedback.length === 0 && (
            <p className="text-gray-500">No feedback yet</p>
          )}
          {feedback.map((f, i) => (
            <div
              key={f.id || i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-medium text-sm">{f.userName || 'Anonymous'}</p>
                  <span className="bg-blue-950 text-blue-400 text-xs px-2 py-0.5 rounded-full capitalize">
                    {f.type}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`w-3 h-3 ${
                        j < f.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{f.message}</p>
              <p className="text-gray-600 text-xs mt-3">
                {new Date(f.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}