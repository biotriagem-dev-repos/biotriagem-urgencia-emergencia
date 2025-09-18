// export const environment = {
//   production: true,
//   firebaseConfig: {
//     apiKey: '__API_KEY__',
//     authDomain: '__AUTH_DOMAIN__',
//     projectId: '__PROJECT_ID__',
//     storageBucket: '__STORAGE_BUCKET__',
//     messagingSenderId: '__MESSAGING_SENDER_ID__',
//     appId: '__APP_ID__',
//     measurementId: '__MEASUREMENT_ID__',
//   },
//   gptKey: '__GPT_KEY__',
// }

export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: process.env['API_KEY'],
    authDomain: process.env['AUTH_DOMAIN'],
    projectId: process.env['PROJECT_ID'],
    storageBucket: process.env['STORAGE_BUCKET'],
    messagingSenderId: process.env['MESSAGING_SENDER_ID'],
    appId: process.env['APP_ID'],
    measurementId: process.env['MEASUREMENT_ID'],
  },
  gptKey: process.env['GPT_KEY'],
}
