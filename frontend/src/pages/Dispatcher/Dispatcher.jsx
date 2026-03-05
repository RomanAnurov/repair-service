import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/api';
import RequestCard from '@/components/RequestCard/RequestCard';
import Button from '@/components/Button/Button';
import CreateRequestModal from '@/components/CreateRequestModal/CreateRequestModal';
import styles from './Dispatcher.module.scss';

export default function Dispatcher() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);  // ← Состояние модального окна
  const navigate = useNavigate();

  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    if (!currentUser || currentUser !== 'dispatcher') {
      navigate('/');
      return;
    }
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigate]);

  const loadRequests = (filterStatus) => {
    setLoading(true);
    const status = filterStatus !== undefined ? filterStatus : filter;
    const params = status === 'all' ? {} : { status };
    
    apiService.getRequests(params)
      .then(res => setRequests(res.data))
      .catch(err => console.error('Failed to load requests:', err))
      .finally(() => setLoading(false));
  };

  const handleAssign = async (requestId, masterId) => {
    try {
      await apiService.assignMaster(requestId, masterId);
      loadRequests();
    } catch (err) {
      alert('Ошибка назначения: ' + (err.response?.data?.error || err.message));
    }
  };

  // ← Обработчик создания заявки
  const handleCreateRequest = async (formData) => {
    await apiService.createRequest(formData);
    loadRequests();  // Перезагружаем список после создания
  };

  const filters = [
    { value: 'all', label: 'Все' },
    { value: 'new', label: '🆕 Новые' },
    { value: 'assigned', label: '📋 Назначенные' },
    { value: 'in_progress', label: '🔧 В работе' },
    { value: 'done', label: '✅ Завершённые' }
  ];

  if (loading && requests.length === 0) {
    return <div className={styles.loading}>Загрузка заявок...</div>;
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>📋 Панель диспетчера</h1>
        <div className={styles.headerActions}>
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
            ➕ Создать заявку
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
            🔙 Выйти
          </Button>
        </div>
      </header>

      <div className={styles.filters}>
        {filters.map(f => (
          <button
            key={f.value}
            className={`${styles.filterBtn} ${filter === f.value ? styles.active : ''}`}
            onClick={() => {
              setFilter(f.value);
              loadRequests(f.value);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {requests.length === 0 ? (
          <p className={styles.empty}>Заявок не найдено</p>
        ) : (
          requests.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              currentUser="dispatcher"
              onAssign={handleAssign}
            />
          ))
        )}
      </div>

      {/* ← Модальное окно создания заявки */}
      <CreateRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRequest}
      />
    </main>
  );
}