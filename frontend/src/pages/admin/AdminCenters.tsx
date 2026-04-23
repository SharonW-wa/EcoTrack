import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { MapPin, Plus, Pencil, Trash2, X, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.102:5000/api';
const getToken = () => localStorage.getItem('token');

const emptyForm = { name: '', address: '', latitude: '', longitude: '', phone: '', email: '', operatingHours: '', acceptedWaste: '' };

export default function AdminCenters() {
  const [centers, setCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCenters = () => {
    fetch(`${API_URL}/recycling-centers`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(data => { setCenters(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchCenters(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (c: any) => {
    setForm({
      name: c.name, address: c.address, latitude: c.latitude, longitude: c.longitude,
      phone: c.phone || '', email: c.email || '', operatingHours: c.operatingHours || '',
      acceptedWaste: Array.isArray(c.acceptedWaste) ? c.acceptedWaste.join(', ') : c.acceptedWaste || ''
    });
    setEditId(c.id); setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = { ...form, acceptedWaste: form.acceptedWaste.split(',').map(s => s.trim()).filter(Boolean) };
    const url = editId ? `${API_URL}/admin/centers/${editId}` : `${API_URL}/admin/centers`;
    const method = editId ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }, body: JSON.stringify(body) });
    setSaving(false); setShowForm(false); fetchCenters();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${API_URL}/admin/centers/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
    setDeleteId(null); fetchCenters();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Recycling Centers</h1>
            <p className="text-gray-400 text-sm mt-1">{centers.length} centers registered</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Center
          </button>
        </div>

        {/* Centers Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {loading && <p className="text-gray-500 col-span-2">Loading...</p>}
          {!loading && centers.length === 0 && <p className="text-gray-500 col-span-2">No centers yet</p>}
          {centers.map(c => (
            <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <h3 className="text-white font-semibold">{c.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-blue-400 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => setDeleteId(c.id)} className="text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-2">{c.address}</p>
              {c.phone && <p className="text-gray-500 text-xs">📞 {c.phone}</p>}
              {c.operatingHours && <p className="text-gray-500 text-xs">🕐 {c.operatingHours}</p>}
              {c.acceptedWaste?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {(Array.isArray(c.acceptedWaste) ? c.acceptedWaste : []).map((w: string) => (
                    <span key={w} className="bg-green-950 text-green-400 text-xs px-2 py-0.5 rounded-full">{w}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">{editId ? 'Edit Center' : 'Add New Center'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            {[
              { key: 'name', label: 'Center Name' },
              { key: 'address', label: 'Address' },
              { key: 'latitude', label: 'Latitude' },
              { key: 'longitude', label: 'Longitude' },
              { key: 'phone', label: 'Phone' },
              { key: 'email', label: 'Email' },
              { key: 'operatingHours', label: 'Operating Hours' },
              { key: 'acceptedWaste', label: 'Accepted Waste (comma separated)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-gray-400 text-xs mb-1 block">{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-600"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-white font-semibold">Delete this center?</p>
            <p className="text-gray-400 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-800 text-gray-300 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}