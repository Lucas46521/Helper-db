
"use strict";

class TransactionManager {
    constructor(db) {
        this.db = db;
        this.transactions = new Map();
    }

    async beginTransaction(transactionId = this.generateId()) {
        if (this.transactions.has(transactionId)) {
            throw new Error(`Transação ${transactionId} já existe`);
        }

        this.transactions.set(transactionId, {
            id: transactionId,
            operations: [],
            rollbackData: new Map(),
            status: 'active'
        });

        return transactionId;
    }

    async addOperation(transactionId, operation, key, value, oldValue) {
        const transaction = this.transactions.get(transactionId);
        if (!transaction || transaction.status !== 'active') {
            throw new Error(`Transação ${transactionId} não está ativa`);
        }

        transaction.operations.push({ operation, key, value });
        if (oldValue !== undefined) {
            transaction.rollbackData.set(key, oldValue);
        }
    }

    async commit(transactionId) {
        const transaction = this.transactions.get(transactionId);
        if (!transaction || transaction.status !== 'active') {
            throw new Error(`Transação ${transactionId} não está ativa`);
        }

        try {
            for (const op of transaction.operations) {
                switch (op.operation) {
                    case 'set':
                        await this.db.set(op.key, op.value);
                        break;
                    case 'delete':
                        await this.db.delete(op.key);
                        break;
                }
            }

            transaction.status = 'committed';
            this.transactions.delete(transactionId);
            return true;
        } catch (error) {
            await this.rollback(transactionId);
            throw error;
        }
    }

    async rollback(transactionId) {
        const transaction = this.transactions.get(transactionId);
        if (!transaction) {
            throw new Error(`Transação ${transactionId} não encontrada`);
        }

        try {
            for (const [key, oldValue] of transaction.rollbackData) {
                if (oldValue === null) {
                    await this.db.delete(key);
                } else {
                    await this.db.set(key, oldValue);
                }
            }

            transaction.status = 'rolled_back';
            this.transactions.delete(transactionId);
            return true;
        } catch (error) {
            console.error('Erro durante rollback:', error);
            throw error;
        }
    }

    generateId() {
        return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

exports.TransactionManager = TransactionManager;
