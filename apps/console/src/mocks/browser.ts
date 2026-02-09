/**
 * MSW Browser Worker Setup via ObjectStack Runtime
 *
 * Uses the standard @objectstack/plugin-msw to create a complete ObjectStack
 * environment in the browser with In-Memory Driver and MSW-intercepted API.
 */

import { ObjectKernel, DriverPlugin, AppPlugin } from '@objectstack/runtime';
import { ObjectQLPlugin } from '@objectstack/objectql';
import { InMemoryDriver } from '@objectstack/driver-memory';
import { MSWPlugin } from '@objectstack/plugin-msw';
import appConfig from '../../objectstack.shared';

let kernel: ObjectKernel | null = null;
let driver: InMemoryDriver | null = null;

export async function startMockServer() {
  // Polyfill process.on for ObjectKernel in browser environment
  try {
    if (typeof process !== 'undefined' && !(process as any).on) {
      (process as any).on = () => {};
    }
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[MSW] Failed to polyfill process.on', e);
  }

  if (kernel) {
    if (import.meta.env.DEV) console.log('[MSW] ObjectStack Runtime already initialized');
    return kernel;
  }

  if (import.meta.env.DEV) console.log('[MSW] Starting ObjectStack Runtime (Browser Mode)...');

  driver = new InMemoryDriver();

  kernel = new ObjectKernel({
    skipSystemValidation: true
  });

  await kernel.use(new ObjectQLPlugin());
  await kernel.use(new DriverPlugin(driver, 'memory'));
  await kernel.use(new AppPlugin(appConfig));

  // MSW Plugin handles worker setup automatically with enableBrowser: true
  const mswPlugin = new MSWPlugin({
    enableBrowser: true,
    baseUrl: '/api/v1',
    logRequests: true
  });
  await kernel.use(mswPlugin);

  await kernel.bootstrap();

  // Broker shim: routes HttpDispatcher action calls to kernel services.
  // Required because no current plugin initializes kernel.broker.
  const ql = kernel.getService<any>('objectql');
  const protocol = kernel.getService<any>('protocol');
  (kernel as any).broker = {
    call: async (action: string, params: any) => {
      const [service, method] = action.split('.');

      if (service === 'data') {
        if (method === 'query' || method === 'find') {
          const filter = params.filters?.filters ?? params.filters ?? params.filter;
          const data = await ql.find(params.object, {
            filter,
            top: params.filters?.top ?? params.top,
            skip: params.filters?.skip ?? params.skip,
            sort: params.filters?.sort ?? params.sort,
          });
          return { data, count: data.length };
        }
        if (method === 'get') {
          return ql.findOne(params.object, { filter: { id: params.id } });
        }
        if (method === 'create') {
          const res = await ql.insert(params.object, params.data);
          return { ...params.data, ...res };
        }
        if (method === 'update') {
          return ql.update(params.object, params.data, { filter: { id: params.id } });
        }
        if (method === 'delete') {
          return ql.delete(params.object, { filter: { id: params.id } });
        }
      }

      if (service === 'metadata') {
        if (method === 'getObject') return protocol.getMetaItem('object', params.objectName);
        if (method === 'objects') return protocol.getMetaItems('object');
        if (method === 'types') return { types: ['object', 'app'] };
      }

      if (service === 'ui') {
        if (method === 'getView') return protocol.getUiView(params.object, params.type);
      }

      if (service === 'auth') {
        return { token: 'mock-token', user: { name: 'Admin' } };
      }

      if (import.meta.env.DEV) console.warn(`[Broker] Unhandled: ${action}`, params);
      return null;
    }
  };

  if (import.meta.env.DEV) console.log('[MSW] ObjectStack Runtime ready');
  return kernel;
}

export function getKernel(): ObjectKernel | null {
  return kernel;
}

export function getDriver(): InMemoryDriver | null {
  return driver;
}
