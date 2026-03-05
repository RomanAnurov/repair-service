import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/api';
import RequestCard from '@/components/RequestCard/RequestCard';
import Button from '@/components/Button/Button';
import styles from './Master.module.scss';

export default function Master() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = localStorage.getItem('currentUser');
  const masterId = currentUser === 'master1' ? 2 : 3;

  useEffect(() => {
    if (!currentUser || !currentUser.startsWith('master')) {
      navigate('/');
      return;
    }
    loadRequests();
  }, [currentUser, navigate]);

  const loadRequests = () => {
    setLoading(true);
    apiService.getRequests({ assignedTo: masterId })
      .then(res => setRequests(res.data))
      .catch(err => console.error('Failed to load requests:', err))
      .finally(() => setLoading(false));
  };

  const handleTake = async (requestId) => {
    try {
      await apiService.takeRequest(requestId, masterId);
      loadRequests();
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleComplete = async (requestId) => {
    try {
      await apiService.completeRequest(requestId, masterId);
      loadRequests();
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading && requests.length === 0) {
    return <div className={styles.loading}>Загрузка ваших заявок...</div>;
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>🔧 Панель мастера: {currentUser}</h1>
        <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
          🔙 Выйти
        </Button>
      </header>

      <div className={styles.list}>
        {requests.length === 0 ? (
          <p className={styles.empty}>У вас нет назначенных заявок</p>
        ) : (
          requests.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              currentUser={currentUser}
              onTake={handleTake}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </main>
  );
}