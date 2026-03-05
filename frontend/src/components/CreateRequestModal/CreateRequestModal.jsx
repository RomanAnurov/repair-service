// frontend/src/components/CreateRequestModal/CreateRequestModal.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CreateRequestModal.module.scss';
import Button from '../Button/Button';

export default function CreateRequestModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    address: '',
    problemText: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      // Сброс формы после успешного создания
      setFormData({ clientName: '', phone: '', address: '', problemText: '' });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания заявки');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>📝 Новая заявка</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label>ФИО клиента *</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              placeholder="Иван Петров"
            />
          </div>

          <div className={styles.field}>
            <label>Телефон *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+79991234567"
            />
          </div>

          <div className={styles.field}>
            <label>Адрес *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="ул. Ленина, 10, кв. 5"
            />
          </div>

          <div className={styles.field}>
            <label>Описание проблемы *</label>
            <textarea
              name="problemText"
              value={formData.problemText}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Не работает розетка на кухне..."
            />
          </div>

          <footer className={styles.footer}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Создание...' : '✅ Создать заявку'}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}

CreateRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};