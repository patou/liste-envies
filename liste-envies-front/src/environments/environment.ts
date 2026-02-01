// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  /*firebaseConfig: {
    apiKey: 'AIzaSyAF9dNJPzt0cu8azSICko5XnyiosM1YQL8',
    authDomain: 'liste-envies.firebaseapp.com',
    databaseURL: 'https://liste-envies.firebaseio.com',
    projectId: 'liste-envies',
    storageBucket: 'liste-envies.appspot.com',
    messagingSenderId: '783555297093'
  }*/
  firebaseConfig: {
    apiKey: "AIzaSyBNWwcACaC1d8tpWmLZGdO48u3MVq8vx2M",
    authDomain: "test-liste-envies.firebaseapp.com",
    databaseURL: "https://test-liste-envies.firebaseio.com",
    projectId: "test-liste-envies",
    storageBucket: "test-liste-envies.firebasestorage.app",
    messagingSenderId: "424684618174",
    appId: "1:424684618174:web:a300cf545f9f87b7cd79ef"
  },
  hmr: false
};
