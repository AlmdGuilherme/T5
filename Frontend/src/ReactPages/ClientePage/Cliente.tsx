import { Link, useParams } from 'react-router-dom'
import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import type { ClienteData } from '../../types/ClienteTypes'
import { ClientesApi } from '../../Services/ClienteServices'

export default function ClientePage(){
  const { id } = useParams<{ id: string }>()
  const [cliente, setCliente] = useState<ClienteData|null>(null)

  useEffect(() => {
    const fetchClienteData = async () => {
      if (id) {
        const fetchedCliente = await ClientesApi.getClienteById(Number(id))
        if (fetchedCliente) {
          setCliente(fetchedCliente)
        } else {
          console.error(`Não foi possível carregar o cliente com ID: ${id}`)
          setCliente(null)
        }
      }
    }
    fetchClienteData()
  }, [id])

  if (!cliente) {
    return (
      <section className={styles.client_main}>
        <Link to={'/'}>&#10229; Voltar</Link>
        <h3>Carregando informações do cliente ou cliente não encontrado...</h3>
      </section>
    )
  }

  return (
    <>
      <section className={styles.client_main}>
        <Link to={'/'}>&#10229; Voltar</Link>
        <h3>Informações do Cliente - WB</h3>
        <section className={styles.client_infos}>
          <h3>Informações Pessoais:</h3>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="Nome:">Nome:</label>
              <p>{cliente.cli_nome}</p>
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="Sobrenome:">Sobrenome:</label>
              <p>{cliente.cli_sobreNome}</p>
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="CPF:">CPF:</label>
              <p>{cliente.cli_cpf}</p>
            </section>
          </section>
          <section className={styles.infos_group}>
            {cliente.rgs && cliente.rgs.length > 0 ? (
              cliente.rgs.map((rg, index) => (
                <section className={styles.individual_infos} key={index}>
                  <label htmlFor={`RG-${index}:`}>RG:</label>
                  <p>{rg.rg_Value}</p>
                </section>
              ))
            ) : (
              <p>Nenhum RG cadastrado.</p>
            )}
          </section>
          <h3>Contato:</h3>
          <section className={styles.infos_group}>
            {cliente.telefones && cliente.telefones.length > 0 ? (
              cliente.telefones.map((telefone, index) => (
                <section className={styles.individual_infos} key={index}>
                  <label htmlFor={`Telefone-${index}:`}>Telefone:</label>
                  <p>({telefone.tel_ddd})-{telefone.tel_num}</p>
                </section>
              ))
            ) : (
              <p>Nenhum telefone cadastrado.</p>
            )}
          </section>
          <section className={styles.individual_infos}>
            <label htmlFor="Email:">Email:</label>
            <p>{cliente.emails && cliente.emails.length > 0 ? cliente.emails[0].email_value : 'Nenhum email cadastrado.'}</p>
          </section>

          {cliente.endereco && (
            <>
              <h3>Endereço:</h3>
              <section className={styles.infos_group}>
                <section className={styles.individual_infos}>
                  <label htmlFor="Estado:">Estado:</label>
                  <p>{cliente.endereco.end_estado}</p>
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor="Cidade:">Cidade:</label>
                  <p>{cliente.endereco.end_cidade}</p>
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor="Rua:">Rua:</label>
                  <p>{cliente.endereco.end_rua}</p>
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor="Bairro:">Bairro:</label>
                  <p>{cliente.endereco.end_bairro}</p>
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor="Número:">Número:</label>
                  <p>{cliente.endereco.end_numero}</p>
                </section>
              </section>
            </>
          )}

          <h3>Produtos consumidos:</h3>
          <table className={styles.consumed_infos}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {cliente.produtos && cliente.produtos.length > 0 ? (
                cliente.produtos.map((produto, index) => (
                  <tr key={index}>
                    <td>{produto.prod_name}</td>
                    <td>{produto.prod_value}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2}>Nenhum produto consumido.</td>
                </tr>
              )}
            </tbody>
          </table>
          <h3>Serviços consumidos:</h3>
          <table className={styles.consumed_infos}>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {cliente.servicos && cliente.servicos.length > 0 ? (
                cliente.servicos.map((servico, index) => (
                  <tr key={index}>
                    <td>{servico.serv_name}</td>
                    <td>{servico.serv_value}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2}>Nenhum serviço consumido.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </section>
    </>
  )
}