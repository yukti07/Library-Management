import { useState, useEffect } from 'react';
import { Book } from '../types/interfaces';
import styles from './BooksManagement.module.css';
import { Search, BookPlus, ClipboardCheck } from "lucide-react";
import { addBook as addBookToDB, getBooks as getBooksFromDB, deleteBook as deleteBookFromDB } from '../utils/indexedDB';

type View = 'find' | 'add' | 'issue';

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentView, setCurrentView] = useState<View>('find');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string>('');
  const [newBook, setNewBook] = useState<Omit<Book, 'id' | 'issuedTo'>>({
    title: '',
    author: '',
    copies: undefined,
    availableCopies: undefined
  });

  useEffect(() => {
    const fetchBooks = async () => {
      const booksFromDB = await getBooksFromDB();
      setBooks(booksFromDB);
    };
    fetchBooks();
  }, []);

  const addBook = async () => {
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
    await addBookToDB(book);
    setBooks([...books, book]);
    setNewBook({ title: '', author: '', copies: undefined, availableCopies: undefined });
  };

  const deleteBook = async (id: string) => {
    await deleteBookFromDB(id);
    setBooks(books.filter(book => book.id !== id));
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderActionPanel = () => {
    switch(currentView) {
      case 'find':
        return (
          <div className={styles.searchBar}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or author..."
            />
          </div>
        );
      case 'add':
        return (
          <div className={styles.form}>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <div className={styles.inputGroup}>
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
            </div>
            <button onClick={addBook}>Add Book</button>
          </div>
        );
      case 'issue':
        return (
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Enter Book ID"
            />
            <input
              type="text"
              placeholder="Enter User ID"
            />
            <button>Issue Book</button>
          </div>
        );
    }
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.actionTiles}>
        <div 
          className={`${styles.tile} ${currentView === 'find' ? styles.active : ''}`}
          onClick={() => setCurrentView('find')}
        >
          <Search size={50} className="text-gray-700" />
          <span>Find Book</span>
        </div>
        <div 
          className={`${styles.tile} ${currentView === 'add' ? styles.active : ''}`}
          onClick={() => setCurrentView('add')}
        >
          <BookPlus size={50} className="text-green-500" />
          <span>Add Book</span>
        </div>
        <div 
          className={`${styles.tile} ${currentView === 'issue' ? styles.active : ''}`}
          onClick={() => setCurrentView('issue')}
        >
          <ClipboardCheck size={50} className="text-blue-500" />
          <span>Issue Book</span>
        </div>
      </div>

      {renderActionPanel()}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Total Copies</th>
              <th>Available</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.emptyMessage}>
                  No books available in the catalogue
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.copies}</td>
                  <td>{book.availableCopies}</td>
                  <td className={styles.statusCell}>
                    <span className={(book.availableCopies ?? 0) > 0 ? styles.availableStatus : styles.unavailableStatus}>
                      {(book.availableCopies ?? 0) > 0 ? 'Available' : 'All Issued'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button 
                        onClick={() => deleteBook(book.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                      {(book.availableCopies ?? 0) > 0 && (
                        <button 
                          onClick={() => setCurrentView('issue')}
                          className={styles.issueButton}
                        >
                          Issue
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
