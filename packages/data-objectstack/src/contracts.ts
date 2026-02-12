/**
 * ObjectUI
 * Copyright (c) 2024-present ObjectStack Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Contracts module integration for @objectstack/spec v3.0.0
 * Provides plugin contract validation and marketplace publishing utilities.
 */

export interface PluginContract {
  /** Plugin name */
  name: string;
  /** Plugin version */
  version: string;
  /** Required peer dependencies */
  peerDependencies?: Record<string, string>;
  /** Exported component types */
  exports: PluginExport[];
  /** Required permissions */
  permissions?: string[];
  /** API surface contract */
  api?: PluginAPIContract;
}

export interface PluginExport {
  /** Export name */
  name: string;
  /** Export type */
  type: 'component' | 'hook' | 'utility' | 'provider';
  /** Description */
  description?: string;
}

export interface PluginAPIContract {
  /** Consumed data sources */
  dataSources?: string[];
  /** Required object schemas */
  requiredSchemas?: string[];
  /** Event subscriptions */
  events?: string[];
}

export interface ContractValidationResult {
  valid: boolean;
  errors: ContractValidationError[];
  warnings: string[];
}

export interface ContractValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Validate a plugin contract against the ObjectStack spec.
 */
export function validatePluginContract(contract: PluginContract): ContractValidationResult {
  const errors: ContractValidationError[] = [];
  const warnings: string[] = [];

  if (!contract.name || contract.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Plugin name is required', code: 'MISSING_NAME' });
  }

  if (!contract.version || !/^\d+\.\d+\.\d+/.test(contract.version)) {
    errors.push({ field: 'version', message: 'Valid semver version is required', code: 'INVALID_VERSION' });
  }

  if (!contract.exports || contract.exports.length === 0) {
    errors.push({ field: 'exports', message: 'At least one export is required', code: 'NO_EXPORTS' });
  }

  if (contract.exports) {
    const validTypes = ['component', 'hook', 'utility', 'provider'];
    for (const exp of contract.exports) {
      if (!exp.name) {
        errors.push({ field: 'exports.name', message: 'Export name is required', code: 'MISSING_EXPORT_NAME' });
      }
      if (!validTypes.includes(exp.type)) {
        errors.push({ field: 'exports.type', message: `Invalid export type: ${exp.type}`, code: 'INVALID_EXPORT_TYPE' });
      }
    }
  }

  if (!contract.permissions || contract.permissions.length === 0) {
    warnings.push('No permissions declared — plugin will have minimal access');
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Generate a plugin contract manifest for marketplace publishing.
 */
export function generateContractManifest(contract: PluginContract): Record<string, unknown> {
  return {
    $schema: 'https://objectui.org/schemas/plugin-contract-v1.json',
    name: contract.name,
    version: contract.version,
    peerDependencies: contract.peerDependencies ?? {},
    exports: contract.exports.map(exp => ({
      name: exp.name,
      type: exp.type,
      description: exp.description ?? '',
    })),
    permissions: contract.permissions ?? [],
    api: contract.api ?? {},
    generatedAt: new Date().toISOString(),
  };
}
