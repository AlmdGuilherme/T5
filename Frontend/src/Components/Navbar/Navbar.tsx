import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './styles.module.css';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageLink = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      <nav className={styles.navbar}>
        <p>WB</p>

        <ul className={styles.navLinks}>
          <Link
            to="/"
            className={
              pageLink.pathname === '/' ? styles.active : styles.desativado
            }
          >
            Lista de Clientes
          </Link>
          <Link
            to="/Lista-Filtros"
            className={
              pageLink.pathname === '/Lista-Filtros'
                ? styles.active
                : styles.desativado
            }
          >
            Lista com Filtros
          </Link>
          <Link
            to="/Cadastro-Clientes"
            className={
              pageLink.pathname === '/Cadastro-Clientes'
                ? styles.active
                : styles.desativado
            }
          >
            Cadastrar Clientes
          </Link>
        </ul>

        <div className={styles.burgerMenu} onClick={toggleSidebar}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
      </nav>

      <div
        className={`${styles.sidebar} ${
          sidebarOpen ? styles.sidebarOpen : ''
        }`}
      >
        <div className={styles.closeButton} onClick={closeSidebar}>
          &times;
        </div>
        <ul>
          <Link to="/" onClick={closeSidebar} className={styles.desativado}>
            Lista de Clientes
          </Link>
          <Link
            to="/Lista-Filtros"
            onClick={closeSidebar}
            className={styles.desativado}
          >
            Lista com Filtros
          </Link>
          <Link
            to="/Cadastro-Clientes"
            onClick={closeSidebar}
            className={styles.desativado}
          >
            Cadastrar Clientes
          </Link>
        </ul>
      </div>
    </>
  );
}
