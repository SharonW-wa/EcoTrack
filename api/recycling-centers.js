const fs = require('fs');
const path = require('path');

const defaultCenters = [
  {
    id: 'rc1',
    name: 'Nairobi Recycling Center',
    address: 'Industrial Area, Nairobi',
    latitude: -1.2921,
    longitude: 36.8219,
    phone: '+254 712 345 678',
    email: 'nairobi@recycle.co.ke',
    acceptedWaste: ['plastic', 'paper', 'metal', 'glass'],
    operatingHours: 'Mon-Sat: 8AM - 5PM'
  },
  {
    id: 'rc2',
    name: 'Mombasa Eco-Recycle',
    address: 'Mikindani, Mombasa',
    latitude: -4.0435,
    longitude: 39.6682,
    phone: '+254 723 456 789',
    email: 'mombasa@recycle.co.ke',
    acceptedWaste: ['plastic', 'glass', 'organic'],
    operatingHours: 'Mon-Fri: 7AM - 6PM'
  },
  {
    id: 'rc3',
    name: 'Kisumu Green Waste',
    address: 'Kisumu Industrial Estate',
    latitude: -0.1022,
    longitude: 34.7617,
    phone: '+254 734 567 890',
    email: 'kisumu@recycle.co.ke',
    acceptedWaste: ['paper', 'metal', 'plastic'],
    operatingHours: 'Mon-Sat: 8AM - 4PM'
  },
  {
    id: 'rc4',
    name: 'Nakuru Recycling Hub',
    address: 'Nakuru Town, Near Lake Nakuru',
    latitude: -0.3031,
    longitude: 36.0800,
    phone: '+254 745 678 901',
    email: 'nakuru@recycle.co.ke',
    acceptedWaste: ['plastic', 'paper', 'glass', 'metal', 'organic'],
    operatingHours: 'Mon-Sun: 7AM - 7PM'
  },
  {
    id: 'rc5',
    name: 'Eldoret Waste Solutions',
    address: 'Eldoret Industrial Area',
    latitude: 0.5143,
    longitude: 35.2698,
    phone: '+254 756 789 012',
    email: 'eldoret@recycle.co.ke',
    acceptedWaste: ['plastic', 'paper', 'metal'],
    operatingHours: 'Mon-Sat: 8AM - 5PM'
  }
];

function readDB(file) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return defaultCenters;
  }
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const centers = readDB(path.join(process.cwd(), 'data', 'recycling-centers.json'));
      res.status(200).json(centers);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}