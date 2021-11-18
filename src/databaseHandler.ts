import { openDB } from 'idb'
import { Entry } from './models';

const DATABASE_NAME = "RENTALZDB";

initDB().then(() => {
  console.log('database initialize!')
})


async function initDB() {
  const db = await openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore('entry', {
        // The 'id' property of the object will be the key.
        keyPath: 'id',
        // If it isn't explicitly set, create a value by auto incrementing.
        autoIncrement: true,
      });
    },
  });
}

export async function insertEntry(entry: Entry) {
  const db = await openDB(DATABASE_NAME, 1)
  const tx = db.transaction('entry', 'readwrite');
  const store = tx.objectStore('entry');
  await store.put(entry)
}

export async function getAllEntries() {
  const db = await openDB(DATABASE_NAME, 1);
  var cursor = await db.transaction("entry").objectStore("entry").openCursor();
  var entries = [];
  while (cursor) {
    entries.push(cursor.value);
    cursor = await cursor.continue();
  }
  return entries
}

export async function getEntryById(id: number) {
  const db = await openDB(DATABASE_NAME, 1);
  const ent = db.transaction("entry").objectStore("entry").get(id);
  return ent;
}

export async function deleteEntry(id: number) {
  const db = await openDB(DATABASE_NAME, 1);
  await db.delete("entry", id)
}

export async function updateEntry(entryToUpdate:Entry) {
  const db = await openDB(DATABASE_NAME, 1);
  const ent = await db.transaction("entry").objectStore("entry").get(entryToUpdate.id!) as Entry
  ent.property = entryToUpdate.property
  ent.bedroom = entryToUpdate.bedroom
  ent.date =entryToUpdate.date
  ent.price = entryToUpdate.price
  ent.furniture = entryToUpdate.furniture
  ent.note = entryToUpdate.note
  ent.reporter = entryToUpdate.reporter
  await db.put("entry",ent);
}

