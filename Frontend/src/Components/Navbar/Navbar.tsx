import styles from './styles.module.css'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar(){
  const pageLink = useLocation()

  return (
    <>
      <nav className={styles.navbar}>
         <p>WB</p>
         <ul>
            <Link to={'/'} className={pageLink.pathname === '/' ? styles.active : styles.desativado}>
              Lista de Clientes
            </Link>
            <Link to={'/Lista-Filtros'} className={pageLink.pathname === '/Lista-Filtros' ? styles.active : styles.desativado}>
              Lista com Filtros
            </Link>
            <Link to={'/Cadastro-Clientes'} className={pageLink.pathname === '/Cadastro-Clientes' ? styles.active : styles.desativado}>
              Cadastrar Clientes
            </Link>
         </ul>
      </nav>
    </>
  )
}