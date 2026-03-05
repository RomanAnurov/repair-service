import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dispatcher from './pages/Dispatcher/Dispatcher';
import Master from './pages/Master/Master';
import styles from './App.module.scss';

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dispatcher" element={<Dispatcher />} />
          <Route path="/master" element={<Master />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}