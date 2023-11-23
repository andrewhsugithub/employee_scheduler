import * as SQLite from "expo-sqlite";

export const openDb = (dbURL: string) => {
  const db = SQLite.openDatabase(`${dbURL}`);

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL, 
        name VARCHAR(50) NOT NULL,
        description TEXT,
        startDate TEXT,
        endDate TEXT  
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL, 
        name VARCHAR(50) NOT NULL,
        trip_id VARCHAR(50),
        job_id VARCHAR(50),
        FOREIGN KEY (job_id) REFERENCES jobs(id)
        FOREIGN KEY (trip_id) REFERENCES trips(id)
      );`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS trips (
        id VARCHAR(50) PRIMARY KEY NOT NULL, 
        captain_id VARCHAR(50) NOT NULL,
        crew_id VARCHAR(50),
        success INTEGER,
        FOREIGN KEY (captain_id) REFERENCES employees(id),
        FOREIGN KEY (crew_id) REFERENCES employees(id)
      );`
    );
  });
  return db;
};
