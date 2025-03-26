export interface Book {
  id: string;
  title: string;
  author: string;
  copies?: number;
  availableCopies?: number;
  issuedTo: string[];
}

export interface IssuedBookRecord {
  bookId: string;
  copies: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  issuedBooks: IssuedBookRecord[];
}
