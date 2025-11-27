// Database Connection Pool for SQL Server
// Uses mssql package with raw SQL execution (NO ORM)

import sql from 'mssql';

const config = {
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_DATABASE || 'PortfolioDB',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

/**
 * Get or create SQL Server connection pool
 * @returns {Promise<sql.ConnectionPool>}
 */
export async function getPool() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('✓ Connected to SQL Server database');
    } catch (error) {
      console.error('✗ Database connection failed:', error.message);
      throw error;
    }
  }
  return pool;
}

/**
 * Execute a raw SQL query
 * @param {string} query - SQL query string
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise<sql.IResult>}
 */
export async function query(query, params = {}) {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error('Query execution error:', error.message);
    throw error;
  }
}

/**
 * Execute a stored procedure
 * @param {string} procedureName - Name of the stored procedure
 * @param {Object} params - Procedure parameters
 * @returns {Promise<sql.IResult>}
 */
export async function executeProc(procedureName, params = {}) {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Add parameters to request
    Object.keys(params).forEach(key => {
      request.input(key, params[key]);
    });
    
    const result = await request.execute(procedureName);
    return result;
  } catch (error) {
    console.error(`Stored procedure '${procedureName}' execution error:`, error.message);
    throw error;
  }
}

/**
 * Execute a scalar function
 * @param {string} functionName - Name of the function
 * @param {Object} params - Function parameters
 * @returns {Promise<any>}
 */
export async function executeFunction(functionName, params = {}) {
  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Build parameter list for function call
    const paramList = Object.keys(params)
      .map(key => {
        request.input(key, params[key]);
        return `@${key}`;
      })
      .join(', ');
    
    const query = `SELECT dbo.${functionName}(${paramList}) AS Result`;
    const result = await request.query(query);
    
    return result.recordset[0]?.Result;
  } catch (error) {
    console.error(`Function '${functionName}' execution error:`, error.message);
    throw error;
  }
}

/**
 * Close database connection pool
 */
export async function closePool() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection pool closed');
  }
}

// Export sql types for use in other files
export { sql };
