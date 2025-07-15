import sql from 'mssql';
import { config } from 'dotenv';

config();
let sqlStringConnection: string | undefined;

switch (process.env.ENVIRONMENT) {
  case 'DEVELOPMENT':
    sqlStringConnection = process.env.CONNECTION_STRING_DEV as string;
    break;
  case 'PRODUCTION':
    sqlStringConnection = process.env.CONNECTION_STRING_PROD as string;
    break;
  case 'LOCAL':
    sqlStringConnection = process.env.CONNECTION_STRING_LOCAL as string;
    break;
  default:
    throw new Error('Invalid environment specified in .env file');
}
const connection: sql.ConnectionPool = new sql.ConnectionPool(sqlStringConnection);

export default connection; 
