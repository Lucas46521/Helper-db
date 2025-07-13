
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

class CacheManager {
    constructor(maxSize = 1000, ttl = 300000) { // 5 minutos TTL padrão
        this.cache = new Map();
        this.maxSize = maxSize;
        this.ttl = ttl;
        this.accessTimes = new Map();
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            this.accessTimes.delete(key);
            return null;
        }

        this.accessTimes.set(key, Date.now());
        return item.value;
    }

    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            this.evictLeastRecentlyUsed();
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
        this.accessTimes.set(key, Date.now());
    }

    delete(key) {
        this.cache.delete(key);
        this.accessTimes.delete(key);
    }

    clear() {
        this.cache.clear();
        this.accessTimes.clear();
    }

    evictLeastRecentlyUsed() {
        let oldestKey = null;
        let oldestTime = Date.now();

        for (const [key, time] of this.accessTimes) {
            if (time < oldestTime) {
                oldestTime = time;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.accessTimes.delete(oldestKey);
        }
    }
}

exports.CacheManager = CacheManager;
