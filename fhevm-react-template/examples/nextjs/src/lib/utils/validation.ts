/**
 * Validation utility functions
 */

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateField(value: any, rules: ValidationRule): ValidationResult {
  const errors: string[] = [];

  if (rules.required && !value) {
    errors.push('This field is required');
  }

  if (rules.min !== undefined && Number(value) < rules.min) {
    errors.push(`Value must be at least ${rules.min}`);
  }

  if (rules.max !== undefined && Number(value) > rules.max) {
    errors.push(`Value must be at most ${rules.max}`);
  }

  if (rules.pattern && !rules.pattern.test(String(value))) {
    errors.push('Invalid format');
  }

  if (rules.custom && !rules.custom(value)) {
    errors.push('Validation failed');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateEncryptionType(type: string): boolean {
  const validTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'address', 'bytes'];
  return validTypes.includes(type);
}

export function validateContractABI(abi: any[]): boolean {
  return Array.isArray(abi) && abi.length > 0;
}

export function validateTransactionHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}
