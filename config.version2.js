// Version 2 Secret Santa Configuration (2 giftees per santa)
module.exports = {
  appTitle: 'Leinert Family Secret Santa',
  gifteesPerSanta: 2,
  collectionName: 'leinert-santas', // Different collection for separate data

  // Firebase Configuration (same as default - shared Firebase project)
  firebase: {
    apiKey: 'AIzaSyCRw9sh1OmWJTL_b2HDeQXEbBDSpsz9F_w',
    authDomain: 'secret-santa-e3f0f.firebaseapp.com',
    databaseURL: 'https://secret-santa-e3f0f.firebaseio.com',
    projectId: 'secret-santa-e3f0f',
    storageBucket: 'secret-santa-e3f0f.appspot.com',
    messagingSenderId: '1050830077055',
    appId: '1:1050830077055:web:ddf62bc6fe809d3b09534a',
    measurementId: 'G-2JEGNHVQ8B',
  },
};
