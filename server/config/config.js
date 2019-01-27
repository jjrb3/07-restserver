
// ========================
//  Port
// ========================
process.env.PORT = process.env.PORT || 3000;


// ========================
//  Entorno
// ========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ========================
//  Vencimiento del Token
// ========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


// ========================
//  SEED
// ========================
process.env.SEED =  process.env.SEED || 'este-es-el-seed';


// ========================
//  Base de datos
// ========================
let urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb://cafe-user:JJrb333@ds127190.mlab.com:27190/cafe';

process.env.URLDB = urlDB;


// ========================
//  Google Client ID
// ========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '293326936209-dl7pbmvpi6ugbg5u0mb951fakmh6hlna.apps.googleusercontent.com';