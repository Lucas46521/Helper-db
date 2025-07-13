
"use strict";

class SchemaValidator {
    constructor() {
        this.schemas = new Map();
    }

    defineSchema(tableName, schema) {
        this.schemas.set(tableName, schema);
    }

    validate(tableName, data) {
        const schema = this.schemas.get(tableName);
        if (!schema) return { valid: true };

        return this.validateAgainstSchema(data, schema);
    }

    validateAgainstSchema(data, schema) {
        const errors = [];

        for (const [field, rules] of Object.entries(schema)) {
            const value = data[field];

            if (rules.required && (value === undefined || value === null)) {
                errors.push(`Campo '${field}' é obrigatório`);
                continue;
            }

            if (value !== undefined && value !== null) {
                if (rules.type && typeof value !== rules.type) {
                    errors.push(`Campo '${field}' deve ser do tipo '${rules.type}'`);
                }

                if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
                    errors.push(`Campo '${field}' deve ter pelo menos ${rules.minLength} caracteres`);
                }

                if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
                    errors.push(`Campo '${field}' deve ter no máximo ${rules.maxLength} caracteres`);
                }

                if (rules.min && typeof value === 'number' && value < rules.min) {
                    errors.push(`Campo '${field}' deve ser maior ou igual a ${rules.min}`);
                }

                if (rules.max && typeof value === 'number' && value > rules.max) {
                    errors.push(`Campo '${field}' deve ser menor ou igual a ${rules.max}`);
                }

                if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
                    errors.push(`Campo '${field}' não atende ao padrão exigido`);
                }

                if (rules.enum && !rules.enum.includes(value)) {
                    errors.push(`Campo '${field}' deve ser um dos valores: ${rules.enum.join(', ')}`);
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

exports.SchemaValidator = SchemaValidator;
