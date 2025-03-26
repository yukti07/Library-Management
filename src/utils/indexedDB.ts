import { openDB } from 'idb';
import { User, Book } from '../types/interfaces';

const DB_NAME = 'LibraryDB';
const DB_VERSION = 1;
const USER_STORE = 'users';
const BOOK_STORE = 'books';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(USER_STORE)) {
      db.createObjectStore(USER_STORE, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(BOOK_STORE)) {
      db.createObjectStore(BOOK_STORE, { keyPath: 'id' });
    }
  },
});

export const addUser = async (user: User) => {
  const db = await dbPromise;
  await db.add(USER_STORE, user);
};

export const getUsers = async (): Promise<User[]> => {
  const db = await dbPromise;
  return db.getAll(USER_STORE);
};

export const addBook = async (book: Book) => {
  const db = await dbPromise;
  await db.add(BOOK_STORE, book);
};

export const getBooks = async (): Promise<Book[]> => {
  const db = await dbPromise;
  return db.getAll(BOOK_STORE);
};

export const deleteBook = async (id: string) => {
  const db = await dbPromise;
  await db.delete(BOOK_STORE, id);
};

export const updateBook = async (book: Book) => {
  const db = await dbPromise;
  await db.put(BOOK_STORE, book);
};

export const updateUser = async (user: User) => {
  const db = await dbPromise;
  await db.put(USER_STORE, user);
};

export const getBook = async (id: string): Promise<Book | undefined> => {
  const db = await dbPromise;
  return db.get(BOOK_STORE, id);
};

export const getUser = async (id: string): Promise<User | undefined> => {
  const db = await dbPromise;
  return db.get(USER_STORE, id);
};
