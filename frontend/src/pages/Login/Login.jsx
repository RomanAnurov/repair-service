import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/api';
import UserSelect from '@/components/UserSelect/UserSelect';
import styles from './Login.module.scss';

export default function Login() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getUsers()
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error('Failed to load users:', err);
        setError('Не удалось загрузить пользователей');
        // Fallback data for demo
        setUsers([
          { id: 1, name: 'dispatcher', role: 'dispatcher' },
          { id: 2, name: 'master1', role: 'master' },
          { id: 3, name: 'master2', role: 'master' }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (userName) => {
    localStorage.setItem('currentUser', userName);
    const route = userName === 'dispatcher' ? '/dispatcher' : '/master';
    navigate(route);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>🛠️ Ремонтная служба</h1>
          <p>Выберите пользователя для входа</p>
        </header>
        
        {error && <p className={styles.error}>{error}</p>}
        
        <UserSelect 
          users={users} 
          onSelect={handleSelect}
        />
        
       
      </div>
    </main>
  );
}