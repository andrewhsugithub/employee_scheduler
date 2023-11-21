import * as SQLite from "expo-sqlite";

function openDatabase(dbURL: string) {
  const db = SQLite.openDatabase(dbURL);
  return db;
}

export const db = openDatabase("trip.db");
