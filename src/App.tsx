import { useState } from 'react'
import './App.css'
import BooksManagement from './components/BooksManagement'
import UsersManagement from './components/UsersManagement'

function App() {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <>
      <h1>Library Management System</h1>
      <div className="navigation">
        <button 
          className={activeTab === 'books' ? 'active' : ''} 
          onClick={() => setActiveTab('books')}
        >
          Books
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>
      <div className="content">
        {activeTab === 'books' ? <BooksManagement /> : <UsersManagement />}
      </div>
    </>
  )
}

export default App
