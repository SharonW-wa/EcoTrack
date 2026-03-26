import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building2, Plus, Pencil, Trash2, X, MapPin,
  Phone, Mail, Clock, ShieldCheck, Leaf
} from 'lucide-react';

interface Center {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  acceptedWaste: string[];
  operatingHours: string;
}

const emptyForm = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  phone: '',
  email: '',
  acceptedWaste: [] as string[],
  operatingHours: '',
};

const WASTE_TYPES = ['plastic', 'paper', 'metal', 'glass', 'organic'];

const WASTE_COLORS: Record<string, string> = {
  plastic: 'bg-red-100 text-red-600',
  paper:   'bg-teal-100 text-teal-600',
  glass:   'bg-green-100 text-green-600',
  metal:   'bg-yellow-100 text-yellow-600',
  organic: 'bg-emerald-100 text-emerald-600',
};

export default function AdminCenters() {
  const [centers, setCenters]       = useState<Center[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<Center | null>(null);
  const [form, setForm]             = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const API_URL = 'https://eco-track-iota-nine.vercel.app/api';
  const token   = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  const user    = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') navigate('/login');
  }, []);

  useEffect(() => { fetchCenters(); }, []);

  const fetchCenters = async () => {
    try {
      const res = await fetch(`${API_URL}/recycling-centers`);
      if (!res.ok) throw new Error();
      setCenters(await res.json());
    } catch {
      showToast('Failed to load centers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text: string, type: 'success' | 'error') => {
    setToast({ text, type });
    setTimeout(() => setToast({ text: '', type: '' }), 3500);
  };

  const toggleWaste = (w: string) =>
    setForm(prev => ({
      ...prev,
      acceptedWaste: prev.acceptedWaste.includes(w)
        ? prev.acceptedWaste.filter(x => x !== w)
        : [...prev.acceptedWaste, w],
    }));

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c: Center) => {
    setEditing(c);
    setForm({
      name: c.name, address: c.address,
      latitude: String(c.latitude), longitude: String(c.longitude),
      phone: c.phone, email: c.email,
      acceptedWaste: c.acceptedWaste, operatingHours: c.operatingHours,
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.address || !form.phone) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
    };
    const url    = editing ? `${API_URL}/admin/centers/${editing.id}` : `${API_URL}/admin/centers`;
    const method = editing ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast(editing ? 'Center updated!' : 'Center added!', 'success');
      setShowForm(false);
      fetchCenters();
    } catch {
      showToast('Something went wrong. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/centers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      showToast('Center deleted!', 'success');
      fetchCenters();
    } catch {
      showToast('Failed to delete center.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-green-50">

      {/* Toast notification */}
      {toast.text && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.text}
        </motion.div>
      )}

      {/* Hero header — matches your app's hero style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-3">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Admin Panel
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold">Manage Recycling Centers</h1>
              <p className="text-green-100 mt-1 text-sm">
                Logged in as <span className="text-white font-semibold">{user?.fullName}</span>
              </p>
            </motion.div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold"
              >
                ← Back to App
              </Button>
              <Button
                onClick={openAdd}
                className="bg-white text-green-600 hover:bg-green-50 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Center
              </Button>
            </div>
          </div>
        </div>
        {/* Wave divider — same as Home.tsx */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32C840 35 960 40 1080 42C1200 45 1320 45 1380 45L1440 45V60H0Z" fill="#f0fdf4"/>
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats — matches your dashboard stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Centers',      value: centers.length, icon: Building2, color: 'text-green-600' },
            { label: 'Waste Types Covered', value: [...new Set(centers.flatMap(c => c.acceptedWaste))].length, icon: Leaf, color: 'text-teal-600' },
            { label: 'Cities Covered',     value: [...new Set(centers.map(c => c.address.split(',').pop()?.trim()))].length, icon: MapPin, color: 'text-blue-600' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{loading ? '—' : stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Centers grid */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">All Centers</h2>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : centers.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center text-gray-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              No recycling centers yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {centers.map((center, i) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{center.name}</h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            {center.address}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            {center.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            {center.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            {center.operatingHours}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {center.acceptedWaste.map(w => (
                            <span
                              key={w}
                              className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${WASTE_COLORS[w] || 'bg-gray-100 text-gray-600'}`}
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(center)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(center.id, center.name)}
                          className="border-red-200 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editing ? 'Edit Center' : 'Add New Center'}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editing ? 'Update the center details below' : 'Fill in the details for the new center'}
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Center Name *', key: 'name', placeholder: 'e.g. Nairobi Recycling Center', type: 'text' },
                { label: 'Address *',     key: 'address', placeholder: 'e.g. Industrial Area, Nairobi', type: 'text' },
                { label: 'Phone *',       key: 'phone', placeholder: '+254 712 345 678', type: 'text' },
                { label: 'Email',         key: 'email', placeholder: 'center@recycle.co.ke', type: 'email' },
                { label: 'Operating Hours', key: 'operatingHours', placeholder: 'Mon-Sat: 8AM - 5PM', type: 'text' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                {['latitude', 'longitude'].map(coord => (
                  <div key={coord}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{coord}</label>
                    <input
                      type="number"
                      value={(form as any)[coord]}
                      onChange={e => setForm({ ...form, [coord]: e.target.value })}
                      placeholder={coord === 'latitude' ? '-1.2921' : '36.8219'}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Waste Types</label>
                <div className="flex flex-wrap gap-2">
                  {WASTE_TYPES.map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => toggleWaste(w)}
                      className={`px-3 py-1.5 rounded-full text-sm capitalize font-medium border transition ${
                        form.acceptedWaste.includes(w)
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-green-400'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Center'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}