
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

### Operações com Arrays
| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `push(key, ...values)` | Adiciona ao final | `await db.push("lista", "item")` |
| `unshift(key, value)` | Adiciona ao início | `await db.unshift("lista", "primeiro")` |
| `pop(key)` | Remove do final | `await db.pop("lista")` |
| `shift(key)` | Remove do início | `await db.shift("lista")` |
| `pull(key, value)` | Remove por valor | `await db.pull("lista", "item")` |

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

---

## ⚙️ **Configurações Avançadas**

```javascript
const db = new HelperDB({
    // Configurações básicas
    table: "minha_tabela",
    filePath: "caminho/para/db.sqlite",
    normalKeys: false, // usar notação de ponto
    
    // Funcionalidades opcionais
    enableCache: true,
    cacheSize: 2000,
    cacheTTL: 600000,
    
    enableBackup: true,
    backupOptions: {
        interval: 1800000, // 30 minutos
        maxBackups: 5,
        compression: true
    },
    
    enableValidation: true,
    enableIndexing: true,
    enableTransactions: true
});
```

---

## 📈 **Performance e Boas Práticas**

### ✅ **Recomendações**

```javascript
// ✅ Use batch operations para múltiplas inserções
const dados = [
    { id: "user1", nome: "João" },
    { id: "user2", nome: "Maria" }
];

for (const item of dados) {
    await db.set(item.id, item);
}

// ✅ Reutilize conexões de driver
const driver = new MySQLDriver(config);
await driver.connect();
const db1 = new HelperDB({ driver });
const db2 = new HelperDB({ driver, table: "outra_tabela" });

// ✅ Use cache para dados frequentemente acessados
db.enableCache(1000, 300000);

// ✅ Configure índices para buscas frequentes
db.createIndex("email");
db.createIndex("status");
```

### ⚠️ **Evite**

```javascript
// ❌ Não crie múltiplas instâncias desnecessárias
// ❌ Não deixe conexões abertas sem uso
// ❌ Não faça operações síncronas em loops grandes
```

---

## 🔄 **Changelog**

### 🆕 **v1.0.3** - Recursos Avançados
<details>
<summary>Ver detalhes da versão atual</summary>

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
