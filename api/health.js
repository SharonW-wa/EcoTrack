function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  res.status(200).json({ status: 'OK', message: 'Waste Management System API is running' });
}