
import { ObjectKernel } from '@objectstack/core';
import { ObjectQLPlugin } from '@objectstack/objectql';
import { AppPlugin, DriverPlugin } from '@objectstack/runtime';
import { HonoServerPlugin } from '@objectstack/plugin-hono-server';
import { InMemoryDriver } from '@objectstack/driver-memory';
import config from './objectstack.config';
import { pino } from 'pino';
import { ConsolePlugin } from './console-plugin';

async function startServer() {
  const logger = pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  });

  logger.info('Starting CRM Server...');

  try {
    // Initialize Kernel
    const kernel = new ObjectKernel({
      logger,
    });

    // 1. Core Engine (ObjectQL)
    const qlPlugin = new ObjectQLPlugin();
    kernel.use(qlPlugin);

    // 2. Data Driver (Memory)
    const memoryDriver = new InMemoryDriver();
    const driverPlugin = new DriverPlugin(memoryDriver);
    kernel.use(driverPlugin);

    // 3. Application (crm_app from config)
    // The config export from defineStack is treated as an App Bundle or Manifest
    const appPlugin = new AppPlugin(config);
    kernel.use(appPlugin);

    // 4. HTTP Server
    const serverPlugin = new HonoServerPlugin({ port: 3000 });
    kernel.use(serverPlugin);

    // 5. Console Plugin
    const consolePlugin = new ConsolePlugin();
    kernel.use(consolePlugin);

    // Bootstrap
    await kernel.bootstrap();
    
    // Seed Data
    try {
      // Products
      const products = await memoryDriver.find('product');
      if (!products || products.length === 0) {
        logger.info('🌱 Seeding Products...');
        const dummyProducts = [
            { name: 'MacBook Pro 16"', sku: 'MBP16', category: 'Electronics', price: 2499, stock: 45, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000' },
            { name: 'Ergonomic Office Chair', sku: 'CHAIR-v2', category: 'Furniture', price: 599, stock: 120, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000' },
            { name: 'Wireless Noise Canceling Headphones', sku: 'AUDIO-X1', category: 'Electronics', price: 349, stock: 85, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000' },
            { name: 'Standing Desk', sku: 'DESK-PRO', category: 'Furniture', price: 799, stock: 30, image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=1000' },
            { name: 'Smart Watch Series 7', sku: 'WATCH-S7', category: 'Electronics', price: 399, stock: 200, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1000' },
            { name: 'Bluetooth Speaker', sku: 'SPK-BT', category: 'Electronics', price: 129, stock: 150, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=1000' },
        ];
        for (const p of dummyProducts) {
             await memoryDriver.create('product', p);
        }
      }

      // Events
      const events = await memoryDriver.find('event');
      if (!events || events.length === 0) {
          logger.info('🌱 Seeding Events...');
          const now = new Date();
          const dummyEvents = [
              { subject: 'Client Meeting', start: now, end: new Date(now.getTime() + 3600000), location: 'Zoom', type: 'Meeting' },
              { subject: 'Project Kickoff', start: new Date(now.getTime() + 86400000), end: new Date(now.getTime() + 90000000), location: 'Conference Room', type: 'Meeting' }
          ];
          for(const e of dummyEvents) await memoryDriver.create('event', e);
      }

      // Projects
      const tasks = await memoryDriver.find('project_task');
      if (!tasks || tasks.length === 0) {
          logger.info('🌱 Seeding Projects...');
          const dummyTasks = [
              { name: 'Phase 1: Research', start_date: '2023-11-01', end_date: '2023-11-10', progress: 100, status: 'Completed', priority: 'High', color: '#4caf50' },
              { name: 'Phase 2: Design', start_date: '2023-11-11', end_date: '2023-11-25', progress: 50, status: 'In Progress', priority: 'High', color: '#2196f3' }
          ];
          for(const t of dummyTasks) await memoryDriver.create('project_task', t);
      }

    } catch (e) {
      logger.error(e, 'Failed to seed data');
    }

    logger.info('✅ CRM Server is running on http://localhost:3000');
    logger.info('   GraphQL: http://localhost:3000/graphql');

  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
