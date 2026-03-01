/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ObjectStackAdapter } from './index';

// We test the adapter's $expand handling.
// When $expand is present, the adapter makes a raw GET request to the REST API
// with `populate` as a URL query param (since the client SDK's data.find()
// QueryOptions does not support populate/expand).
// The key scenarios:
//   1. find() with $expand → raw GET /api/v1/data/:object?populate=...
//   2. find() without $expand → client.data.find() (GET) as before
//   3. findOne() with $expand → raw GET /api/v1/data/:object?filter={_id:...}&populate=...
//   4. findOne() without $expand → client.data.get() as before

describe('ObjectStackAdapter $expand support', () => {
  let adapter: ObjectStackAdapter;
  let mockClient: any;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create a mock fetch that returns a successful response
    mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ records: [], total: 0 }),
    });

    adapter = new ObjectStackAdapter({
      baseUrl: 'http://localhost:3000',
      autoReconnect: false,
      fetch: mockFetch,
    });

    // Mock the internal client after construction
    mockClient = {
      data: {
        find: vi.fn().mockResolvedValue({ records: [], total: 0 }),
        query: vi.fn().mockResolvedValue({ records: [], total: 0 }),
        get: vi.fn().mockResolvedValue({ record: { _id: '1', name: 'Test' } }),
      },
      connect: vi.fn().mockResolvedValue(undefined),
      discover: vi.fn().mockResolvedValue({ status: 'ok' }),
    };

    // Inject mock client and mark as connected to bypass connect()
    (adapter as any).client = mockClient;
    (adapter as any).connected = true;
  });

  describe('find() with $expand', () => {
    it('should make a raw GET request with populate query param when $expand is present', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          records: [{ _id: '1', name: 'Order 1', customer: { _id: '2', name: 'Alice' } }],
          total: 1,
        }),
      });

      const result = await adapter.find('order', {
        $top: 10,
        $expand: ['customer', 'account'],
      });

      // Should use raw fetch, not client.data.query or client.data.find
      expect(mockFetch).toHaveBeenCalled();
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain('/api/v1/data/order');
      expect(fetchUrl).toContain('populate=customer%2Caccount');
      expect(fetchUrl).toContain('top=10');
      expect(mockClient.data.find).not.toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].customer).toEqual({ _id: '2', name: 'Alice' });
    });

    it('should pass filters and sort as query params', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ records: [], total: 0 }),
      });

      await adapter.find('order', {
        $filter: { status: 'active' },
        $orderby: [{ field: 'name', order: 'asc' }],
        $top: 50,
        $skip: 10,
        $expand: ['customer'],
      });

      expect(mockFetch).toHaveBeenCalled();
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain('populate=customer');
      expect(fetchUrl).toContain('top=50');
      expect(fetchUrl).toContain('skip=10');
      expect(fetchUrl).toContain('sort=name');
      expect(fetchUrl).toContain('filter=');
    });

    it('should use data.find() when $expand is not present', async () => {
      mockClient.data.find.mockResolvedValue({ records: [{ _id: '1', name: 'Test' }], total: 1 });

      const result = await adapter.find('order', { $top: 10 });

      expect(mockClient.data.find).toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
    });

    it('should use data.find() when $expand is an empty array', async () => {
      mockClient.data.find.mockResolvedValue({ records: [], total: 0 });

      await adapter.find('order', { $top: 10, $expand: [] });

      expect(mockClient.data.find).toHaveBeenCalled();
    });
  });

  describe('findOne() with $expand', () => {
    it('should make a raw GET request with _id filter and populate when $expand is present', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          records: [{ _id: 'order-1', name: 'Order 1', customer: { _id: '2', name: 'Alice' } }],
        }),
      });

      const result = await adapter.findOne('order', 'order-1', {
        $expand: ['customer', 'account'],
      });

      expect(mockFetch).toHaveBeenCalled();
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain('/api/v1/data/order');
      expect(fetchUrl).toContain('populate=customer%2Caccount');
      expect(fetchUrl).toContain('top=1');
      expect(fetchUrl).toContain('filter=');
      // Verify the filter contains _id
      const filterParam = new URL(fetchUrl).searchParams.get('filter');
      expect(filterParam).toBeTruthy();
      const parsedFilter = JSON.parse(filterParam!);
      expect(parsedFilter).toEqual({ _id: 'order-1' });
      expect(mockClient.data.get).not.toHaveBeenCalled();
      expect(result).toEqual({ _id: 'order-1', name: 'Order 1', customer: { _id: '2', name: 'Alice' } });
    });

    it('should return null when raw request returns no records', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ records: [] }),
      });

      const result = await adapter.findOne('order', 'nonexistent', {
        $expand: ['customer'],
      });

      expect(result).toBeNull();
    });

    it('should use data.get() when $expand is not present', async () => {
      mockClient.data.get.mockResolvedValue({ record: { _id: '1', name: 'Test' } });

      const result = await adapter.findOne('order', '1');

      expect(mockClient.data.get).toHaveBeenCalledWith('order', '1');
      expect(result).toEqual({ _id: '1', name: 'Test' });
    });

    it('should return null for 404 errors without $expand', async () => {
      mockClient.data.get.mockRejectedValue({ status: 404 });

      const result = await adapter.findOne('order', 'nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('raw request format', () => {
    it('should include Authorization header when token is set', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ records: [], total: 0 }),
      });

      (adapter as any).token = 'test-token';

      await adapter.find('order', {
        $expand: ['customer'],
      });

      expect(mockFetch).toHaveBeenCalled();
      const fetchInit = mockFetch.mock.calls[0][1];
      expect(fetchInit.headers.Authorization).toBe('Bearer test-token');
    });

    it('should unwrap response envelope with success/data wrapper', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          data: {
            records: [{ _id: '1', name: 'Order' }],
            total: 1,
          },
        }),
      });

      const result = await adapter.find('order', {
        $expand: ['customer'],
      });

      expect(result.data).toHaveLength(1);
    });
  });
});
