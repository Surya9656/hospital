import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'healthnexus-secret-key-2024';
const PORT = 3000;

// Data persistence setup
const DB_PATH = path.join(__dirname, 'db.json');

const loadDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [],
      doctors: [
        { id: '1', name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', rating: 4.9, image: 'https://images.unsplash.com/photo-1559839734-2b71f153678e?auto=format&fit=crop&q=80&w=200', experience: '12 years', fee: 1000 },
        { id: '2', name: 'Dr. James Miller', specialty: 'Neurologist', rating: 4.8, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200', experience: '15 years', fee: 1200 },
        { id: '3', name: 'Dr. Emily Chen', specialty: 'Pediatrician', rating: 4.9, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200', experience: '8 years', fee: 800 },
        { id: '4', name: 'Dr. Michael Brown', specialty: 'Orthopedic', rating: 4.7, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', experience: '10 years', fee: 1100 },
        { id: '5', name: 'Dr. Anita Desai', specialty: 'Dermatologist', rating: 4.8, image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=200', experience: '7 years', fee: 900 },
        { id: '6', name: 'Dr. Robert Fox', specialty: 'General Physician', rating: 4.6, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200', experience: '20 years', fee: 600 },
      ],
      medicines: [
        { id: '1', name: 'Paracetamol 500mg', price: 45, category: 'Pain Relief', stock: 100, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200' },
        { id: '2', name: 'Amoxicillin 250mg', price: 120, category: 'Antibiotics', stock: 50, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=200' },
        { id: '3', name: 'Vitamin C 1000mg', price: 299, category: 'Supplements', stock: 200, image: 'https://images.unsplash.com/photo-1616671285410-096739bc4672?auto=format&fit=crop&q=80&w=200' },
        { id: '4', name: 'Ibuprofen 400mg', price: 65, category: 'Pain Relief', stock: 80, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200' },
        { id: '5', name: 'Insulin Glargine', price: 1500, category: 'Diabetes', stock: 30, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=200' },
      ],
      appointments: [],
      orders: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
};

const saveDB = (data: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // Middleware to verify JWT
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password, role = 'patient' } = req.body;
    const db = loadDB();

    if (db.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), name, email, password: hashedPassword, role };
    db.users.push(newUser);
    saveDB(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET);
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const db = loadDB();
    const user = db.users.find((u: any) => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.get('/api/doctors', (req, res) => {
    const db = loadDB();
    res.json(db.doctors);
  });

  app.get('/api/medicines', (req, res) => {
    const db = loadDB();
    res.json(db.medicines);
  });

  app.post('/api/appointments', authenticateToken, (req: any, res) => {
    const { doctorId, date, time } = req.body;
    const db = loadDB();
    const newAppointment = {
      id: Date.now().toString(),
      userId: req.user.id,
      doctorId,
      date,
      time,
      status: 'scheduled'
    };
    db.appointments.push(newAppointment);
    saveDB(db);
    res.json(newAppointment);
  });

  app.get('/api/user/appointments', authenticateToken, (req: any, res) => {
    const db = loadDB();
    const userAppointments = db.appointments
      .filter((a: any) => a.userId === req.user.id)
      .map((a: any) => ({
        ...a,
        doctor: db.doctors.find((d: any) => d.id === a.doctorId)
      }));
    res.json(userAppointments);
  });

  app.post('/api/orders', authenticateToken, (req: any, res) => {
    const { items, total } = req.body;
    const db = loadDB();
    const newOrder = {
      id: Date.now().toString(),
      userId: req.user.id,
      items,
      total,
      date: new Date().toISOString(),
      status: 'processing'
    };
    db.orders.push(newOrder);
    saveDB(db);
    res.json(newOrder);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
