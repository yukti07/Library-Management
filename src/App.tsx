import { useState } from 'react'
import './App.css'
import BooksManagement from './components/BooksManagement'
import UsersManagement from './components/UsersManagement'
import Home from './components/Home'

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <div className="navigation">
        <button 
          className={activeTab === 'home' ? 'active' : ''} 
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button 
          className={activeTab === 'books' ? 'active' : ''} 
          onClick={() => setActiveTab('books')}
        >
          Catalogue
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Patrons
        </button>
      </div>
      <div className="content">
        {activeTab === 'home' && <Home />}
        {activeTab === 'books' && <BooksManagement />}
        {activeTab === 'users' && <UsersManagement />}
      </div>
    </>
  )
}

export default App
