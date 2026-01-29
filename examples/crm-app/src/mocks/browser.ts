import { ObjectKernel, DriverPlugin, AppPlugin } from '@objectstack/runtime';
import { ObjectQLPlugin } from '@objectstack/objectql';
import { InMemoryDriver } from '@objectstack/driver-memory';
import { MSWPlugin } from '@objectstack/plugin-msw';
import { config as crmConfig } from '@object-ui/example-crm';
import { http, HttpResponse } from 'msw';

let kernel: ObjectKernel | null = null;

export async function startMockServer() {
  if (kernel) return kernel;

  console.log('[MSW] Starting ObjectStack Runtime (Browser Mode)...');

  const driver = new InMemoryDriver();

  // Create kernel with MiniKernel architecture
  kernel = new ObjectKernel();
  
  kernel
    // Register ObjectQL engine
    .use(new ObjectQLPlugin())
    // Register the driver
    .use(new DriverPlugin(driver, 'memory'))
    // Load app config as a plugin
    .use(new AppPlugin(crmConfig))
    // MSW Plugin (intercepts network requests)
    .use(new MSWPlugin({
      enableBrowser: true,
      baseUrl: '/api/v1',
      logRequests: true,
      customHandlers: [
          // Custom handlers that are not part of standard CRUD
          http.get('/api/bootstrap', async () => {
             // We use closure 'driver' variable to bypass objectql service issues
             try {
                // Use IDataEngine interface directly via driver
                // const user = (await driver.findOne('user', 'current')) || {};
                const contacts = await driver.find('contact', { object: 'contact' });
                const opportunities = await driver.find('opportunity', { object: 'opportunity' });
                const stats = { revenue: 125000, leads: 45, deals: 12 };

                return HttpResponse.json({
                    user: { name: "Demo User", role: "admin" }, // simple mock
                    stats,
                    contacts,
                    opportunities
                });
             } catch (e) {
                 console.error(e);
                 return new HttpResponse(null, { status: 500 });
             }
          })
      ]
    }));
  
  await kernel.bootstrap();

  // Seed Data
  await initializeMockData(driver);
  
  return kernel;
}

// Helper to seed data into the in-memory driver
async function initializeMockData(driver: InMemoryDriver) {
    console.log('[MockServer] Initializing mock data from manifest...');
    
    // @ts-ignore
    const manifest = crmConfig.manifest;
    if (manifest && manifest.data) {
        for (const dataSet of manifest.data) {
            console.log(`[MockServer] Seeding ${dataSet.object}...`);
            if (dataSet.records) {
                for (const record of dataSet.records) {
                    await driver.create(dataSet.object, record);
                }
            }
        }
    }
}

