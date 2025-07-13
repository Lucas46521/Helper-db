
"use strict";
const fs = require("fs").promises;
const path = require("path");

class BackupManager {
    constructor(db, options = {}) {
        this.db = db;
        this.backupDir = options.backupDir || './backups';
        this.interval = options.interval || 3600000; // 1 hora
        this.maxBackups = options.maxBackups || 10;
        this.isRunning = false;
    }

    async startAutoBackup() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        await this.ensureBackupDir();
        
        this.intervalId = setInterval(async () => {
            try {
                await this.createBackup();
                await this.cleanOldBackups();
            } catch (error) {
                console.error('Erro no backup automático:', error);
            }
        }, this.interval);
    }

    stopAutoBackup() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.isRunning = false;
    }

    async createBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = path.join(this.backupDir, `backup-${timestamp}.json`);
        
        const allData = await this.db.all();
        await fs.writeFile(backupFile, JSON.stringify(allData, null, 2));
        
        return backupFile;
    }

    async restoreFromBackup(backupFile) {
        const data = JSON.parse(await fs.readFile(backupFile, 'utf8'));
        
        await this.db.deleteAll();
        
        for (const item of data) {
            await this.db.set(item.id, item.value);
        }
    }

    async ensureBackupDir() {
        try {
            await fs.access(this.backupDir);
        } catch {
            await fs.mkdir(this.backupDir, { recursive: true });
        }
    }

    async cleanOldBackups() {
        const files = await fs.readdir(this.backupDir);
        const backupFiles = files
            .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
            .sort()
            .reverse();

        if (backupFiles.length > this.maxBackups) {
            const filesToDelete = backupFiles.slice(this.maxBackups);
            for (const file of filesToDelete) {
                await fs.unlink(path.join(this.backupDir, file));
            }
        }
    }
}

exports.BackupManager = BackupManager;
