import * as SQLite from "expo-sqlite";

export const initialiseDb = async () => {
  const db = await SQLite.openDatabaseAsync("ImageGalleryAppToo", {
    useNewConnection: true,
  });

  const init = await db.withTransactionAsync(async () => {
    const res = await db.execAsync(
      "CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY NOT NULL, fileId TEXT NOT NULL, filename TEXT NOT NULL, uri TEXT NOT NULL, timestamp TEXT NOT NULL, lat REAL NOT NULL, long REAL NOT NULL)"
    );
  });
};

export const insertData = async (
  fileId,
  filename,
  uri,
  timestamp,
  lat,
  long
) => {
  const db = await SQLite.openDatabaseAsync("ImageGalleryAppToo", {
    useNewConnection: true,
  });

  const insert = await db.withTransactionAsync(async () => {
    const res = await db.runAsync(
      "INSERT INTO images (fileId,filename, uri, timestamp, lat, long) VALUES (?, ?, ?, ?, ?, ?)",
      [fileId, filename, uri, timestamp, lat, long]
    );
    console.log(res);
    return res;
  });
  return insert;
};

export const deleteData = async (id) => {
  const db = await SQLite.openDatabaseAsync("ImageGalleryAppToo", {
    useNewConnection: true,
  });

  const data = await db.withTransactionAsync(async () => {
    const res = await db.execAsync("DELETE FROM images WHERE id = ?", [id]);
    return res;
  });
  return data;
};

export const readData = async (id) => {
  const db = await SQLite.openDatabaseAsync("ImageGalleryAppToo", {
    useNewConnection: true,
  });

  const res = await db.getAllAsync("SELECT * FROM images WHERE fileId = ?", [
    id,
  ]);
  return res;
};
