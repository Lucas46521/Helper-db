
# 📚 Helper.DB Documentation

Bem-vindo à documentação oficial do Helper.DB! Esta documentação é gerada automaticamente a partir do código fonte usando TypeDoc.

## 🔗 Links Rápidos

- **[🏠 Página Principal](../README.md)** - README principal do projeto
- **[📖 API Reference](./modules.html)** - Documentação completa da API
- **[🚀 Quick Start](../README.md#-quick-start)** - Guia de início rápido
- **[📦 NPM Package](https://www.npmjs.com/package/helper.db)** - Pacote no NPM

## 📋 Estrutura da Documentação

### 🗄️ **Core Classes**
- **HelperDB** - Classe principal da biblioteca
- **Drivers** - SQLite, MySQL, MariaDB, MongoDB, JSON, Memory

### 🛠️ **Managers & Utilities**
- **CacheManager** - Sistema de cache inteligente
- **BackupManager** - Backup e restauração automática
- **SchemaValidator** - Validação de dados
- **TransactionManager** - Controle de transações
- **IndexManager** - Sistema de índices

### 🔍 **Search & Analytics**
- Métodos de busca avançada
- Operações estatísticas
- Agregações e análises

## 🔄 Atualização Automática

Esta documentação é atualizada automaticamente sempre que:
- ✅ Há um push na branch `main`
- ✅ Uma nova release é publicada
- ✅ O workflow é executado manualmente

## 🤝 Contribuindo

Para contribuir com a documentação:

1. **📝 Documente seu código** - Use JSDoc comments
2. **🔧 Execute localmente** - `npm run docgen`
3. **📤 Faça um PR** - A documentação será atualizada automaticamente

### Exemplo de Documentação

```typescript
/**
 * Busca registros que contêm um termo específico
 * @param term - Termo de busca
 * @param property - Propriedade a ser pesquisada (opcional)
 * @returns Promise com array de resultados
 * @example
 * ```typescript
 * const resultados = await db.search("João", "nome");
 * console.log(resultados); // [{ id: "user1", value: { nome: "João" } }]
 * ```
 */
async search(term: string, property?: string): Promise<SearchResult[]>
```

## 📊 Estatísticas da Documentação

- **Classes**: 15+
- **Métodos**: 50+
- **Interfaces**: 10+
- **Tipos**: 20+

---

**📖 Gerado automaticamente com TypeDoc • 💝 Helper.DB v1.4.0**
