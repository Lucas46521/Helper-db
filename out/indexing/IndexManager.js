
"use strict";

class IndexManager {
    constructor() {
        this.indexes = new Map();
    }

    createIndex(tableName, field) {
        const indexKey = `${tableName}.${field}`;
        if (!this.indexes.has(indexKey)) {
            this.indexes.set(indexKey, new Map());
        }
    }

    updateIndex(tableName, field, id, value) {
        const indexKey = `${tableName}.${field}`;
        const index = this.indexes.get(indexKey);
        
        if (index) {
            if (!index.has(value)) {
                index.set(value, new Set());
            }
            index.get(value).add(id);
        }
    }

    removeFromIndex(tableName, field, id, value) {
        const indexKey = `${tableName}.${field}`;
        const index = this.indexes.get(indexKey);
        
        if (index && index.has(value)) {
            index.get(value).delete(id);
            if (index.get(value).size === 0) {
                index.delete(value);
            }
        }
    }

    findByIndex(tableName, field, value) {
        const indexKey = `${tableName}.${field}`;
        const index = this.indexes.get(indexKey);
        
        if (index && index.has(value)) {
            return Array.from(index.get(value));
        }
        
        return [];
    }

    rebuildIndex(tableName, field, allData) {
        const indexKey = `${tableName}.${field}`;
        this.indexes.set(indexKey, new Map());
        
        for (const item of allData) {
            if (item.value && item.value[field] !== undefined) {
                this.updateIndex(tableName, field, item.id, item.value[field]);
            }
        }
    }
}

exports.IndexManager = IndexManager;
