import * as SQLite from "expo-sqlite";

export const initialiseDb = async (dbName) => {
  const db = await SQLite.openDatabaseAsync(dbName);
  const init = new Promise((resolve, reject) => {
    db.transaction(
      function (tx) {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY NOT NULL, filename TEXT NOT NULL, uri TEXT NOT NULL, timestamp TEXT NOT NULL, lat REAL NOT NULL, long REAL NOT NULL)"
        );
      },
      function (error) {
        reject(error.message);
      },
      function () {
        resolve(true);
        console.log("Created database OK");
      }
    );
  });
  return init;
};

export const insertData = async (filename, uri, timestamp, lat, long) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO table_name (filename, uri, timestamp, lat, long) VALUES (?, ?, ?, ?, ?)",
      [filename, uri, timestamp, lat, long]
    );
  });
};
