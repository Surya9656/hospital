import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'healthnexus-secret-key-2024';
const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  const app = express();

  app.use(express.json());

  // Test PostgreSQL connection when server starts
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL database connected successfully');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    process.exit(1);
  }

  // JWT authentication middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = user;
      next();
    });
  };

  // ============================================
  // AUTH - SIGNUP
  // ============================================
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { name, email, password, role = 'patient' } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: 'Name, email and password are required',
        });
      }

      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          message: 'Email already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = Date.now().toString();

      const result = await pool.query(
        `INSERT INTO users
          (id, name, email, password, role)
         VALUES
          ($1, $2, $3, $4, $5)
         RETURNING id, name, email, role`,
        [userId, name, email, hashedPassword, role]
      );

      const newUser = result.rows[0];

      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: newUser,
      });
    } catch (error) {
      console.error('Signup error:', error);

      res.status(500).json({
        message: 'Signup failed',
      });
    }
  });

  // ============================================
  // AUTH - LOGIN
  // ============================================
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required',
        });
      }

      const result = await pool.query(
        `SELECT id, name, email, password, role
         FROM users
         WHERE email = $1`,
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }

      const passwordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordValid) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);

      res.status(500).json({
        message: 'Login failed',
      });
    }
  });

  // ============================================
  // GET ALL DOCTORS
  // ============================================
  app.get('/api/doctors', async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          id,
          name,
          specialty,
          rating,
          image,
          experience,
          fee
         FROM doctors
         ORDER BY id`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Get doctors error:', error);

      res.status(500).json({
        message: 'Failed to fetch doctors',
      });
    }
  });

  // ============================================
  // GET ALL MEDICINES
  // ============================================
  app.get('/api/medicines', async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          id,
          name,
          price,
          category,
          stock,
          image
         FROM medicines
         ORDER BY id`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Get medicines error:', error);

      res.status(500).json({
        message: 'Failed to fetch medicines',
      });
    }
  });

  // ============================================
  // CREATE APPOINTMENT
  // ============================================
  app.post(
    '/api/appointments',
    authenticateToken,
    async (req: any, res) => {
      try {
        const { doctorId, date, time } = req.body;
        const userId = req.user.id;

        if (!doctorId || !date || !time) {
          return res.status(400).json({
            message: 'Doctor, date and time are required',
          });
        }

        // Check doctor exists
        const doctorResult = await pool.query(
          'SELECT * FROM doctors WHERE id = $1',
          [doctorId]
        );

        if (doctorResult.rows.length === 0) {
          return res.status(404).json({
            message: 'Doctor not found',
          });
        }

        const appointmentId = Date.now().toString();

        const result = await pool.query(
          `INSERT INTO appointments
            (id, user_id, doctor_id, appointment_date, appointment_time, status)
           VALUES
            ($1, $2, $3, $4, $5, $6)
           RETURNING
            id,
            user_id AS "userId",
            doctor_id AS "doctorId",
            appointment_date AS date,
            appointment_time AS time,
            status`,
          [
            appointmentId,
            userId,
            doctorId,
            date,
            time,
            'scheduled',
          ]
        );

        const appointment = result.rows[0];

        res.json(appointment);
      } catch (error) {
        console.error('Create appointment error:', error);

        res.status(500).json({
          message: 'Failed to create appointment',
        });
      }
    }
  );

  // ============================================
  // GET USER APPOINTMENTS
  // ============================================
  app.get(
    '/api/user/appointments',
    authenticateToken,
    async (req: any, res) => {
      try {
        const userId = req.user.id;

        const result = await pool.query(
          `SELECT
            a.id,
            a.user_id AS "userId",
            a.doctor_id AS "doctorId",
            a.appointment_date AS date,
            a.appointment_time AS time,
            a.status,
            json_build_object(
              'id', d.id,
              'name', d.name,
              'specialty', d.specialty,
              'rating', d.rating,
              'image', d.image,
              'experience', d.experience,
              'fee', d.fee
            ) AS doctor
           FROM appointments a
           JOIN doctors d
             ON a.doctor_id = d.id
           WHERE a.user_id = $1
           ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
          [userId]
        );

        res.json(result.rows);
      } catch (error) {
        console.error('Get appointments error:', error);

        res.status(500).json({
          message: 'Failed to fetch appointments',
        });
      }
    }
  );

  // ============================================
  // CREATE ORDER
  // ============================================
  app.post(
    '/api/orders',
    authenticateToken,
    async (req: any, res) => {
      const client = await pool.connect();

      try {
        const { items, total } = req.body;
        const userId = req.user.id;

        if (!items || !Array.isArray(items) || items.length === 0) {
          return res.status(400).json({
            message: 'Order items are required',
          });
        }

        if (total === undefined || total === null) {
          return res.status(400).json({
            message: 'Order total is required',
          });
        }

        await client.query('BEGIN');

        const orderId = Date.now().toString();

        // Create order
        await client.query(
          `INSERT INTO orders
            (id, user_id, total, status)
           VALUES
            ($1, $2, $3, $4)`,
          [
            orderId,
            userId,
            total,
            'processing',
          ]
        );

        // Create order items
        for (const item of items) {
          await client.query(
            `INSERT INTO order_items
              (order_id, medicine_id, quantity, price)
             VALUES
              ($1, $2, $3, $4)`,
            [
              orderId,
              item.id,
              item.quantity || 1,
              item.price,
            ]
          );
        }

        await client.query('COMMIT');

        // Return created order with items
        const orderResult = await pool.query(
          `SELECT
            id,
            user_id AS "userId",
            total,
            order_date AS date,
            status
           FROM orders
           WHERE id = $1`,
          [orderId]
        );

        const itemsResult = await pool.query(
          `SELECT
            oi.medicine_id AS id,
            m.name,
            oi.price,
            m.category,
            m.stock,
            m.image,
            oi.quantity
           FROM order_items oi
           JOIN medicines m
             ON oi.medicine_id = m.id
           WHERE oi.order_id = $1`,
          [orderId]
        );

        const order = {
          ...orderResult.rows[0],
          items: itemsResult.rows,
        };

        res.json(order);
      } catch (error) {
        await client.query('ROLLBACK');

        console.error('Create order error:', error);

        res.status(500).json({
          message: 'Failed to create order',
        });
      } finally {
        client.release();
      }
    }
  );

  // ============================================
  // GET USER ORDERS
  // ============================================
  app.get(
    '/api/user/orders',
    authenticateToken,
    async (req: any, res) => {
      try {
        const userId = req.user.id;

        const ordersResult = await pool.query(
          `SELECT
            id,
            user_id AS "userId",
            total,
            order_date AS date,
            status
           FROM orders
           WHERE user_id = $1
           ORDER BY order_date DESC`,
          [userId]
        );

        const orders = [];

        for (const order of ordersResult.rows) {
          const itemsResult = await pool.query(
            `SELECT
              oi.medicine_id AS id,
              m.name,
              oi.price,
              m.category,
              m.stock,
              m.image,
              oi.quantity
             FROM order_items oi
             JOIN medicines m
               ON oi.medicine_id = m.id
             WHERE oi.order_id = $1`,
            [order.id]
          );

          orders.push({
            ...order,
            items: itemsResult.rows,
          });
        }

        res.json(orders);
      } catch (error) {
        console.error('Get orders error:', error);

        res.status(500).json({
          message: 'Failed to fetch orders',
        });
      }
    }
  );

  // ============================================
  // HEALTH CHECK
  // ============================================
  app.get('/api/health', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT NOW() AS database_time'
      );

      res.json({
        status: 'ok',
        database: 'PostgreSQL',
        databaseTime: result.rows[0].database_time,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        database: 'PostgreSQL unavailable',
      });
    }
  });

  // ============================================
  // VITE
  // ============================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(
        path.join(distPath, 'index.html')
      );
    });
  }

  // ============================================
  // START SERVER
  // ============================================
  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `🚀 Server running on http://localhost:${PORT}`
    );
    console.log(
      `🗄️ Database: PostgreSQL`
    );
  });
}

startServer().catch((error) => {
  console.error(
    '❌ Failed to start server:',
    error
  );

  process.exit(1);
});