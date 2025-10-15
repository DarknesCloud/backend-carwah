require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const VehicleType = require('../models/VehicleType');
const ServiceType = require('../models/ServiceType');
const Employee = require('../models/Employee');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await VehicleType.deleteMany({});
    await ServiceType.deleteMany({});
    await Employee.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'aldairleiva42@gmail.com';
    const adminPass = process.env.ADMIN_PASS || 'ciscoE.23';

    await User.create({
      email: adminEmail,
      passwordHash: adminPass,
      role: 'admin'
    });
    console.log(`Admin user created: ${adminEmail}`);

    // Create vehicle types
    console.log('Creating vehicle types...');
    const vehicleTypes = await VehicleType.insertMany([
      {
        name: 'Sedán',
        description: 'Vehículo de pasajeros de 4 puertas'
      },
      {
        name: 'SUV',
        description: 'Vehículo utilitario deportivo'
      },
      {
        name: 'Camioneta',
        description: 'Vehículo de carga liviana'
      },
      {
        name: 'Motocicleta',
        description: 'Vehículo de dos ruedas'
      },
      {
        name: 'Van',
        description: 'Vehículo de pasajeros grande'
      }
    ]);
    console.log(`${vehicleTypes.length} vehicle types created`);

    // Create service types
    console.log('Creating service types...');
    const serviceTypes = await ServiceType.insertMany([
      {
        name: 'Lavado Básico',
        description: 'Lavado exterior con agua y jabón',
        price: 50
      },
      {
        name: 'Lavado Premium',
        description: 'Lavado exterior e interior completo',
        price: 100
      },
      {
        name: 'Lavado Completo',
        description: 'Lavado, encerado y aspirado',
        price: 150
      },
      {
        name: 'Detallado',
        description: 'Limpieza profunda interior y exterior',
        price: 250
      },
      {
        name: 'Encerado',
        description: 'Aplicación de cera protectora',
        price: 80
      }
    ]);
    console.log(`${serviceTypes.length} service types created`);

    // Create employees
    console.log('Creating employees...');
    const employees = await Employee.insertMany([
      {
        name: 'Juan Pérez',
        email: 'juan.perez@carwash.com',
        phone: '555-0101',
        active: true
      },
      {
        name: 'María González',
        email: 'maria.gonzalez@carwash.com',
        phone: '555-0102',
        active: true
      },
      {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@carwash.com',
        phone: '555-0103',
        active: true
      },
      {
        name: 'Ana Martínez',
        email: 'ana.martinez@carwash.com',
        phone: '555-0104',
        active: true
      }
    ]);
    console.log(`${employees.length} employees created`);

    console.log('\n✅ Seed data created successfully!');
    console.log(`\nLogin credentials:`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPass}`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();

