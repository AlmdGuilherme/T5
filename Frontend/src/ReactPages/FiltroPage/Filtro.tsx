import { useState } from 'react';
import styles from './styles.module.css';

type Cliente = {
  cli_id: number;
  cli_nome: string;
  cli_cpf: string;
  produtos?: ProdutoServico[];
  servicos?: ProdutoServico[];
  valorTotal?: number;
};

type ProdutoServico = {
  nome: string;
  quantidade: number;
};

type GeneroStats = {
  genero: string;
  total: number;
};

export default function FiltroPage() {
  const [filtro, setFiltro] = useState('');
  const [dados, setDados] = useState<(Cliente | ProdutoServico | GeneroStats)[]>([]);
  const [titulo, setTitulo] = useState('');

  const aplicarFiltro = async () => {
    let rota = '';
    let tituloFiltro = '';

    switch (filtro) {
      case 'moreProd':
        rota = '/filtro/mais-produtos';
        tituloFiltro = 'Clientes que mais consumiram produtos';
        break;
      case 'moreServ':
        rota = '/filtro/mais-servicos';
        tituloFiltro = 'Clientes que mais consumiram serviços';
        break;
      case 'lessProd':
        rota = '/filtro/menos-produtos';
        tituloFiltro = 'Clientes que menos consumiram produtos';
        break;
      case 'lessServ':
        rota = '/filtro/menos-servicos';
        tituloFiltro = 'Clientes que menos consumiram serviços';
        break;
      case 'consumeValue':
        rota = '/filtro/maior-valor';
        tituloFiltro = 'Clientes que mais consumiram por valor';
        break;
      case 'moreConsumedProd':
        rota = '/filtro/produtos-mais-consumidos';
        tituloFiltro = 'Produtos mais consumidos';
        break;
      case 'moreConsumedServ':
        rota = '/filtro/servicos-mais-consumidos';
        tituloFiltro = 'Serviços mais consumidos';
        break;
      case 'genderClients':
        rota = '/filtro/por-genero';
        tituloFiltro = 'Total de clientes por gênero';
        break;
      default:
        return;
    }

    try {
      const res = await fetch(`http://localhost:3000${rota}`);
      const json = await res.json();
      setDados(json);
      setTitulo(tituloFiltro);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  return (
    <section className={styles.filtro_main}>
      <section className={styles.buttonsFilter}>
        <section className={styles.filterOptions}>
          <label htmlFor="filtro_option">Opções do Filtro:</label>
          <select id="filtro_option" onChange={(e) => setFiltro(e.target.value)}>
            <option value="">Selecione</option>
            <option value="moreProd">10 clientes que mais consumiram produtos</option>
            <option value="moreServ">10 clientes que mais consumiram serviços</option>
            <option value="lessProd">10 clientes que menos consumiram produtos</option>
            <option value="lessServ">10 clientes que menos consumiram serviços</option>
            <option value="consumeValue">5 clientes que mais consumiram por valor</option>
            <option value="moreConsumedProd">Produtos mais consumidos</option>
            <option value="moreConsumedServ">Serviços mais consumidos</option>
            <option value="genderClients">Gênero</option>
          </select>
        </section>
        <button onClick={aplicarFiltro}>Filtrar</button>
      </section>

      <h3>{titulo}</h3>

      <table className={styles.informations}>
        <thead>
          <tr>
            {filtro === 'genderClients' && (
              <>
                <th>Gênero</th>
                <th>Total</th>
              </>
            )}

            {(filtro === 'moreConsumedProd' || filtro === 'moreConsumedServ') && (
              <>
                <th>Nome</th>
                <th>Quantidade</th>
              </>
            )}

            {filtro !== 'genderClients' &&
              filtro !== 'moreConsumedProd' &&
              filtro !== 'moreConsumedServ' && (
                <>
                  <th>Nome</th>
                  <th>CPF</th>
                  {filtro === 'consumeValue' && <th>Valor Total (R$)</th>}
                  {(filtro === 'moreProd' || filtro === 'lessProd') && <th>Produtos</th>}
                  {(filtro === 'moreServ' || filtro === 'lessServ') && <th>Serviços</th>}
                </>
              )}
          </tr>
        </thead>
        <tbody>
          {dados.map((item: Cliente | ProdutoServico | GeneroStats, index: number) => {
            if (filtro === 'genderClients') {
              if ('genero' in item && 'total' in item) {
                const g: GeneroStats = item;
                return (
                  <tr key={index}>
                    <td>{g.genero}</td>
                    <td>{g.total}</td>
                  </tr>
                );
              }
              return null;
            }

            if (filtro === 'moreConsumedProd' || filtro === 'moreConsumedServ') {
              if ('nome' in item && 'quantidade' in item) {
                const ps: ProdutoServico = item;
                return (
                  <tr key={index}>
                    <td>{ps.nome}</td>
                    <td>{ps.quantidade}</td>
                  </tr>
                );
              }
              return null;
            }

            if (
              typeof item === 'object' &&
              item !== null &&
              'cli_id' in item &&
              'cli_nome' in item &&
              'cli_cpf' in item
            ) {
              const c = item as Cliente;
              return (
                <tr key={c.cli_id}>
                  <td>{c.cli_nome}</td>
                  <td>{c.cli_cpf}</td>
                  {filtro === 'consumeValue' && <td>{c.valorTotal?.toFixed(2)}</td>}
                  {(filtro === 'moreProd' || filtro === 'lessProd') && <td>{c.produtos?.length}</td>}
                  {(filtro === 'moreServ' || filtro === 'lessServ') && <td>{c.servicos?.length}</td>}
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
    </section>
  );
}