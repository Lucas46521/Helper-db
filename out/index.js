"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperDB = exports.MariaDBDriver = exports.JSONDriver = exports.MemoryDriver = exports.MySQLDriver = exports.SqliteDriver = exports.MongoDriver = void 0;
const lodash_1 = require("lodash");
const SqliteDriver_1 = require("./drivers/SqliteDriver");
const CacheManager = require("./cache/CacheManager").CacheManager;
const BackupManager = require("./backup/BackupManager").BackupManager;
const SchemaValidator = require("./validation/SchemaValidator").SchemaValidator;
const IndexManager = require("./indexing/IndexManager").IndexManager;
const TransactionManager = require("./transaction/TransactionManager").TransactionManager;
var MongoDriver_1 = require("./drivers/MongoDriver");
Object.defineProperty(exports, "MongoDriver", { enumerable: true, get: function () { return MongoDriver_1.MongoDriver; } });
var SqliteDriver_2 = require("./drivers/SqliteDriver");
Object.defineProperty(exports, "SqliteDriver", { enumerable: true, get: function () { return SqliteDriver_2.SqliteDriver; } });
var MySQLDriver_1 = require("./drivers/MySQLDriver");
Object.defineProperty(exports, "MySQLDriver", { enumerable: true, get: function () { return MySQLDriver_1.MySQLDriver; } });
var MemoryDriver_1 = require("./drivers/MemoryDriver");
Object.defineProperty(exports, "MemoryDriver", { enumerable: true, get: function () { return MemoryDriver_1.MemoryDriver; } });
var JSONDriver_1 = require("./drivers/JSONDriver");
Object.defineProperty(exports, "JSONDriver", { enumerable: true, get: function () { return JSONDriver_1.JSONDriver; } });
var MariaDBDriver_1 = require("./drivers/MariaDBDriver");
Object.defineProperty(exports, "MariaDBDriver", { enumerable: true, get: function () { return MariaDBDriver_1.MariaDBDriver; } });
class HelperDB {
    static instance;
    prepared;
    _driver;
    tableName;
    normalKeys;
    options;
    get driver() {
        return this._driver;
    }
    constructor(options = {}) {
        options.table ??= "json";
        options.filePath ??= "json.sqlite";
        options.driver ??= new SqliteDriver_1.SqliteDriver(options.filePath);
        options.normalKeys ??= false;
        options.enableCache ??= true;
        options.enableBackup ??= false;
        options.enableValidation ??= false;
        options.enableIndexing ??= false;
        options.enableTransactions ??= false;
        
        this.options = options;
        this._driver = options.driver;
        this.tableName = options.table;
        this.normalKeys = options.normalKeys;
        this.prepared = this.driver.prepare(this.tableName);
        
        // Inicializar funcionalidades opcionais
        this.cache = options.enableCache ? new CacheManager(options.cacheSize, options.cacheTTL) : null;
        this.backupManager = options.enableBackup ? new BackupManager(this, options.backupOptions) : null;
        this.validator = options.enableValidation ? new SchemaValidator() : null;
        this.indexManager = options.enableIndexing ? new IndexManager() : null;
        this.transactionManager = options.enableTransactions ? new TransactionManager(this) : null;
    }
    async addSubtract(key, value, sub = false) {
    if (typeof key != "string")
      throw new Error("First argument (key) needs to be a string");
    if (value == null)
      throw new Error("Missing second argument (value)");
    let currentNumber = await this.get(key);
    if (currentNumber == null)
      currentNumber = 0;
    if (typeof currentNumber != "number") {
      const parsed = parseFloat(currentNumber);
      if (isNaN(parsed)) {
        throw new Error(`Current value with key: (${key}) is not a number and couldn't be parsed to a number`);
      }
      currentNumber = parsed;
    }
    if (typeof value != "number") {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        throw new Error(`Value to add/subtract with key: (${key}) is not a number and couldn't be parsed to a number`);
      }
      value = parsed;
    }
    sub ? (currentNumber -= value): (currentNumber += value);
    await this.set(key, currentNumber);
    return currentNumber;
  }
  async getArray(key) {
    const currentArr = (await this.get(key)) ?? [];
    if (!Array.isArray(currentArr))
      throw new Error(`Current value with key: (${key}) is not an array`);
    return currentArr;
  }
  static createSingleton(options = {}) {
    if (!this.instance && !options.driver)
      throw Error("No instance and driver provided");
    if (!this.instance)
      this.instance = new HelperDB(options);
    return this.instance;
  }
  async init() {
    await this.prepared;
  }
  async all() {
    return this.driver.getAllRows(this.tableName);
  }
  async get(key) {
    if (typeof key != "string")
      throw new Error("First argument (key) needs to be a string");
    if (key.includes(".") && !this.normalKeys) {
      const keySplit = key.split(".");
      const [result] = await this.driver.getRowByKey(this.tableName, keySplit[0]);
      return (0, lodash_1.get)(result, keySplit.slice(1).join("."));
    }
    const [result] = await this.driver.getRowByKey(this.tableName, key);
    return result;
  }
  async set(key, value) {
    if (typeof key != "string")
      throw new Error("First argument (key) needs to be a string");
    if (value == null)
      throw new Error("Missing second argument (value)");
    if (key.includes(".") && !this.normalKeys) {
      const keySplit = key.split(".");
      const [result,
        exist] = await this.driver.getRowByKey(this.tableName, keySplit[0]);
      let obj;
      if (result instanceof Object == false) {
        obj = {};
      } else {
        obj = result;
      }
      const valueSet = (0, lodash_1.set)(obj ?? {}, keySplit.slice(1).join("."), value);
      return this.driver.setRowByKey(this.tableName, keySplit[0], valueSet, exist);
    }
    const exist = (await this.driver.getRowByKey(this.tableName, key))[1];
    return this.driver.setRowByKey(this.tableName, key, value, exist);
  }
  async has(key) {
    return (await this.get(key)) != null;
  }
  async delete(key) {
    if (typeof key != "string")
      throw new Error("First argument (key) needs to be a string");
    if (key.includes(".")) {
      const keySplit = key.split(".");
      const obj = (await this.get(keySplit[0])) ?? {};
      (0, lodash_1.unset)(obj, keySplit.slice(1).join("."));
      return this.set(keySplit[0], obj);
    }
    return this.driver.deleteRowByKey(this.tableName, key);
  }
  async deleteAll() {
    return this.driver.deleteAllRows(this.tableName);
  }
  async add(key, value) {
    return this.addSubtract(key, value);
  }
  async sub(key, value) {
    return this.addSubtract(key, value, true);
  }
  async push(key, ...values) {
    if (typeof key != "string")
      throw new Error("First argument (key) needs to be a string");
    if (values.length === 0)
      throw new Error("Missing second argument (value)");
    const currentArr = await this.getArray(key);
    currentArr.push(...values);
    return this.set(key, currentArr);
  }
  async unshift(key, value) {
    if (typeof key != "string")
      throw new Error("First argument (key) needs to be a string");
    if (value == null)
      throw new Error("Missing second argument (value)");
    let currentArr = await this.getArray(key);
    if (Array.isArray(value))
      currentArr = value.concat(currentArr);
    else
      currentArr.unshift(value);
    return this.set(key, currentArr);
  }
  async pop(key) {
    if (typeof key != "string")
      throw new Error("First argument (key) needs to be a string");
    const currentArr = await this.getArray(key);
    const value = currentArr.pop();
    this.set(key, currentArr);
    return value;
  }
  async shift(key) {
    if (typeof key != "string")
      throw new Error("First argument (key) needs to be a string");
    const currentArr = await this.getArray(key);
    const value = currentArr.shift();
    this.set(key, currentArr);
    return value;
  }
  async pull(key, value, once = false) {
    if (typeof key != "string")
      throw new Error("First argument (key) needs to be a string");
    if (value == null)
      throw new Error("Missing second argument (value)");
    const currentArr = await this.getArray(key);
    if (!Array.isArray(value) && typeof value != "function")
      value = [value];
    const data = [];
    let removed = false;
    for (const i in currentArr) {
      const shouldRemove = Array.isArray(value)
        ? value.includes(currentArr[i])
        : value(currentArr[i], i);
      
      if (shouldRemove) {
        if (once && removed) {
          data.push(currentArr[i]);
        } else {
          removed = true;
          if (!once) continue;
        }
      } else {
        data.push(currentArr[i]);
      }
    }
    return this.set(key, data);
  }
  table(table) {
    if (typeof table != "string")
      throw new Error("First argument (table) needs to be a string");
    const options = {
      ...this.options
    };
    options.table = table;
    options.driver = this.driver;
    return new HelperDB(options);
  }
  async tableAsync(table) {
    const db = this.table(table);
    await db.prepared;
    return db;
  }
  useNormalKeys(activate) {
    this.normalKeys = activate;
  }

  // Configuração de cache
  enableCache(size = 1000, ttl = 300000) {
    this.cache = new CacheManager(size, ttl);
  }

  disableCache() {
    this.cache = null;
  }

  // Configuração de backup
  async enableAutoBackup(options = {}) {
    if (!this.backupManager) {
      this.backupManager = new BackupManager(this, options);
    }
    await this.backupManager.startAutoBackup();
  }

  stopAutoBackup() {
    if (this.backupManager) {
      this.backupManager.stopAutoBackup();
    }
  }

  // Configuração de validação
  defineSchema(schema) {
    if (!this.validator) {
      this.validator = new SchemaValidator();
    }
    this.validator.defineSchema(this.tableName, schema);
  }

  // Configuração de índices
  createIndex(field) {
    if (!this.indexManager) {
      this.indexManager = new IndexManager();
    }
    this.indexManager.createIndex(this.tableName, field);
  }

  // Métodos de transação
  async beginTransaction() {
    if (!this.transactionManager) {
      this.transactionManager = new TransactionManager(this);
    }
    return await this.transactionManager.beginTransaction();
  }

  async commitTransaction(transactionId) {
    if (this.transactionManager) {
      return await this.transactionManager.commit(transactionId);
    }
    throw new Error('Transações não estão habilitadas');
  }

  async rollbackTransaction(transactionId) {
    if (this.transactionManager) {
      return await this.transactionManager.rollback(transactionId);
    }
    throw new Error('Transações não estão habilitadas');
  }
  async search(term, property = null) {
    if (term == null && property == null)
      throw new Error("At least one argument (term or property) is required");

    const allData = await this.all();

    const results = allData.filter((entry) => {
      if (!entry.value) return false;

      if (property) {
        if (!(property in entry.value)) return false;

        if (term != null) {
          const propValue = entry.value[property];
          return (
            propValue === term ||
            (typeof propValue === "string" && propValue.includes(term)) ||
            (Array.isArray(propValue) && propValue.some((item) => item === term || item?.toString()?.includes(term))) ||
            (typeof propValue === "object" && Object.values(propValue).some((val) => val === term || val?.toString()?.includes(term)))
          );
        }

        return true;
      }

      if (typeof entry.value === "string") {
        return entry.value.includes(term);
      } else if (Array.isArray(entry.value)) {
        return entry.value.some((item) => item === term || item?.toString()?.includes(term));
      } else if (typeof entry.value === "object") {
        return Object.values(entry.value).some((val) => val === term || val?.toString()?.includes(term));
      }

      return entry.value === term;
    });

    return results;
  }
  async in(term,
    property = null,
    key = "") {
    if (term == null && property == null)
      throw new Error("At least one argument (term or property) is required");
    if (typeof key !== "string")
      throw new Error("Third argument (key) needs to be a string");

    const data = key === "" ? await this.all() : await this.getArray(key);

    return data.filter((entry) => {
      if (!entry.value) return false;

      if (property) {
        if (!(property in entry.value)) return false;

        const propValue = entry.value[property];

        if (term != null) {
          return (
            propValue === term ||
            (typeof propValue === "string" && propValue.includes(term)) ||
            (Array.isArray(propValue) && propValue.includes(term)) ||
            (typeof propValue === "object" && Object.values(propValue).some((val) => val === term || (typeof val === "string" && val.includes(term))))
          );
        }

        return true;
      }

      if (term != null) {
        if (typeof entry.value === "string") {
          return entry.value.includes(term);
        } else if (Array.isArray(entry.value)) {
          return entry.value.some((item) => item === term || (typeof item === "string" && item.includes(term)));
        } else if (typeof entry.value === "object") {
          return Object.values(entry.value).some((val) => val === term || (typeof val === "string" && val.includes(term)));
        }
      }

      return false;
    });
  }
  async between(min,
    max,
    property = null,
    key = "") {
    if (typeof min !== "number" || typeof max !== "number")
      throw new Error("First and second arguments (min and max) need to be numbers");
    if (property != null && typeof property !== "string")
      throw new Error("Third argument (property) needs to be a string or null");
    if (typeof key !== "string")
      throw new Error("Fourth argument (key) needs to be a string");

    const data = key === "" ? await this.all(): (await this.get(key)) ?? [];

    return data.filter((entry) => {
      if (!entry.value) return false;

      if (property) {
        if (!(property in entry.value)) return false;

        const propValue = entry.value[property];
        if (typeof propValue === "number") {
          return propValue >= min && propValue <= max;
        }
        return false;
      }

      if (typeof entry.value === "number") {
        return entry.value >= min && entry.value <= max;
      }

      return false;
    });
  }
  async endsWith(query,
    key = "") {
    if (typeof query !== "string")
      throw new Error("First argument (query) needs to be a string");
    if (typeof key !== "string")
      throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all(): (await this.get(key)) ?? [];

    return data.filter((entry) => {
      if (!entry.id) return false;
      return entry.id.endsWith(query);
    });
  }
  async startsWith(query,
    key = "") {
    if (typeof query !== "string")
      throw new Error("First argument (query) needs to be a string");
    if (typeof key !== "string")
      throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all(): (await this.get(key)) ?? [];

    return data.filter((entry) => {
      if (!entry.id) return false;
      return entry.id.startsWith(query);
    });
  }
  async regex(pattern,
    property = null,
    key = "") {
    if (!(pattern instanceof RegExp))
      throw new Error("First argument (pattern) needs to be a RegExp");
    if (property && typeof property !== "string")
      throw new Error("Second argument (property) needs to be a string or null");
    if (typeof key !== "string")
      throw new Error("Third argument (key) needs to be a string");

    const data = key === "" ? await this.all(): (await this.get(key)) ?? [];

    return data.filter((entry) => {
      if (!entry.value) return false;

      if (property) {
        if (!(property in entry.value)) return false;
        const propValue = entry.value[property];
        return typeof propValue === "string" && pattern.test(propValue);
      }

      if (typeof entry.value === "string") {
        return pattern.test(entry.value);
      }
      return false;
    });
  }
  async compare(property,
    operator,
    value,
    key = "") {
    if (typeof property !== "string")
      throw new Error("First argument (property) needs to be a string");
    if (typeof operator !== "string")
      throw new Error("Second argument (operator) needs to be a string");
    if (key && typeof key !== "string")
      throw new Error("Fourth argument (key) needs to be a string");

    const validOperators = ["==",
      "===",
      "!=",
      "!==",
      ">",
      "<",
      ">=",
      "<="];
    if (!validOperators.includes(operator))
      throw new Error(`Invalid operator: ${operator}`);

    const data = key === "" ? await this.all(): (await this.get(key)) ?? [];

    return data.filter((entry) => {
      if (!entry.value || !(property in entry.value)) return false;

      const propValue = entry.value[property];

      switch (operator) {
        case "==":
          return propValue == value;
        case "===":
          return propValue === value;
        case "!=":
          return propValue != value;
        case "!==":
          return propValue !== value;
        case ">":
          return propValue > value;
        case "<":
          return propValue < value;
        case ">=":
          return propValue >= value;
        case "<=":
          return propValue <= value;
        default:
          return false;
      }
    });
  }
  async custom(filterFunction,
    key = "") {
    if (typeof filterFunction !== "function")
      throw new Error("First argument (filterFunction) needs to be a function");
    if (typeof key !== "string")
      throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all(): (await this.get(key)) ?? [];

    const results = [];
    for (const entry of data) {
      const result = await filterFunction(entry);
      if (result) {
        results.push(entry);
      }
    }
    return results;
  }

  async ping() {
    const startTime = process.hrtime.bigint();
    
    try {
      // Faz uma operação simples para testar a conexão
      await this.driver.getAllRows(this.tableName);
      
      const endTime = process.hrtime.bigint();
      const latencyNs = endTime - startTime;
      const latencyMs = Number(latencyNs) / 1000000; // Converter para milissegundos
      
      return {
        status: 'connected',
        latency: Math.round(latencyMs * 100) / 100, // Arredondar para 2 casas decimais
        timestamp: new Date().toISOString(),
        driver: this.driver.constructor.name
      };
    } catch (error) {
      const endTime = process.hrtime.bigint();
      const latencyNs = endTime - startTime;
      const latencyMs = Number(latencyNs) / 1000000;
      
      return {
        status: 'disconnected',
        error: error.message,
        latency: Math.round(latencyMs * 100) / 100,
        timestamp: new Date().toISOString(),
        driver: this.driver.constructor.name
      };
    }
  }

  async sort(key = "", field, order = "asc") {
    if (typeof key !== "string") throw new Error("First argument (key) needs to be a string");
    if (typeof field !== "string") throw new Error("Second argument (field) needs to be a string");
    if (!["asc", "desc"].includes(order)) throw new Error("Third argument (order) must be 'asc' or 'desc'");

    const data = key === "" ? await this.all() : (await this.get(key)) ?? [];
    
    return data.sort((a, b) => {
      const valueA = a.value && typeof a.value === 'object' ? a.value[field] : a.value;
      const valueB = b.value && typeof b.value === 'object' ? b.value[field] : b.value;
      
      if (valueA < valueB) return order === "asc" ? -1 : 1;
      if (valueA > valueB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }

  async limit(count, key = "") {
    if (typeof count !== "number" || count < 0) throw new Error("First argument (count) must be a positive number");
    if (typeof key !== "string") throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all() : (await this.get(key)) ?? [];
    return data.slice(0, count);
  }

  async skip(count, key = "") {
    if (typeof count !== "number" || count < 0) throw new Error("First argument (count) must be a positive number");
    if (typeof key !== "string") throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all() : (await this.get(key)) ?? [];
    return data.slice(count);
  }

  async distinct(field, key = "") {
    if (typeof field !== "string") throw new Error("First argument (field) needs to be a string");
    if (typeof key !== "string") throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all() : (await this.get(key)) ?? [];
    const values = new Set();
    
    data.forEach(entry => {
      if (entry.value && typeof entry.value === 'object' && field in entry.value) {
        values.add(entry.value[field]);
      }
    });
    
    return Array.from(values);
  }

  async count(key = "") {
    if (typeof key !== "string") throw new Error("First argument (key) needs to be a string");
    
    const data = key === "" ? await this.all() : (await this.get(key)) ?? [];
    return Array.isArray(data) ? data.length : 0;
  }

  async sum(field, key = "") {
    if (typeof field !== "string") throw new Error("First argument (field) needs to be a string");
    if (typeof key !== "string") throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all() : (await this.get(key)) ?? [];
    let total = 0;
    
    data.forEach(entry => {
      if (entry.value && typeof entry.value === 'object' && field in entry.value) {
        const value = parseFloat(entry.value[field]);
        if (!isNaN(value)) total += value;
      }
    });
    
    return total;
  }

  async avg(field, key = "") {
    if (typeof field !== "string") throw new Error("First argument (field) needs to be a string");
    if (typeof key !== "string") throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all() : (await this.get(key)) ?? [];
    let total = 0;
    let count = 0;
    
    data.forEach(entry => {
      if (entry.value && typeof entry.value === 'object' && field in entry.value) {
        const value = parseFloat(entry.value[field]);
        if (!isNaN(value)) {
          total += value;
          count++;
        }
      }
    });
    
    return count > 0 ? total / count : 0;
  }

  async min(field, key = "") {
    if (typeof field !== "string") throw new Error("First argument (field) needs to be a string");
    if (typeof key !== "string") throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all() : (await this.get(key)) ?? [];
    let minimum = Infinity;
    
    data.forEach(entry => {
      if (entry.value && typeof entry.value === 'object' && field in entry.value) {
        const value = parseFloat(entry.value[field]);
        if (!isNaN(value) && value < minimum) minimum = value;
      }
    });
    
    return minimum === Infinity ? null : minimum;
  }

  async max(field, key = "") {
    if (typeof field !== "string") throw new Error("First argument (field) needs to be a string");
    if (typeof key !== "string") throw new Error("Second argument (key) needs to be a string");

    const data = key === "" ? await this.all() : (await this.get(key)) ?? [];
    let maximum = -Infinity;
    
    data.forEach(entry => {
      if (entry.value && typeof entry.value === 'object' && field in entry.value) {
        const value = parseFloat(entry.value[field]);
        if (!isNaN(value) && value > maximum) maximum = value;
      }
    });
    
    return maximum === -Infinity ? null : maximum;
  }

  async splice(key, start, deleteCount = 0, ...items) {
    if (typeof key !== "string") throw new Error("First argument (key) needs to be a string");
    if (typeof start !== "number") throw new Error("Second argument (start) needs to be a number");
    if (typeof deleteCount !== "number") throw new Error("Third argument (deleteCount) needs to be a number");

    const currentArr = await this.getArray(key);
    const removed = currentArr.splice(start, deleteCount, ...items);
    await this.set(key, currentArr);
    return removed;
  }

  async indexOf(key, searchElement, fromIndex = 0) {
    if (typeof key !== "string") throw new Error("First argument (key) needs to be a string");
    if (typeof fromIndex !== "number") throw new Error("Third argument (fromIndex) needs to be a number");

    const currentArr = await this.getArray(key);
    return currentArr.indexOf(searchElement, fromIndex);
  }

  async includes(key, searchElement, fromIndex = 0) {
    if (typeof key !== "string") throw new Error("First argument (key) needs to be a string");
    if (typeof fromIndex !== "number") throw new Error("Third argument (fromIndex) needs to be a number");

    const currentArr = await this.getArray(key);
    return currentArr.includes(searchElement, fromIndex);
  }

  async filter(key, callback) {
    if (typeof key !== "string") throw new Error("First argument (key) needs to be a string");
    if (typeof callback !== "function") throw new Error("Second argument (callback) needs to be a function");

    const currentArr = await this.getArray(key);
    const filtered = currentArr.filter(callback);
    await this.set(key, filtered);
    return filtered;
  }

  async map(key, callback) {
    if (typeof key !== "string") throw new Error("First argument (key) needs to be a string");
    if (typeof callback !== "function") throw new Error("Second argument (callback) needs to be a function");

    const currentArr = await this.getArray(key);
    const mapped = currentArr.map(callback);
    await this.set(key, mapped);
    return mapped;
  }

  async reduce(key, callback, initialValue) {
    if (typeof key !== "string") throw new Error("First argument (key) needs to be a string");
    if (typeof callback !== "function") throw new Error("Second argument (callback) needs to be a function");

    const currentArr = await this.getArray(key);
    return arguments.length >= 3 ? currentArr.reduce(callback, initialValue) : currentArr.reduce(callback);
  }

  async setMany(entries) {
    if (!Array.isArray(entries)) throw new Error("First argument (entries) needs to be an array");
    
    const results = [];
    for (const entry of entries) {
      if (!Array.isArray(entry) || entry.length !== 2) {
        throw new Error("Each entry must be an array with [key, value]");
      }
      const [key, value] = entry;
      const result = await this.set(key, value);
      results.push(result);
    }
    return results;
  }

  async getMany(keys) {
    if (!Array.isArray(keys)) throw new Error("First argument (keys) needs to be an array");
    
    const results = [];
    for (const key of keys) {
      const value = await this.get(key);
      results.push({ key, value });
    }
    return results;
  }

  async deleteMany(keys) {
    if (!Array.isArray(keys)) throw new Error("First argument (keys) needs to be an array");
    
    let totalDeleted = 0;
    for (const key of keys) {
      const deleted = await this.delete(key);
      totalDeleted += deleted;
    }
    return totalDeleted;
  }

  async updateMany(updates) {
    if (!Array.isArray(updates)) throw new Error("First argument (updates) needs to be an array");
    
    const results = [];
    for (const update of updates) {
      if (!Array.isArray(update) || update.length !== 2) {
        throw new Error("Each update must be an array with [key, value]");
      }
      const [key, value] = update;
      if (await this.has(key)) {
        const result = await this.set(key, value);
        results.push({ key, updated: true, value: result });
      } else {
        results.push({ key, updated: false, value: null });
      }
    }
    return results;
  }

  async aggregate(operations) {
    if (!Array.isArray(operations)) throw new Error("First argument (operations) needs to be an array");
    
    const data = await this.all();
    const results = {};
    
    for (const op of operations) {
      const { type, field, key = '' } = op;
      const targetData = key === '' ? data : (await this.get(key)) ?? [];
      
      switch (type) {
        case 'count':
          results[`${type}_${field || 'all'}`] = await this.count(key);
          break;
        case 'sum':
          results[`${type}_${field}`] = await this.sum(field, key);
          break;
        case 'avg':
          results[`${type}_${field}`] = await this.avg(field, key);
          break;
        case 'min':
          results[`${type}_${field}`] = await this.min(field, key);
          break;
        case 'max':
          results[`${type}_${field}`] = await this.max(field, key);
          break;
        default:
          throw new Error(`Unknown aggregation type: ${type}`);
      }
    }
    
    return results;
  }

  async backup(filePath) {
    if (typeof filePath !== "string") throw new Error("First argument (filePath) needs to be a string");
    
    const allData = await this.all();
    const backupData = {
      timestamp: new Date().toISOString(),
      driver: this.driver.constructor.name,
      table: this.tableName,
      data: allData
    };
    
    const fs = require('fs').promises;
    await fs.writeFile(filePath, JSON.stringify(backupData, null, 2));
    return backupData;
  }

  async restore(filePath) {
    if (typeof filePath !== "string") throw new Error("First argument (filePath) needs to be a string");
    
    const fs = require('fs').promises;
    const backupContent = await fs.readFile(filePath, 'utf8');
    const backupData = JSON.parse(backupContent);
    
    // Limpar dados existentes
    await this.deleteAll();
    
    // Restaurar dados
    for (const entry of backupData.data) {
      await this.set(entry.id, entry.value);
    }
    
    return {
      restored: backupData.data.length,
      timestamp: backupData.timestamp,
      originalDriver: backupData.driver,
      originalTable: backupData.table
    };
  }

  async export(format = 'json', filePath) {
    if (!['json', 'csv', 'xml'].includes(format)) {
      throw new Error("Format must be 'json', 'csv', or 'xml'");
    }
    if (typeof filePath !== "string") throw new Error("Second argument (filePath) needs to be a string");
    
    const allData = await this.all();
    const fs = require('fs').promises;
    let content;
    
    switch (format) {
      case 'json':
        content = JSON.stringify(allData, null, 2);
        break;
      case 'csv':
        const headers = ['id', 'value'];
        const csvRows = [headers.join(',')];
        allData.forEach(entry => {
          csvRows.push(`"${entry.id}","${JSON.stringify(entry.value).replace(/"/g, '""')}"`);
        });
        content = csvRows.join('\n');
        break;
      case 'xml':
        content = '<?xml version="1.0" encoding="UTF-8"?>\n<data>\n';
        allData.forEach(entry => {
          content += `  <entry id="${entry.id}">\n`;
          content += `    <value>${JSON.stringify(entry.value)}</value>\n`;
          content += `  </entry>\n`;
        });
        content += '</data>';
        break;
    }
    
    await fs.writeFile(filePath, content);
    return { exported: allData.length, format, filePath };
  }

  async import(filePath, format = 'json') {
    if (!['json', 'csv'].includes(format)) {
      throw new Error("Format must be 'json' or 'csv'");
    }
    if (typeof filePath !== "string") throw new Error("First argument (filePath) needs to be a string");
    
    const fs = require('fs').promises;
    const content = await fs.readFile(filePath, 'utf8');
    let data = [];
    
    switch (format) {
      case 'json':
        data = JSON.parse(content);
        break;
      case 'csv':
        const lines = content.split('\n').slice(1); // Skip header
        data = lines.map(line => {
          const [id, valueStr] = line.split(',').map(field => field.replace(/^"(.*)"$/, '$1'));
          return { id, value: JSON.parse(valueStr.replace(/""/g, '"')) };
        });
        break;
    }
    
    let imported = 0;
    for (const entry of data) {
      if (entry.id && entry.value !== undefined) {
        await this.set(entry.id, entry.value);
        imported++;
      }
    }
    
    return { imported, total: data.length };
  }
}
exports.HelperDB = HelperDB;
//# sourceMappingURL=index.js.map