import { useState } from 'react';
import { User } from '../types/interfaces';
import styles from './UsersManagement.module.css';  // Add this import

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'issuedBooks'>>({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<{name?: string; email?: string}>({});

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

  const addUser = () => {
    if (validateForm()) {
      const user: User = {
        ...newUser,
        id: Date.now().toString(),
        issuedBooks: []
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '' });
      setErrors({});
    }
  };

  return (
    <div>
      <h2>Patrons</h2>
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
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Books Issued</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.issuedBooks.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
