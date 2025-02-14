import sql from 'mssql';
import { config } from 'dotenv';

config();
const isDevelopment: boolean = process.env.ENVIRONMENT === 'DEVELOPMENT';
const sqlStringConnection: string = (isDevelopment ? process.env.CONNECTION_STRING_DEV : process.env.CONNECTION_STRING_PROD) as string;

const connection: sql.ConnectionPool = new sql.ConnectionPool(sqlStringConnection);

export default connection; 