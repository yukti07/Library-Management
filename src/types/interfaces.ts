export interface Book {
  id: string;
  title: string;
  author: string;
  copies?: number;
  availableCopies?: number;
  issuedTo: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  issuedBooks: string[];
}
