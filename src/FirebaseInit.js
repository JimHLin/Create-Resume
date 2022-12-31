import { getDatabase, ref, child, push, update } from "firebase/database";
import { initializeApp } from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  // The value of `databaseURL` depends on the location of the database
  databaseURL: "https://resume-c3e28-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export default database;