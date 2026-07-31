import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from './db.js';

const dbJsonPath = path.join(process.cwd(), 'db.json');

async function migrate() {
  const data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('Starting migration...');

    // 1. Users
    for (const user of data.users) {
      await client.query(
        `
        INSERT INTO users (id, name, email, password, role)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING
        `,
        [
          user.id,
          user.name,
          user.email,
          user.password,
          user.role,
        ]
      );
    }

    console.log(`✅ Users migrated: ${data.users.length}`);

    // 2. Doctors
    for (const doctor of data.doctors) {
      await client.query(
        `
        INSERT INTO doctors
        (id, name, specialty, rating, image, experience, fee)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING
        `,
        [
          doctor.id,
          doctor.name,
          doctor.specialty,
          doctor.rating,
          doctor.image,
          doctor.experience,
          doctor.fee,
        ]
      );
    }

    console.log(`✅ Doctors migrated: ${data.doctors.length}`);

    // 3. Medicines
    for (const medicine of data.medicines) {
      await client.query(
        `
        INSERT INTO medicines
        (id, name, price, category, stock, image)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
        `,
        [
          medicine.id,
          medicine.name,
          medicine.price,
          medicine.category,
          medicine.stock,
          medicine.image,
        ]
      );
    }

    console.log(`✅ Medicines migrated: ${data.medicines.length}`);

    // 4. Appointments
    for (const appointment of data.appointments) {
      await client.query(
        `
        INSERT INTO appointments
        (id, user_id, doctor_id, appointment_date, appointment_time, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
        `,
        [
          appointment.id,
          appointment.userId,
          appointment.doctorId,
          appointment.date,
          appointment.time,
          appointment.status,
        ]
      );
    }

    console.log(`✅ Appointments migrated: ${data.appointments.length}`);

    // 5. Orders
    for (const order of data.orders) {
      await client.query(
        `
        INSERT INTO orders
        (id, user_id, total, order_date, status)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO NOTHING
        `,
        [
          order.id,
          order.userId,
          order.total,
          order.date,
          order.status,
        ]
      );

      // 6. Order Items
      for (const item of order.items) {
        await client.query(
          `
          INSERT INTO order_items
          (order_id, medicine_id, quantity, price)
          VALUES ($1, $2, $3, $4)
          `,
          [
            order.id,
            item.id,
            item.quantity,
            item.price,
          ]
        );
      }
    }

    console.log(`✅ Orders migrated: ${data.orders.length}`);

    await client.query('COMMIT');

    console.log('');
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');

    console.error('❌ Migration failed');
    console.error(error);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();