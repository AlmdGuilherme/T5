import { Link } from 'react-router-dom'
import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import type { ClienteData } from '../../types/ClienteTypes'
import { ClientesApi } from '../../Services/ClienteServices'

function Home() {
  const [clientes, setClientes] = useState<ClienteData[] | null>(null)
  useEffect(() => {
    const fetchClientes = async () => {
      const fetchedClientes = await ClientesApi.getClientes();
      if (fetchedClientes) {
        setClientes(fetchedClientes);
      } else {
        console.log('Não foi possível carregar os clientes')
      }
    };
    fetchClientes()
  }, [])

  return (
    <>
      <section className={styles.home_main}>
        <h3>Lista de clientes - WB</h3>
        <section className={styles.client_list}>
          {clientes?.map(cliente => (
            <section className={styles.individual_client} key={cliente.cli_id}>
              <h4>{cliente.cli_nome}</h4>
              <section className={styles.client_infos}>
                <label htmlFor="Nome">Nome completo:</label>
                <p>{cliente.cli_nome} {cliente.cli_sobreNome}</p>
              </section>
              <section className={styles.client_infos}>
                <label htmlFor="CPF">CPF:</label>
                <p className={styles.client_cpf}>{cliente.cli_cpf}</p>
              </section>
              <section className={styles.client_infos}>
                <label htmlFor="Cidade">Cidade:</label>
                <p>{cliente.endereco?.end_cidade || 'N/A'}</p>
              </section>
              <section className={styles.client_actions}>
                <Link to={`/Cliente/${cliente.cli_id}`}>Ver mais</Link>
                <Link to={`/Atualizar-Cliente/${cliente.cli_id}`}>Editar</Link>
              </section>
            </section>
          ))}
        </section>
      </section>
    </>
  )
}

export default Home