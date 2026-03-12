const { Pool } = require('pg');

function getConnectionString() {
  // Neon/Vercel normalmente expõe uma dessas variáveis
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

function shouldUseSsl(connectionString) {
  if (!connectionString) return false;
  // No Neon, SSL é obrigatório (em geral já vem com sslmode=require na URL)
  return connectionString.includes('neon.tech') || connectionString.includes('sslmode=require');
}

function convertMysqlPlaceholdersToPg(sql) {
  // Converte "?" -> "$1", "$2", ... (suficiente para os SQLs simples deste projeto)
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

const connectionString = getConnectionString();

if (!connectionString) {
  console.warn(
    'AVISO: nenhuma string de conexão encontrada. Defina DATABASE_URL (ou POSTGRES_URL) para usar o Postgres/Neon.'
  );
}

const pool = new Pool({
  connectionString,
  ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined
});

// Adapter para manter a mesma interface usada no controller (db.query(sql, params, cb))
const db = {
  query(sql, params, cb) {
    if (typeof params === 'function') {
      cb = params;
      params = [];
    }

    const pgSql = convertMysqlPlaceholdersToPg(sql);

    pool
      .query(pgSql, params)
      .then((result) => {
        const isSelect = /^\s*select\b/i.test(sql);

        if (isSelect) {
          cb(null, result.rows);
          return;
        }

        cb(null, {
          affectedRows: result.rowCount,
          insertId: result.rows && result.rows[0] && result.rows[0].id
        });
      })
      .catch((err) => cb(err));
  }
};

module.exports = db;