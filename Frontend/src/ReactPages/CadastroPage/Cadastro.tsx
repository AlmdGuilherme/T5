import { useState } from 'react';
import styles from './styles.module.css';
import { ClientesApi } from '../../Services/ClienteServices';
import type { ClienteData } from '../../types/ClienteTypes';

// As interfaces locais para os dados do formulário podem continuar como estão,
// pois elas representam o estado local do componente.
// A transformação para o tipo ClienteData ocorrerá no handleSubmit.
interface RgData {
  rg_value: string;
  rg_date: string;
}

interface TelefoneData {
  tel_ddd: string;
  tel_num: string;
}

interface EmailData {
  email_value: string;
}

interface ProdutoData {
  prod_name: string;
  prod_value: string;
}

interface ServicoData {
  serv_name: string;
  serv_value: string;
}

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [sobreNome, setSobreNome] = useState('');
  const [genero, setGenero] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataEmissaoCpf, setDataEmissaoCpf] = useState('');

  const [rgs, setRgs] = useState<RgData[]>([{ rg_value: '', rg_date: '' }]);
  const [telefones, setTelefones] = useState<TelefoneData[]>([{ tel_ddd: '', tel_num: '' }]);
  const [emails, setEmails] = useState<EmailData[]>([{ email_value: '' }]);

  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');

  const [produtos, setProdutos] = useState<ProdutoData[]>([{ prod_name: '', prod_value: '' }]);
  const [servicos, setServicos] = useState<ServicoData[]>([{ serv_name: '', serv_value: '' }]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRgChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newRgs = [...rgs];
    newRgs[index] = { ...newRgs[index], [e.target.name]: e.target.value };
    setRgs(newRgs);
  };

  const handleTelefoneChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newTelefones = [...telefones];
    newTelefones[index] = { ...newTelefones[index], [e.target.name]: e.target.value };
    setTelefones(newTelefones);
  };

  const handleEmailChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmails = [...emails];
    newEmails[index] = { ...newEmails[index], [e.target.name]: e.target.value };
    setEmails(newEmails);
  };

  const handleProdutoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newProdutos = [...produtos];
    newProdutos[index] = { ...newProdutos[index], [e.target.name]: e.target.value };
    setProdutos(newProdutos);
  };

  const handleServicoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newServicos = [...servicos];
    newServicos[index] = { ...newServicos[index], [e.target.name]: e.target.value };
    setServicos(newServicos);
  };

  const addRg = () => {
    setRgs([...rgs, { rg_value: '', rg_date: '' }]);
  };

  const addTelefone = () => {
    setTelefones([...telefones, { tel_ddd: '', tel_num: '' }]);
  };

  const addEmail = () => {
    setEmails([...emails, { email_value: '' }]);
  };

  const addProduto = () => {
    setProdutos([...produtos, { prod_name: '', prod_value: '' }]);
  };

  const addServico = () => {
    setServicos([...servicos, { serv_name: '', serv_value: '' }]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    // Função para limpar e analisar float, tratando vírgula e valores inválidos
    const cleanAndParseFloat = (value: string) => {
      const cleanedValue = value.replace(',', '.');
      const parsed = parseFloat(cleanedValue);
      return isNaN(parsed) ? 0 : parsed;
    };

    const clienteData: ClienteData = {
      cli_nome: nome,
      cli_sobreNome: sobreNome,
      cli_cpf: cpf,
      cpf_date: dataEmissaoCpf ? new Date(dataEmissaoCpf) : new Date(), // Garante que sempre será um Date
      cli_gender: genero,
      rgs: rgs
        .filter(rg => rg.rg_value && rg.rg_date)
        .map(rg => ({
          rg_Value: rg.rg_value,
          rg_date: new Date(rg.rg_date),
        })),
      telefones: telefones
        .filter(tel => tel.tel_ddd && tel.tel_num)
        .map(tel => ({
          tel_ddd: tel.tel_ddd,
          tel_num: tel.tel_num
        })),
      emails: emails
        .filter(email => email.email_value)
        .map(email => ({
          email_value: email.email_value
        })),
      servicos: servicos
        .filter(serv => serv.serv_name && serv.serv_value)
        .map(serv => ({
          serv_name: serv.serv_name,
          serv_value: cleanAndParseFloat(serv.serv_value).toFixed(2) // Reaplicar a formatação
        })),
      produtos: produtos
        .filter(prod => prod.prod_name && prod.prod_value)
        .map(prod => ({
          prod_name: prod.prod_name,
          prod_value: cleanAndParseFloat(prod.prod_value).toFixed(2) // Reaplicar a formatação
        })),
      endereco: {
        end_estado: estado,
        end_cidade: cidade,
        end_rua: rua,
        end_bairro: bairro,
        end_numero: numero
      }
    };

    try {
      const success = await ClientesApi.cadastrarClientes(clienteData);
      if (success) {
        setMessage('Cliente cadastrado com sucesso!');
        setIsSuccess(true);
        setNome('');
        setSobreNome('');
        setGenero('');
        setCpf('');
        setDataEmissaoCpf('');
        setRgs([{ rg_value: '', rg_date: '' }]);
        setTelefones([{ tel_ddd: '', tel_num: '' }]);
        setEmails([{ email_value: '' }]);
        setEstado('');
        setCidade('');
        setRua('');
        setNumero('');
        setBairro('');
        setProdutos([{ prod_name: '', prod_value: '' }]);
        setServicos([{ serv_name: '', serv_value: '' }]);
      } else {
        setMessage('Erro ao cadastrar cliente. Tente novamente.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setMessage('Ocorreu um erro inesperado ao cadastrar o cliente.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className={styles.cadastro_main}>
        <h3>Cadastro de clientes - WB</h3>
        <form className={styles.formulario_cliente} onSubmit={handleSubmit}>
          <h2>Informações Pessoais:</h2>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="Nome">Nome:</label>
              <input required type="text" placeholder='Pedro' value={nome} onChange={(e) => setNome(e.target.value)} />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="Sobrenome">Sobrenome:</label>
              <input required type="text" placeholder='Henrique Silva' value={sobreNome} onChange={(e) => setSobreNome(e.target.value)} />
            </section>
          </section>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="Genero">Gênero:</label>
              <input required type="text" placeholder='Masculino/Feminino' value={genero} onChange={(e) => setGenero(e.target.value)} />
            </section>
          </section>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="CPF">CPF:</label>
              <input required type="text" placeholder='111.111.111-11' value={cpf} onChange={(e) => setCpf(e.target.value)} />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="DataEmissaoCPF">Data de Emissão CPF:</label>
              <input required type="date" value={dataEmissaoCpf} onChange={(e) => setDataEmissaoCpf(e.target.value)} />
            </section>
          </section>

          {rgs.map((rg, index) => (
            <section className={styles.infos_group} key={index}>
              <section className={styles.individual_infos}>
                <label htmlFor={`RG-${index}`}>RG:</label>
                <input required type="text" placeholder='111.111.111-11' name="rg_value" value={rg.rg_value} onChange={(e) => handleRgChange(index, e)} />
              </section>
              <section className={styles.individual_infos}>
                <label htmlFor={`DataEmissaoRG-${index}`}>Data de Emissão RG:</label>
                <input required type="date" name="rg_date" value={rg.rg_date} onChange={(e) => handleRgChange(index, e)} />
              </section>
            </section>
          ))}
          <button className={styles.addBtn} type='button' onClick={addRg}>Adicionar RG</button>

          <h2>Contato:</h2>
          {telefones.map((telefone, index) => (
            <section className={styles.infos_group} key={index}>
              <section className={styles.individual_infos}>
                <label htmlFor={`DDD-${index}`}>DDD:</label>
                <input required type="text" placeholder='12' name="tel_ddd" value={telefone.tel_ddd} onChange={(e) => handleTelefoneChange(index, e)} />
              </section>
              <section className={styles.individual_infos}>
                <label htmlFor={`Telefone-${index}`}>Telefone:</label>
                <input required type="text" placeholder='999999999' name="tel_num" value={telefone.tel_num} onChange={(e) => handleTelefoneChange(index, e)} />
              </section>
            </section>
          ))}
          <button className={styles.addBtn} type='button' onClick={addTelefone}>Adicionar Telefone</button>

          {emails.map((email, index) => (
            <section className={styles.infos_group} key={index}>
              <section className={styles.individual_infos}>
                <label htmlFor={`Email-${index}`}>Email:</label>
                <input required type="email" placeholder='pedro@email.com' name="email_value" value={email.email_value} onChange={(e) => handleEmailChange(index, e)} />
              </section>
            </section>
          ))}
          <button className={styles.addBtn} type='button' onClick={addEmail}>Adicionar Email</button>


          <h2>Endereço:</h2>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="Estado">Estado:</label>
              <input required type="text" placeholder='SP' value={estado} onChange={(e) => setEstado(e.target.value)} />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="Cidade">Cidade:</label>
              <input required type="text" placeholder='São Paulo' value={cidade} onChange={(e) => setCidade(e.target.value)} />
            </section>
          </section>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="Rua">Rua:</label>
              <input required type="text" placeholder='Rua X' value={rua} onChange={(e) => setRua(e.target.value)} />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="Bairro">Bairro:</label>
              <input required type="text" placeholder='Bairro Y' value={bairro} onChange={(e) => setBairro(e.target.value)} />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="Número">Número:</label>
              <input required type="text" placeholder='100' value={numero} onChange={(e) => setNumero(e.target.value)} />
            </section>
          </section>

          <h2>Produtos:</h2>
          <section>
            {produtos.map((produto, index) => (
              <section className={styles.infos_group} key={index}>
                <section className={styles.individual_infos}>
                  <label htmlFor={`Produto-${index}`}>Produto:</label>
                  <input type="text" placeholder='Shampoo' name="prod_name" value={produto.prod_name} onChange={(e) => handleProdutoChange(index, e)} />
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor={`ValorProduto-${index}`}>Valor:</label>
                  <input type="text" placeholder='50.00' name="prod_value" value={produto.prod_value} onChange={(e) => handleProdutoChange(index, e)} />
                </section>
              </section>
            ))}
          </section>
          <button className={styles.addBtn} type='button' onClick={addProduto}>Adicionar produto</button>

          <h2>Serviços</h2>
          <section>
            {servicos.map((servico, index) => (
              <section className={styles.infos_group} key={index}>
                <section className={styles.individual_infos}>
                  <label htmlFor={`Servico-${index}`}>Serviço:</label>
                  <input type="text" placeholder='Corte de Cabelo' name="serv_name" value={servico.serv_name} onChange={(e) => handleServicoChange(index, e)} />
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor={`ValorServico-${index}`}>Valor:</label>
                  <input type="text" placeholder='50.00' name="serv_value" value={servico.serv_value} onChange={(e) => handleServicoChange(index, e)} />
                </section>
              </section>
            ))}
          </section>
          <button className={styles.addBtn} type='button' onClick={addServico}>Adicionar Serviço</button>

          <button className={styles.send_btn} type='submit' disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
          {message && (
            <p style={{ color: isSuccess ? 'green' : 'red', marginTop: '10px' }}>
              {message}
            </p>
          )}
        </form>
      </section>
    </>
  );
}