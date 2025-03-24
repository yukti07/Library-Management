import { useState } from 'react';
import { Book } from '../types/interfaces';

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string>('');
  const [newBook, setNewBook] = useState<Omit<Book, 'id' | 'issuedTo'>>({
    title: '',
    author: '',
    copies: undefined,
    availableCopies: undefined
  });

  const addBook = () => {
    setError('');
    if (!newBook.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!newBook.author.trim()) {
      setError('Author is required');
      return;
    }
    if (!newBook.copies || isNaN(newBook.copies) || newBook.copies <= 0) {
      setError('Number of copies must be greater than 0');
      return;
    }

    const book: Book = {
      ...newBook,
      id: Date.now().toString(),
      issuedTo: [],
      availableCopies: newBook.copies
    };
    setBooks([...books, book]);
    setNewBook({ title: '', author: '', copies: undefined, availableCopies: undefined });
  };

  const deleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
  };

  return (
    <div>
      <h2>Books Management</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <div className="input-group">
        <input
          type="text"
          value={newBook.title}
          onChange={(e) => setNewBook({...newBook, title: e.target.value})}
          placeholder="Book Title"
          required
        />
        <input
          type="text"
          value={newBook.author}
          onChange={(e) => setNewBook({...newBook, author: e.target.value})}
          placeholder="Author Name"
          required
        />
        <input
          type="number"
          value={newBook.copies || ''}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value) : undefined;
            setNewBook({...newBook, copies: value, availableCopies: value});
          }}
          placeholder="Number of Copies"
          required
          min="1"
        />
        <button onClick={addBook}>Add Book</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Total Copies</th>
            <th>Available</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.copies}</td>
              <td>{book.availableCopies}</td>
              <td>{(book.availableCopies ?? 0) > 0 ? 'Available' : 'All Issued'}</td>
              <td>
                <button 
                  onClick={() => deleteBook(book.id)}
                  style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
