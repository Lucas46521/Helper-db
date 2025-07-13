
<div align="center">

# 🚀 Helper.DB

### **Uma biblioteca de banco de dados JavaScript simples, poderosa e versátil**

[![NPM Version](https://img.shields.io/npm/v/helper.db.svg)](https://www.npmjs.com/package/helper.db)
[![NPM Downloads](https://img.shields.io/npm/dt/helper.db.svg)](https://www.npmjs.com/package/helper.db)
[![License](https://img.shields.io/npm/l/helper.db.svg)](https://github.com/Lucas46521/Helper.db/blob/main/LICENSE.md)
[![GitHub Stars](https://img.shields.io/github/stars/Lucas46521/Helper.db.svg)](https://github.com/Lucas46521/Helper.db)

![Helper.DB Logo](https://raw.githubusercontent.com/Lucas46521/Helper.db/refs/heads/main/HelperDbLogo2.png)

**[📦 NPM](https://www.npmjs.com/package/helper.db) • [📖 Documentação](https://github.com/Lucas46521/Helper.db) • [🐛 Issues](https://github.com/Lucas46521/Helper.db/issues) • [💬 Discussões](https://github.com/Lucas46521/Helper.db/discussions)**

</div>

---

## ✨ **Visão Geral**

Helper.db é uma biblioteca de banco de dados JavaScript de **código aberto** projetada para facilitar o armazenamento e acesso a dados em aplicações de pequeno a médio porte. Com suporte a múltiplos drivers e uma API intuitiva, é perfeita tanto para iniciantes quanto para desenvolvedores experientes.

### 🔗 **Origem e Evolução**

Helper.DB é baseado na popular biblioteca [**quick.db**](https://github.com/TrueXPixels/quick.db), que infelizmente **não está mais sendo mantida** ativamente. Reconhecendo a importância desta ferramenta na comunidade JavaScript, criamos o Helper.DB para:

- 🔄 **Continuar o legado**: Manter a simplicidade e facilidade de uso que tornaram a quick.db tão popular
- 🚀 **Expandir funcionalidades**: Adicionar recursos avançados como múltiplos drivers, cache inteligente, sistema de eventos e muito mais
- 🐛 **Corrigir problemas**: Resolver bugs conhecidos e melhorar a estabilidade
- 📈 **Modernizar**: Atualizar para as melhores práticas atuais do JavaScript/TypeScript
- 🛡️ **Manter ativo**: Garantir suporte contínuo e atualizações regulares

> 💡 **Para usuários da quick.db**: Helper.DB mantém compatibilidade com a API original, facilitando a migração. Consulte nossa [documentação de migração](https://github.com/Lucas46521/Helper.db/wiki/Migration-Guide) para mais detalhes.

### 🎯 **Por que escolher Helper.DB?**

| Característica | Descrição |
|----------------|-----------|
| 🔒 **Armazenamento Persistente** | Seus dados nunca desaparecem após reinicializações |
| 🔌 **Múltiplos Drivers** | SQLite, MySQL, MariaDB, MongoDB, JSON e Memory |
| ⚡ **Zero Configuração** | Funciona imediatamente sem configuração de servidor |
| 🧩 **API Simples** | Sintaxe intuitiva e documentação clara |
| 🚀 **Alto Performance** | Operações otimizadas e cache inteligente |
| 🛡️ **TypeScript** | Suporte completo com tipagem |

---

## 📦 **Instalação**

### Pré-requisitos (macOS)
<details>
<summary>Clique para ver as etapas de configuração no macOS</summary>

```bash
# 1. Instale o XCode
# 2. Instale o node-gyp globalmente
npm install -g node-gyp

# 3. Configure o Python (se necessário)
node-gyp --python /path/to/python
```
</details>

### Instalação Principal

```bash
# SQLite (Padrão - Recomendado para desenvolvimento)
npm install helper.db better-sqlite3

# MySQL
npm install helper.db mysql2

# MariaDB  
npm install helper.db mysql2

# MongoDB
npm install helper.db mongoose

# JSON (Desenvolvimento simples)
npm install helper.db write-file-atomic
```

> 💡 **Dica**: Problemas na instalação? Consulte o [guia de solução de problemas](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md).

---

## 🚀 **Quick Start**

### Exemplo Básico (SQLite)

```javascript
const { HelperDB } = require("helper.db");

// Inicialização simples
const db = new HelperDB();
// Ou com configurações personalizadas
// const db = new HelperDB({ filePath: "minha-base.sqlite" });

(async () => {
    // ✅ Salvar dados
    await db.set("usuario", { 
        nome: "João", 
        idade: 25, 
        ativo: true 
    });

    // ✅ Buscar dados
    const usuario = await db.get("usuario");
    console.log(usuario); // { nome: "João", idade: 25, ativo: true }

    // ✅ Acessar propriedades específicas
    const nome = await db.get("usuario.nome");
    console.log(nome); // "João"

    // ✅ Trabalhar com arrays
    await db.push("usuario.hobbies", "programação", "leitura");
    
    // ✅ Operações matemáticas
    await db.add("usuario.pontos", 100);
    await db.sub("usuario.idade", 1);

    // ✅ Verificar existência
    const existe = await db.has("usuario");
    console.log(existe); // true
})();
```

---

## 🔧 **Drivers Disponíveis**

### 1. 🗄️ **SQLiteDriver** (Padrão)
```javascript
const { HelperDB, SqliteDriver } = require("helper.db");

const db = new HelperDB({ 
    driver: new SqliteDriver("database.sqlite"),
    table: "dados"
});
```

### 2. 🐬 **MySQLDriver**
```javascript
const { HelperDB, MySQLDriver } = require("helper.db");

const mysqlDriver = new MySQLDriver({
    host: "localhost",
    user: "usuario",
    password: "senha",
    database: "minha_db"
});

await mysqlDriver.connect();
const db = new HelperDB({ driver: mysqlDriver });
```

### 3. 🦭 **MariaDBDriver**
```javascript
const { HelperDB, MariaDBDriver } = require("helper.db");

const mariaDriver = new MariaDBDriver({
    host: "localhost",
    user: "usuario", 
    password: "senha",
    database: "minha_db"
});

await mariaDriver.connect();
const db = new HelperDB({ driver: mariaDriver });
```

### 4. 🍃 **MongoDriver**
```javascript
const { HelperDB, MongoDriver } = require("helper.db");

const mongoDriver = new MongoDriver("mongodb://localhost/quickdb");
await mongoDriver.connect();

const db = new HelperDB({ driver: mongoDriver });

// Lembre-se de fechar a conexão
await mongoDriver.close();
```

### 5. 📄 **JSONDriver**
```javascript
const { HelperDB, JSONDriver } = require("helper.db");

const db = new HelperDB({ 
    driver: new JSONDriver("data.json") 
});
```

### 6. 💾 **MemoryDriver**
```javascript
const { HelperDB, MemoryDriver } = require("helper.db");

// Ideal para cache temporário (dados não persistem)
const db = new HelperDB({ 
    driver: new MemoryDriver() 
});
```

---

## 🛠️ **Funcionalidades Avançadas**

### 🔍 **Sistema de Busca Avançado**

```javascript
// Busca por termo em qualquer propriedade
const resultados = await db.search("João", "nome");

// Filtros condicionais
const adultos = await db.between(18, 65, "idade");
const admins = await db.in("admin", "tipo");

// Expressões regulares
const emails = await db.regex(/@gmail\.com$/, "email");

// Comparações customizadas
const ativos = await db.compare("status", "==", "ativo");

// Filtros personalizados
const custom = await db.custom(async (entry) => {
    return entry.value.pontos > 1000 && entry.value.ativo;
});

// Ordenação e paginação
const usuariosOrdenados = await db.sort("", "idade", "desc");
const primeiros10 = await db.limit(10);
const proximos10 = await db.skip(10);

// Valores únicos
const categorias = await db.distinct("categoria", "produtos");
```

### 📊 **Operações Estatísticas e Agregação**

```javascript
// Estatísticas básicas
const totalUsuarios = await db.count("usuarios");
const somaVendas = await db.sum("valor", "vendas");
const mediaIdade = await db.avg("idade", "usuarios");
const menorPreco = await db.min("preco", "produtos");
const maiorPreco = await db.max("preco", "produtos");

// Agregações complexas
const estatisticas = await db.aggregate([
    { type: 'count', key: 'vendas' },
    { type: 'sum', field: 'valor', key: 'vendas' },
    { type: 'avg', field: 'valor', key: 'vendas' },
    { type: 'min', field: 'valor', key: 'vendas' },
    { type: 'max', field: 'valor', key: 'vendas' }
]);
// Resultado: { count_all: 150, sum_valor: 45000, avg_valor: 300, min_valor: 50, max_valor: 2000 }
```

### 🔧 **Operações de Array Avançadas**

```javascript
// Manipulação de arrays
await db.splice("lista", 2, 1, "novo_item"); // Remove 1 item na posição 2 e adiciona "novo_item"
const indice = await db.indexOf("lista", "item_procurado");
const contem = await db.includes("lista", "item_procurado");

// Transformações
await db.filter("numeros", x => x > 10); // Mantém apenas números maiores que 10
await db.map("numeros", x => x * 2); // Multiplica todos por 2
const soma = await db.reduce("numeros", (acc, curr) => acc + curr, 0); // Soma todos os números
```

### ⚡ **Operações em Lote**

```javascript
// Definir múltiplos valores de uma vez
await db.setMany([
    ["usuario1", { nome: "João", idade: 25 }],
    ["usuario2", { nome: "Maria", idade: 30 }],
    ["usuario3", { nome: "Pedro", idade: 28 }]
]);

// Obter múltiplos valores
const usuarios = await db.getMany(["usuario1", "usuario2", "usuario3"]);

// Atualizar múltiplos valores (apenas se existirem)
const resultados = await db.updateMany([
    ["usuario1", { nome: "João Silva", idade: 26 }],
    ["usuario4", { nome: "Ana", idade: 35 }] // Este não será atualizado se não existir
]);

// Deletar múltiplos valores
await db.deleteMany(["temp1", "temp2", "temp3"]);
```

### 🩺 **Monitoramento e Diagnóstico**

```javascript
// Verificar latência da conexão
const pingResult = await db.ping();
console.log(pingResult);
// {
//   status: 'connected',
//   latency: 2.35,
//   timestamp: '2024-01-15T10:30:45.123Z',
//   driver: 'SqliteDriver'
// }

// Verificar status da aplicação
if (pingResult.status === 'connected' && pingResult.latency < 100) {
    console.log("✅ Banco de dados funcionando perfeitamente!");
} else {
    console.log("⚠️ Possíveis problemas de conectividade");
}
```

### 💾 **Backup e Exportação**

```javascript
// Backup manual
const backupInfo = await db.backup("./backups/backup-2024-01-15.json");
console.log(`Backup criado com ${backupInfo.data.length} registros`);

// Exportar em diferentes formatos
await db.export("json", "./exports/dados.json");
await db.export("csv", "./exports/dados.csv");
await db.export("xml", "./exports/dados.xml");

// Importar dados
const importResult = await db.import("./dados-externos.json", "json");
console.log(`Importados ${importResult.imported} de ${importResult.total} registros`);

// Restaurar backup
const restoreInfo = await db.restore("./backups/backup-2024-01-15.json");
console.log(`Restaurados ${restoreInfo.restored} registros do backup de ${restoreInfo.timestamp}`);
```

### ⚡ **Cache Inteligente**

```javascript
const db = new HelperDB({
    enableCache: true,
    cacheSize: 1000,
    cacheTTL: 300000 // 5 minutos
});

// Ou habilitar após inicialização
db.enableCache(1000, 300000);
```

### 💾 **Backup Automático**

```javascript
const db = new HelperDB({
    enableBackup: true,
    backupOptions: {
        interval: 3600000, // 1 hora
        maxBackups: 10,
        path: "./backups"
    }
});

// Controle manual
await db.enableAutoBackup();
db.stopAutoBackup();
```

### ✅ **Validação de Schema**

```javascript
const db = new HelperDB({ enableValidation: true });

// Definir schema
db.defineSchema({
    nome: { type: "string", required: true },
    idade: { type: "number", min: 0, max: 150 },
    email: { type: "string", pattern: /\S+@\S+\.\S+/ }
});
```

### 🔄 **Transações**

```javascript
const db = new HelperDB({ enableTransactions: true });

const transactionId = await db.beginTransaction();

try {
    await db.set("conta1.saldo", 500);
    await db.set("conta2.saldo", 1500);
    
    await db.commitTransaction(transactionId);
} catch (error) {
    await db.rollbackTransaction(transactionId);
}
```

---

## 📚 **API Completa**

### Operações Básicas
| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `set(key, value)` | Define um valor | `await db.set("nome", "João")` |
| `get(key)` | Obtém um valor | `await db.get("nome")` |
| `has(key)` | Verifica existência | `await db.has("nome")` |
| `delete(key)` | Remove um valor | `await db.delete("nome")` |
| `all()` | Lista todos os dados | `await db.all()` |
| `ping()` | Testa latência da conexão | `await db.ping()` |

### Operações com Arrays
| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `push(key, ...values)` | Adiciona ao final | `await db.push("lista", "item")` |
| `unshift(key, value)` | Adiciona ao início | `await db.unshift("lista", "primeiro")` |
| `pop(key)` | Remove do final | `await db.pop("lista")` |
| `shift(key)` | Remove do início | `await db.shift("lista")` |
| `pull(key, value)` | Remove por valor | `await db.pull("lista", "item")` |
| `splice(key, start, count, ...items)` | Remove/adiciona em posição | `await db.splice("lista", 1, 2, "novo")` |
| `indexOf(key, element)` | Encontra índice | `await db.indexOf("lista", "item")` |
| `includes(key, element)` | Verifica se contém | `await db.includes("lista", "item")` |
| `filter(key, callback)` | Filtra elementos | `await db.filter("lista", x => x > 5)` |
| `map(key, callback)` | Transforma elementos | `await db.map("lista", x => x * 2)` |
| `reduce(key, callback, initial)` | Reduz a um valor | `await db.reduce("lista", (a,b) => a+b, 0)` |

### Operações Matemáticas
| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `add(key, number)` | Adiciona ao número | `await db.add("pontos", 10)` |
| `sub(key, number)` | Subtrai do número | `await db.sub("pontos", 5)` |

### Busca Avançada
| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `search(term, property)` | Busca global | `await db.search("João", "nome")` |
| `between(min, max, prop)` | Valores entre limites | `await db.between(18, 65, "idade")` |
| `startsWith(query)` | IDs que começam com | `await db.startsWith("user_")` |
| `endsWith(query)` | IDs que terminam com | `await db.endsWith("_temp")` |
| `sort(key, field, order)` | Ordena dados | `await db.sort("", "idade", "desc")` |
| `limit(count, key)` | Limita resultados | `await db.limit(10, "usuarios")` |
| `skip(count, key)` | Pula registros | `await db.skip(5, "usuarios")` |
| `distinct(field, key)` | Valores únicos | `await db.distinct("categoria", "produtos")` |

### Operações Estatísticas
| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `count(key)` | Conta registros | `await db.count("usuarios")` |
| `sum(field, key)` | Soma valores | `await db.sum("preco", "produtos")` |
| `avg(field, key)` | Média de valores | `await db.avg("idade", "usuarios")` |
| `min(field, key)` | Valor mínimo | `await db.min("preco", "produtos")` |
| `max(field, key)` | Valor máximo | `await db.max("preco", "produtos")` |
| `aggregate(operations)` | Múltiplas operações | `await db.aggregate([{type:'sum', field:'preco'}])` |

### Operações em Lote
| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `setMany(entries)` | Define múltiplos valores | `await db.setMany([["key1", "val1"], ["key2", "val2"]])` |
| `getMany(keys)` | Obtém múltiplos valores | `await db.getMany(["key1", "key2"])` |
| `deleteMany(keys)` | Remove múltiplos valores | `await db.deleteMany(["key1", "key2"])` |
| `updateMany(updates)` | Atualiza múltiplos valores | `await db.updateMany([["key1", "newVal1"]])` |

### Backup e Restauração
| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `backup(filePath)` | Cria backup manual | `await db.backup("./backup.json")` |
| `restore(filePath)` | Restaura backup | `await db.restore("./backup.json")` |
| `export(format, filePath)` | Exporta dados | `await db.export("csv", "./data.csv")` |
| `import(filePath, format)` | Importa dados | `await db.import("./data.json", "json")` |

---

## ⚙️ **Configurações Avançadas**

```javascript
const db = new HelperDB({
    // 📁 Configurações básicas
    table: "minha_tabela",              // Nome da tabela/coleção (padrão: "json")
    filePath: "caminho/para/db.sqlite", // Caminho do arquivo de banco (padrão: "json.sqlite")
    normalKeys: false,                  // Usar chaves normais ao invés de notação de ponto (padrão: false)
    driver: new SqliteDriver("db.sqlite"), // Driver de banco personalizado
    
    // 🚀 Cache e Performance
    enableCache: true,      // Habilitar sistema de cache (padrão: true)
    cacheSize: 2000,        // Tamanho máximo do cache (padrão: 1000)
    cacheTTL: 600000,       // Tempo de vida do cache em ms (padrão: 300000 = 5 min)
    
    // 💾 Sistema de Backup
    enableBackup: true,     // Habilitar backup automático (padrão: false)
    backupOptions: {
        interval: 1800000,  // Intervalo de backup em ms (padrão: 3600000 = 1h)
        maxBackups: 5,      // Máximo de backups a manter (padrão: 10)
        path: "./backups"   // Caminho para salvar backups (padrão: "./backups")
    },
    
    // ✅ Funcionalidades Avançadas
    enableValidation: true,    // Habilitar validação de schema (padrão: false)
    enableIndexing: true,      // Habilitar sistema de índices (padrão: false)
    enableTransactions: true   // Habilitar suporte a transações (padrão: false)
});
```

## 📡 **Sistema de Eventos**

A Helper.DB agora emite eventos para monitoramento e observabilidade em tempo real:

### 🎧 **Eventos de Operações**

```javascript
const { HelperDB } = require("helper.db");
const db = new HelperDB();

// 🔄 Eventos de inicialização
db.on('initialized', (data) => {
    console.log('✅ Base inicializada:', data);
    // { table: 'json', driver: 'SqliteDriver', options: {...} }
});

// 📝 Eventos de escrita
db.on('beforeSet', (data) => {
    console.log('⏳ Preparando para salvar:', data.key);
});

db.on('set', (data) => {
    console.log('✅ Dados salvos:', data.key, data.value);
});

// 📖 Eventos de leitura
db.on('beforeGet', (data) => {
    console.log('⏳ Buscando dados:', data.key);
});

db.on('get', (data) => {
    console.log('✅ Dados obtidos:', data.key, data.value);
});

// 🗑️ Eventos de exclusão
db.on('beforeDelete', (data) => {
    console.log('⏳ Preparando para deletar:', data.key);
});

db.on('delete', (data) => {
    console.log('✅ Dados deletados:', data.key);
});

// 📚 Eventos de array
db.on('beforePush', (data) => {
    console.log('⏳ Adicionando ao array:', data.key, data.values);
});

db.on('push', (data) => {
    console.log('✅ Array atualizado:', data.key, 'Novo tamanho:', data.newLength);
});
```

### 🔍 **Eventos de Monitoramento**

```javascript
// 🩺 Eventos de ping/conexão
db.on('beforePing', () => {
    console.log('🔍 Testando conexão...');
});

db.on('ping', (result) => {
    console.log('🟢 Conexão OK:', result.latency + 'ms');
});

db.on('pingError', (result) => {
    console.log('🔴 Erro de conexão:', result.error);
});

// 💾 Eventos de backup
db.on('beforeBackup', (data) => {
    console.log('💾 Iniciando backup:', data.filePath);
});

db.on('backup', (data) => {
    console.log('✅ Backup concluído:', data.recordCount, 'registros');
});
```

### 🎯 **Casos de Uso dos Eventos**

#### 📊 **Dashboard de Monitoramento**
```javascript
const stats = {
    operations: 0,
    errors: 0,
    avgLatency: 0
};

db.on('set', () => stats.operations++);
db.on('get', () => stats.operations++);
db.on('delete', () => stats.operations++);

db.on('ping', (result) => {
    stats.avgLatency = (stats.avgLatency + result.latency) / 2;
});

db.on('pingError', () => stats.errors++);

// Exibir estatísticas a cada 30 segundos
setInterval(() => {
    console.log('📊 Stats:', stats);
}, 30000);
```

#### 🚨 **Sistema de Alertas**
```javascript
// Alertar sobre alta latência
db.on('ping', (result) => {
    if (result.latency > 1000) {
        console.warn('⚠️ ALERTA: Alta latência detectada!', result.latency + 'ms');
        // Enviar notificação, email, etc.
    }
});

// Alertar sobre erros de conexão
db.on('pingError', (result) => {
    console.error('🚨 CRÍTICO: Falha na conexão!', result.error);
    // Acionar sistema de recuperação
});
```

#### 📝 **Sistema de Logs Avançado**
```javascript
const fs = require('fs').promises;

// Log todas as operações
const logOperation = async (operation, data) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        operation,
        data
    };
    await fs.appendFile('operations.log', JSON.stringify(logEntry) + '\n');
};

db.on('set', (data) => logOperation('SET', data));
db.on('get', (data) => logOperation('GET', data));
db.on('delete', (data) => logOperation('DELETE', data));
```

---

## 📈 **Performance e Boas Práticas**

### ✅ **Recomendações**

```javascript
// ✅ Use operações em lote para melhor performance
const dados = [
    ["user1", { nome: "João", idade: 25 }],
    ["user2", { nome: "Maria", idade: 30 }]
];
await db.setMany(dados); // Muito mais rápido que múltiplos db.set()

// ✅ Use agregações para estatísticas
const stats = await db.aggregate([
    { type: 'count', key: 'usuarios' },
    { type: 'avg', field: 'idade', key: 'usuarios' }
]);

// ✅ Monitore a saúde da aplicação
const health = await db.ping();
if (health.latency > 1000) {
    console.warn("Base de dados com alta latência!");
}

// ✅ Reutilize conexões de driver
const driver = new MySQLDriver(config);
await driver.connect();
const db1 = new HelperDB({ driver });
const db2 = new HelperDB({ driver, table: "outra_tabela" });

// ✅ Use cache para dados frequentemente acessados
db.enableCache(1000, 300000);

// ✅ Configure backups automáticos
await db.enableAutoBackup({
    interval: 3600000, // 1 hora
    maxBackups: 24 // Manter 24 backups
});

// ✅ Use ordenação e paginação para grandes datasets
const paginaUsuarios = await db.sort("usuarios", "nome", "asc")
    .then(sorted => db.limit(10, ""))
    .then(limited => db.skip(page * 10, ""));
```

### 🎯 **Casos de Uso Avançados**

#### 📊 **Dashboard de Analytics**
```javascript
// Estatísticas completas para dashboard
const analytics = await db.aggregate([
    { type: 'count', key: 'vendas' },
    { type: 'sum', field: 'valor', key: 'vendas' },
    { type: 'avg', field: 'valor', key: 'vendas' },
    { type: 'count', key: 'usuarios' },
    { type: 'max', field: 'pontos', key: 'usuarios' }
]);

// Top vendedores
const topVendedores = await db.sort("vendas", "valor", "desc")
    .then(sorted => db.limit(5, ""));

// Produtos por categoria
const categorias = await db.distinct("categoria", "produtos");
```

#### 🔄 **Sistema de Migração de Dados**
```javascript
// Backup antes da migração
await db.backup(`./backups/pre-migration-${Date.now()}.json`);

// Migrar dados
const dadosAntigos = await db.export("json", "./temp-export.json");
await db.deleteAll(); // Limpar base

// Processar e importar dados novos
const novosDados = processarDados(dadosAntigos);
await db.import("./dados-processados.json", "json");
```

#### 🎮 **Sistema de Ranking de Jogadores**
```javascript
// Atualizar pontuações em lote
await db.updateMany([
    ["player1", { pontos: 1500, nivel: 15 }],
    ["player2", { pontos: 1200, nivel: 12 }],
    ["player3", { pontos: 1800, nivel: 18 }]
]);

// Ranking dos top 10
const ranking = await db.sort("", "pontos", "desc")
    .then(sorted => db.limit(10, ""));

// Estatísticas globais
const stats = await db.aggregate([
    { type: 'count', key: 'players' },
    { type: 'avg', field: 'pontos', key: 'players' },
    { type: 'max', field: 'nivel', key: 'players' }
]);
```

### ⚠️ **Evite**

```javascript
// ❌ Não crie múltiplas instâncias desnecessárias
// ❌ Não deixe conexões abertas sem uso
// ❌ Não faça operações síncronas em loops grandes
```

---

## 🔄 **Changelog**

### 🆕 **v1.0.4** - Expansão Completa da API
<details>
<summary>Ver detalhes da versão atual</summary>

#### 🎉 **Novidades Principais**
- 🩺 **Método `ping()`**: Monitoramento de latência e status da conexão
- 📊 **Operações Estatísticas**: `count()`, `sum()`, `avg()`, `min()`, `max()`, `aggregate()`
- 🔍 **Busca Avançada**: `sort()`, `limit()`, `skip()`, `distinct()`
- 🧩 **Arrays Avançados**: `splice()`, `indexOf()`, `includes()`, `filter()`, `map()`, `reduce()`
- ⚡ **Operações em Lote**: `setMany()`, `getMany()`, `deleteMany()`, `updateMany()`
- 💾 **Backup & Exportação**: `backup()`, `restore()`, `export()`, `import()`

#### 🔧 **Melhorias de Performance**
- 🚀 Otimização em operações de lote (até 300% mais rápido)
- 📈 Agregações eficientes para análise de dados
- 🎯 Operações de array mais precisas e performáticas
- 💾 Sistema de backup/restore robusto com metadata

#### 🛠️ **Funcionalidades de Produção**
- 📊 Monitoramento em tempo real com `ping()`
- 📤 Exportação em múltiplos formatos (JSON, CSV, XML)
- 📥 Importação de dados externos
- 🔄 Sistema de backup/restore completo
- 📈 Análise estatística integrada

#### 🐛 **Correções e Melhorias**
- ✅ Validação aprimorada em todos os novos métodos
- ✅ Melhor tratamento de erros em operações complexas
- ✅ Otimização de memória em operações de array
- ✅ Documentação completa com exemplos práticos
</details>

### **v1.0.3** - Recursos Avançados
<details>
<summary>Ver detalhes</summary>

#### 🎉 **Novidades**
- ✨ **MariaDBDriver**: Suporte completo ao MariaDB
- 🔍 **Sistema de Busca Avançado**: 8 novos métodos de busca
- ⚡ **CacheManager**: Sistema de cache inteligente 
- 💾 **BackupManager**: Backups automáticos e manuais
- ✅ **SchemaValidator**: Validação de dados
- 📊 **IndexManager**: Sistema de índices para performance
- 🔄 **TransactionManager**: Suporte a transações

#### 🔧 **Melhorias**
- 🚀 Performance otimizada em 40%
- 🛡️ Melhor tratamento de erros
- 📝 Documentação TypeScript completa
- 🔒 Validação robusta de tipos

#### 🐛 **Correções**
- ✅ Corrigido bug no `MemoryDriver.getRowByKey`
- ✅ Melhorada lógica do método `pull`
- ✅ Validação aprimorada no `addSubtract`
</details>

### **v1.0.0** - Lançamento Inicial
<details>
<summary>Ver detalhes</summary>

- 🎯 **Novidade**: Método `search()` para busca global
- 🐛 **Correção**: Bug na conexão do MongoDriver
- 📚 **8 novos métodos de busca**: `in`, `between`, `endsWith`, `startsWith`, `regex`, `compare`, `custom`
</details>

---

## 🤝 **Contribuindo**

Adoramos contribuições! Veja como você pode ajudar:

### 🐛 **Reportar Bugs**
1. Verifique se o bug já foi reportado
2. Crie uma [nova issue](https://github.com/Lucas46521/Helper.db/issues)
3. Forneça detalhes e código de reprodução

### 💡 **Sugerir Funcionalidades**
1. Abra uma [discussão](https://github.com/Lucas46521/Helper.db/discussions)
2. Descreva o caso de uso
3. Considere implementar você mesmo!

### 🔧 **Desenvolvimento**

```bash
# Clone o repositório
git clone https://github.com/Lucas46521/Helper.db.git
cd Helper.db

# Instale dependências
npm install

# Execute testes
npm test

# Build do projeto
npm run build

# Verificar linting
npm run lint
```

---

## 📄 **Licença**

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.

```
MIT License - você pode usar, modificar e distribuir livremente!
```

---

## 👥 **Suporte e Comunidade**

### 💬 **Precisa de Ajuda?**

- 📖 **Documentação**: [GitHub Wiki](https://github.com/Lucas46521/Helper.db/wiki)
- 🐛 **Bugs**: [GitHub Issues](https://github.com/Lucas46521/Helper.db/issues)
- 💡 **Discussões**: [GitHub Discussions](https://github.com/Lucas46521/Helper.db/discussions)
- ✉️ **Email**: lucas46521@example.com

### 🌟 **Mostre seu Apoio**

Se Helper.DB foi útil para você:
- ⭐ Deixe uma estrela no GitHub
- 🐦 Compartilhe no Twitter
- 📝 Escreva sobre nós no seu blog
- 🤝 Contribua com código

---

<div align="center">

### 💝 **Feito com ❤️ por [Lucas46521](https://github.com/Lucas46521)**

**Helper.DB - Simplicidade e poder em suas mãos**

[![GitHub](https://img.shields.io/badge/GitHub-Lucas46521-blue?logo=github)](https://github.com/Lucas46521)
[![NPM](https://img.shields.io/badge/NPM-helper.db-red?logo=npm)](https://www.npmjs.com/package/helper.db)

</div>
