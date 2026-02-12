/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Cloud namespace integration for @objectstack/spec v3.0.0
 * Replaces the legacy Hub namespace for cloud deployment, hosting, and marketplace schemas.
 */

export interface CloudDeploymentConfig {
  /** Target environment */
  environment: 'development' | 'staging' | 'production';
  /** Cloud region */
  region?: string;
  /** Auto-scaling configuration */
  scaling?: {
    minInstances: number;
    maxInstances: number;
    targetCPU?: number;
  };
  /** Environment variables */
  envVars?: Record<string, string>;
}

export interface CloudHostingConfig {
  /** Custom domain */
  customDomain?: string;
  /** SSL configuration */
  ssl?: {
    enabled: boolean;
    autoRenew: boolean;
  };
  /** CDN configuration */
  cdn?: {
    enabled: boolean;
    regions?: string[];
  };
}

export interface CloudMarketplaceEntry {
  /** Plugin or app ID */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Version */
  version: string;
  /** Author */
  author: string;
  /** Category */
  category: string;
  /** Tags */
  tags: string[];
  /** Rating (1-5) */
  rating?: number;
  /** Install count */
  installCount?: number;
  /** Price (0 = free) */
  price?: number;
}

/**
 * Cloud operations helper for ObjectStack adapter.
 * Provides methods for cloud deployment, hosting, and marketplace operations.
 */
export class CloudOperations {
  constructor(private getClient: () => any) {}

  /**
   * Deploy an application to the cloud.
   */
  async deploy(appId: string, config: CloudDeploymentConfig): Promise<{ deploymentId: string; status: string }> {
    const client = this.getClient();
    const result = await client.cloud?.deploy?.(appId, config);
    return result ?? { deploymentId: `deploy-${Date.now()}`, status: 'pending' };
  }

  /**
   * Get deployment status.
   */
  async getDeploymentStatus(deploymentId: string): Promise<{ status: string; url?: string }> {
    const client = this.getClient();
    const result = await client.cloud?.getDeployment?.(deploymentId);
    return result ?? { status: 'unknown' };
  }

  /**
   * Search marketplace entries.
   */
  async searchMarketplace(query?: string, category?: string): Promise<CloudMarketplaceEntry[]> {
    const client = this.getClient();
    const result = await client.cloud?.marketplace?.search?.({ query, category });
    return result?.items ?? [];
  }

  /**
   * Install a marketplace plugin.
   */
  async installPlugin(pluginId: string): Promise<{ success: boolean }> {
    const client = this.getClient();
    const result = await client.cloud?.marketplace?.install?.(pluginId);
    return result ?? { success: false };
  }
}
