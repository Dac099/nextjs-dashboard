import sql from 'mssql';

// config();
// const isDevelopment: boolean = process.env.ENVIRONMENT === 'DEVELOPMENT';
// const sqlStringConnection: string = (isDevelopment ? process.env.CONNECTION_STRING_DEV : process.env.CONNECTION_STRING_PROD) as string;

const sqlConfig: sql.config = {
    user: 'sa',
    password: '3Spum422',
    database: 'Monday',
    server: 'localhost',
    options: {
        trustServerCertificate: true,
        encrypt: false,
    }
};

const connection: sql.ConnectionPool = new sql.ConnectionPool(sqlConfig);

export default connection; 