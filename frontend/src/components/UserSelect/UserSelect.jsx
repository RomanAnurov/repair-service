import PropTypes from 'prop-types';
import styles from './UserSelect.module.scss';

export default function UserSelect({ users, onSelect, currentUser }) {
  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Выберите пользователя:</label>
      <div className={styles.list}>
        {users.map(user => (
          <button
            key={user.id}
            className={`${styles.userBtn} ${currentUser === user.name ? styles.active : ''}`}
            onClick={() => onSelect?.(user.name)}
          >
            <span className={styles.role}>{user.role === 'dispatcher' ? '👨‍💼' : '🔧'}</span>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.roleLabel}>
              {user.role === 'dispatcher' ? 'Диспетчер' : 'Мастер'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

UserSelect.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired
    })
  ).isRequired,
  onSelect: PropTypes.func,
  currentUser: PropTypes.string
};