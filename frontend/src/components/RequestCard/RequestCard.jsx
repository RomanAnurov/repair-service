// frontend/src/components/RequestCard/RequestCard.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RequestCard.module.scss';
import Button from '../Button/Button';

export default function RequestCard({ 
  request, 
  onAssign, 
  onTake, 
  onComplete,
  currentUser 
}) {
  // ✅ React state для выбора мастера (вместо document.querySelector)
  const [selectedMaster, setSelectedMaster] = useState('');

  const statusColors = {
    new: 'warning',
    assigned: 'primary',
    in_progress: 'success',
    done: 'secondary',
    canceled: 'danger'
  };

  const statusLabels = {
    new: '🆕 Новая',
    assigned: '📋 Назначена',
    in_progress: '🔧 В работе',
    done: '✅ Завершена',
    canceled: '❌ Отменена'
  };

  const handleAssignClick = () => {
    if (selectedMaster) {
      onAssign?.(request.id, parseInt(selectedMaster));
      setSelectedMaster(''); // Сброс после назначения
    }
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.clientName}>{request.clientName}</h3>
        <span className={`${styles.status} ${styles[request.status]}`}>
          {statusLabels[request.status]}
        </span>
      </header>
      
      <div className={styles.body}>
        <p className={styles.address}>📍 {request.address}</p>
        <p className={styles.phone}>📞 {request.phone}</p>
        <p className={styles.problem}>{request.problemText}</p>
        
        {request.master && (
          <p className={styles.assigned}>
            👷 Мастер: {request.master.name}
          </p>
        )}
      </div>
      
      <footer className={styles.footer}>
        {/* ✅ Диспетчер: выбор мастера + кнопка */}
        {currentUser === 'dispatcher' && request.status === 'new' && (
          <div className={styles.assignWrapper}>
            <select
              className={styles.masterSelect}
              value={selectedMaster}
              onChange={(e) => setSelectedMaster(e.target.value)}
            >
              <option value="" disabled>Выберите мастера</option>
              <option value="2">🔧 master1</option>
              <option value="3">🔧 master2</option>
            </select>
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleAssignClick}
              disabled={!selectedMaster}
            >
              Назначить
            </Button>
          </div>
        )}
        
        {/* ✅ Мастер: взять в работу */}
        {currentUser?.startsWith('master') && 
         request.status === 'assigned' && 
         request.assignedTo === (currentUser === 'master1' ? 2 : 3) && (
          <Button 
            variant="success" 
            size="sm"
            onClick={() => onTake?.(request.id)}
          >
            ✅ Взять в работу
          </Button>
        )}
        
        {/* ✅ Мастер: завершить */}
        {currentUser?.startsWith('master') && 
         request.status === 'in_progress' && 
         request.assignedTo === (currentUser === 'master1' ? 2 : 3) && (
          <Button 
            variant="success" 
            size="sm"
            onClick={() => onComplete?.(request.id)}
          >
            🎉 Завершить
          </Button>
        )}
      </footer>
    </article>
  );
}

RequestCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    clientName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    problemText: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    assignedTo: PropTypes.number,
    master: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired,
  onAssign: PropTypes.func,
  onTake: PropTypes.func,
  onComplete: PropTypes.func,
  currentUser: PropTypes.string
};