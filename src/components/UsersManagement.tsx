import { useState, useEffect } from 'react';
import { User } from '../types/interfaces';
import styles from './UsersManagement.module.css';
import { Search, UserPlus } from "lucide-react";
import { addUser as addUserToDB, getUsers as getUsersFromDB } from '../utils/indexedDB';
import { generateUserId } from '../utils/idGenerator';

type View = 'find' | 'add';

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentView, setCurrentView] = useState<View>('find');
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'issuedBooks'>>({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<{name?: string; email?: string}>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const usersFromDB = await getUsersFromDB();
      setUsers(usersFromDB);
    };
    fetchUsers();
  }, []);

  const validateForm = () => {
    const newErrors: {name?: string; email?: string} = {};
    
    if (!newUser.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!newUser.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = 'Invalid email format';
    } else if (users.some(user => user.email === newUser.email.trim())) {
      newErrors.email = 'Email already exists';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addUser = async () => {
    if (validateForm()) {
      const user: User = {
        ...newUser,
        id: generateUserId(),
        issuedBooks: []
      };
      await addUserToDB(user);
      setUsers([...users, user]);
      setNewUser({ name: '', email: '' });
      setErrors({});
    }
  };

  const renderActionPanel = () => {
    switch(currentView) {
      case 'find':
        return (
          <div className={styles.searchBar}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
            />
          </div>
        );
      case 'add':
        return (
          <div className={styles['input-group']}>
            <div className={styles['input-container']}>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => {
                  setNewUser({...newUser, name: e.target.value});
                  setErrors({...errors, name: undefined});
                }}
                placeholder="User Name"
                className={errors.name ? styles.error : ''}
              />
              {errors.name && <span className={styles['error-message']}>{errors.name}</span>}
            </div>
            <div className={styles['input-container']}>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => {
                  setNewUser({...newUser, email: e.target.value});
                  setErrors({...errors, email: undefined});
                }}
                placeholder="Email"
                className={errors.email ? styles.error : ''}
              />
              {errors.email && <span className={styles['error-message']}>{errors.email}</span>}
            </div>
            <button onClick={addUser}>Add User</button>
          </div>
        );
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.actionTiles}>
        <div 
          className={`${styles.tile} ${currentView === 'find' ? styles.active : ''}`}
          onClick={() => setCurrentView('find')}
        >
          <Search size={50} className="text-gray-700" />
          <span>Find User</span>
        </div>
        <div 
          className={`${styles.tile} ${currentView === 'add' ? styles.active : ''}`}
          onClick={() => setCurrentView('add')}
        >
          <UserPlus size={50} className="text-green-500" />
          <span>Add User</span>
        </div>
      </div>

      {renderActionPanel()}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Books Issued</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.emptyMessage}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.issuedBooks.length}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
