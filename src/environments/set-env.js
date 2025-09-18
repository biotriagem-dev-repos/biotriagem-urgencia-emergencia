const fs = require('fs')
const path = require('path')
require('dotenv').config()

const envFile = `
export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: '${process.env['API_KEY'] || ''}',
    authDomain: '${process.env['AUTH_DOMAIN'] || ''}',
    projectId: '${process.env['PROJECT_ID'] || ''}',
    storageBucket: '${process.env['STORAGE_BUCKET'] || ''}',
    messagingSenderId: '${process.env['MESSAGING_SENDER_ID'] || ''}',
    appId: '${process.env['APP_ID'] || ''}',
    measurementId: '${process.env['MEASUREMENT_ID'] || ''}',
  },
  gptKey: '${process.env['GPT_KEY'] || ''}',
};
`

const targetPath = path.join(__dirname, 'environment.production.ts')
fs.writeFileSync(targetPath, envFile)

console.log(`Environment file generated at ${targetPath}`)
