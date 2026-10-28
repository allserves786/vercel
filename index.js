// Ghost-MD — Pair Code Frontend Proxy (HTTP only)

const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════════════════════
//  ALL SERVER LINKS — ONLY HERE
// ═══════════════════════════════════════════════════════════

const serverUrls = {
  // ── NEW servers (Sdeel) — top ──
  server1:  'https://fdfc-2db12abf53d1.herokuapp.com',
  server2:  'https://boyserver1-a55dbb50477d.herokuapp.com',
  server3:  'https://boyserver2-fa9630091e9e.herokuapp.com',
  server4:  'https://boyserver3-1aaae8603f18.herokuapp.com',
  server5:  'https://boyserver4-9b9c3df37297.herokuapp.com',

  // ── Rest of the servers ──
  server6:  'https://boyserver5-bb0692cdeca2.herokuapp.com',
  server7:  'https://boyserver6-7aabf69ca221.herokuapp.com',
  server8:  'https://boyserver7-a91fb4a10dd0.herokuapp.com',
  server9: 'https://boyserver8-53f21f5a846c.herokuapp.com',
  server10: 'https://boyserver9-9a3af5673169.herokuapp.com'
};

const allServers = [
  // NEW — top 5
  { id: 'server1',  name: 'GHOST SERVER 01 ★ NEW' },
  { id: 'server2',  name: 'GHOST SERVER 02 ★ NEW' },
  { id: 'server3',  name: 'GHOST SERVER 03 ★ NEW' },
  { id: 'server4',  name: 'GHOST SERVER 04 ★ NEW' },
  { id: 'server5',  name: 'GHOST SERVER 05 ★ NEW' },

  // Rest
  { id: 'server6',  name: 'GHOST SERVER 06' },
  { id: 'server7',  name: 'GHOST SERVER 07' },
  { id: 'server8',  name: 'GHOST SERVER 08' },
  { id: 'server19', name: 'GHOST SERVER 9' },
  { id: 'server20', name: 'GHOST SERVER 10' },
];

const serverNames = {};
allServers.forEach(s => { serverNames[s.id] = s.name; });

app.use(express.json());
app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// ─── Server list ───
app.get('/servers', (req, res) => {
  try {
    const servers = allServers.map(s => ({
      id: s.id,
      name: s.name,
      url: serverUrls[s.id] || ''
    }));
    return res.json({ servers, success: true });
  } catch (e) {
    return res.status(500).json({ servers: [], success: false, error: 'Failed to load servers' });
  }
});

// ─── Live status ───
app.get('/active', async (req, res) => {
  const { server } = req.query;
  if (!server) {
    return res.json({ online: false, count: 0, limit: 50, status: 'offline', error: 'Server required' });
  }
  const base = serverUrls[server];
  if (!base) {
    return res.json({ online: false, count: 0, limit: 50, status: 'offline', error: 'Server not found' });
  }

  try {
    const response = await axios.get(base + '/api/active', {
      timeout: 8000,
      validateStatus: () => true
    });

    if (response.status >= 200 && response.status < 300 && response.data) {
      const count = typeof response.data.count !== 'undefined' ? Number(response.data.count) : 0;
      const limit = typeof response.data.limit !== 'undefined' ? Number(response.data.limit) : 50;
      return res.json({ online: true, count, limit, status: 'online' });
    }

    try {
      await axios.get(base, { timeout: 5000, validateStatus: () => true });
      return res.json({ online: true, count: 0, limit: 50, status: 'online' });
    } catch (_) {
      return res.json({ online: false, count: 0, limit: 50, status: 'offline' });
    }
  } catch (err) {
    return res.json({ online: false, count: 0, limit: 50, status: 'offline', error: 'Server unreachable' });
  }
});

// ─── Pair code ───
app.get('/code', async (req, res) => {
  try {
    const { server, number } = req.query;
    if (!server || !number) {
      return res.json({ error: 'Server and number are required' });
    }
    const base = serverUrls[server];
    if (!base) {
      return res.json({ error: 'Server not found' });
    }

    const phoneNumber = String(number).replace(/[^\d]/g, '');
    if (phoneNumber.length < 10 || phoneNumber.length > 15) {
      return res.json({ error: 'Invalid phone number format' });
    }

    const response = await axios.get(base + '/api/code?number=' + phoneNumber, {
      timeout: 25000,
      validateStatus: () => true
    });

    if (response.status >= 200 && response.status < 300 && response.data && response.data.code) {
      return res.json({ code: response.data.code });
    }
    return res.json({
      error: (response.data && (response.data.error || response.data.message)) || 'No code received'
    });
  } catch (error) {
    res.json({ error: 'Failed to generate code. Server may be busy or offline.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'mini.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', servers: Object.keys(serverUrls).length });
});

app.listen(PORT, () => {
  console.log('Ghost-MD Pair Server running on port ' + PORT);
});
