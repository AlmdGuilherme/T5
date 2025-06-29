import { Link, useParams, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import type { ClienteData, RG, Endereco, Telefone, Servico, Produto, Email } from '../../types/ClienteTypes';
import { ClientesApi } from '../../Services/ClienteServices';
import { useEffect, useState } from 'react';

export default function UpdateCliente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ClienteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDateForInput = (dateValue: Date | string | undefined): string => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.warn('Data inválida fornecida:', dateValue);
      return '';
    }
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchClienteData = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const fetchedCliente = await ClientesApi.getClienteById(Number(id));
          if (fetchedCliente) {
            const clientDataWithFormattedDates = {
              ...fetchedCliente,
              cpf_date: fetchedCliente.cpf_date ? new Date(fetchedCliente.cpf_date) : new Date(),
              rgs: fetchedCliente.rgs.map(rg => ({
                ...rg,
                rg_date: rg.rg_date ? new Date(rg.rg_date) : new Date()
              })),
              endereco: fetchedCliente.endereco || {} as Endereco
            };
            setFormData(clientDataWithFormattedDates);
          } else {
            setError(`Não foi possível carregar o cliente com ID: ${id}`);
            setFormData(null);
          }
        } catch (err) {
          console.error(err);
          setError('Ocorreu um erro ao buscar os dados do cliente.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchClienteData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ClienteData | keyof Endereco, parent?: 'endereco') => {
    if (!formData) return;

    if (parent === 'endereco') {
      setFormData(prev => ({
        ...(prev as ClienteData),
        endereco: {
          ...(prev as ClienteData).endereco,
          [fieldName as keyof Endereco]: e.target.value
        }
      }));
    } else {
      setFormData(prev => ({
        ...(prev as ClienteData),
        [fieldName as keyof ClienteData]: e.target.value
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;

    setFormData(prev => ({
      ...(prev as ClienteData),
      cpf_date: new Date(e.target.value)
    }));
  };

  type ArrayItemType<T extends keyof ClienteData> =
    T extends 'rgs' ? RG :
    T extends 'telefones' ? Telefone :
    T extends 'emails' ? Email :
    T extends 'servicos' ? Servico :
    T extends 'produtos' ? Produto :
    never;

  const handleArrayInputChange = <T extends 'rgs' | 'telefones' | 'emails' | 'servicos' | 'produtos'>(
    e: React.ChangeEvent<HTMLInputElement>,
    arrayName: T,
    index: number,
    fieldName: keyof ArrayItemType<T>
  ) => {
    if (!formData) return;

    setFormData(prev => {
      const prevData = prev as ClienteData;
      const updatedArray = [...prevData[arrayName]] as ArrayItemType<T>[];

      const updatedItem = { ...(updatedArray[index] as ArrayItemType<T>) };
      const value = e.target.value;

      if (fieldName === 'rg_date') {
          (updatedItem as RG).rg_date = new Date(value);
      } else {
          (updatedItem as ArrayItemType<T>)[fieldName as typeof fieldName] = value as ArrayItemType<T>[typeof fieldName];
      }

      updatedArray[index] = updatedItem;

      return {
        ...prevData,
        [arrayName]: updatedArray
      };
    });
  };

  const handleAddArrayItem = (arrayName: 'rgs' | 'telefones' | 'emails' | 'servicos' | 'produtos') => {
    if (!formData) return;

    setFormData(prev => {
      const prevData = prev as ClienteData;
      let newItem: RG | Telefone | Servico | Produto | Email;

      switch (arrayName) {
        case 'rgs':
          newItem = { rg_Value: '', rg_date: new Date() };
          break;
        case 'telefones':
          newItem = { tel_ddd: '', tel_num: '' };
          break;
        case 'emails':
          newItem = { email_value: '' };
          break;
        case 'servicos':
          newItem = { serv_name: '', serv_value: '' };
          break;
        case 'produtos':
          newItem = { prod_name: '', prod_value: '' };
          break;
        default:
          return prevData;
      }

      return {
        ...prevData,
        [arrayName]: [...prevData[arrayName], newItem]
      };
    });
  };

  const handleRemoveArrayItem = (arrayName: 'rgs' | 'telefones' | 'emails' | 'servicos' | 'produtos', index: number) => {
    if (!formData) return;

    setFormData(prev => {
      const prevData = prev as ClienteData;
      const updatedArray = prevData[arrayName].filter((_, i) => i !== index);
      return {
        ...prevData,
        [arrayName]: updatedArray
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;

    const dataToSend = JSON.parse(JSON.stringify(formData));

    if (dataToSend.cpf_date) {
      dataToSend.cpf_date = new Date(dataToSend.cpf_date);
    }
    
    dataToSend.rgs = dataToSend.rgs.map((rg: RG) => ({
      ...rg,
      rg_date: rg.rg_date ? new Date(rg.rg_date) : null // Changed to null
    }));

    dataToSend.rgs = dataToSend.rgs.map((rg: RG) => {
      const newRg = { ...rg };
      if (newRg.rg_id === undefined) delete newRg.rg_id;
      if (newRg.cliente) delete newRg.cliente;
      if (newRg.cli_id) delete newRg.cli_id;
      return newRg;
    });
    dataToSend.telefones = dataToSend.telefones.map((tel: Telefone) => {
      const newTel = { ...tel };
      if (newTel.tel_id === undefined) delete newTel.tel_id;
      if (newTel.cliente) delete newTel.cliente;
      if (newTel.cli_id) delete newTel.cli_id;
      return newTel;
    });
    dataToSend.emails = dataToSend.emails.map((email: Email) => {
      const newEmail = { ...email };
      if (newEmail.email_id === undefined) delete newEmail.email_id;
      if (newEmail.cliente) delete newEmail.cliente;
      if (newEmail.cli_id) delete newEmail.cli_id;
      return newEmail;
    });
    dataToSend.servicos = dataToSend.servicos.map((serv: Servico) => {
      const newServ = { ...serv };
      if (newServ.serv_id === undefined) delete newServ.serv_id;
      if (newServ.cliente) delete newServ.cliente;
      if (newServ.cli_id) delete newServ.cli_id;
      return newServ;
    });
    dataToSend.produtos = dataToSend.produtos.map((prod: Produto) => {
      const newProd = { ...prod };
      if (newProd.prod_id === undefined) delete newProd.prod_id;
      if (newProd.cliente) delete newProd.cliente;
      if (newProd.cli_id) delete newProd.cli_id;
      return newProd;
    });
    if (dataToSend.endereco) {
      if (dataToSend.endereco.end_id !== undefined) delete dataToSend.endereco.end_id;
      if (dataToSend.endereco.cliente) delete dataToSend.endereco.cliente;
      if (dataToSend.endereco.cli_id) delete dataToSend.endereco.cli_id;
    }
    delete dataToSend.cli_id;

    try {
      const success = await ClientesApi.atualizarClientes(Number(id), dataToSend);
      if (success) {
        alert('Cliente atualizado com sucesso!');
        navigate('/');
      } else {
        alert('Falha ao atualizar cliente. Verifique o console para mais detalhes.');
      }
    } catch (err) {
      console.error('Erro ao submeter atualização:', err);
      alert('Ocorreu um erro ao tentar atualizar o cliente.');
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Tem certeza que deseja deletar este cliente? Esta ação é irreversível.')) {
      return;
    }
    try {
      const success = await ClientesApi.deletarClientes(Number(id));
      if (success) {
        alert('Cliente deletado com sucesso!');
        navigate('/');
      } else {
        alert('Falha ao deletar cliente. Verifique o console para mais detalhes.');
      }
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      alert('Ocorreu um erro ao tentar deletar o cliente.');
    }
  };

  if (loading) {
    return <section className={styles.update_main}>Carregando dados do cliente...</section>;
  }

  if (error) {
    return <section className={styles.update_main}><p style={{ color: 'red' }}>{error}</p><Link to={'/'}>Voltar</Link></section>;
  }

  if (!formData) {
    return <section className={styles.update_main}>Nenhum cliente encontrado ou dados não carregados.</section>;
  }

  return (
    <>
      <section className={styles.update_main}>
        <Link to={'/'}>&#10229; Voltar</Link>
        <h3>Atualizar cliente - WB</h3>
        <form className={styles.formulario_cliente} onSubmit={handleSubmit}>
          <h2>Informações pessoais</h2>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="cli_nome">Nome:</label>
              <input
                type="text"
                id="cli_nome"
                name="cli_nome"
                value={formData.cli_nome || ''}
                onChange={(e) => handleInputChange(e, 'cli_nome')}
                required
              />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="cli_sobreNome">Sobrenome:</label>
              <input
                type="text"
                id="cli_sobreNome"
                name="cli_sobreNome"
                value={formData.cli_sobreNome || ''}
                onChange={(e) => handleInputChange(e, 'cli_sobreNome')}
                required
              />
            </section>
          </section>

          <h2>Endereço</h2>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="end_estado">Estado</label>
              <input
                type="text"
                id="end_estado"
                name="end_estado"
                value={formData.endereco?.end_estado || ''}
                onChange={(e) => handleInputChange(e, 'end_estado', 'endereco')}
                required
              />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="end_cidade">Cidade:</label>
              <input
                type="text"
                id="end_cidade"
                name="end_cidade"
                value={formData.endereco?.end_cidade || ''}
                onChange={(e) => handleInputChange(e, 'end_cidade', 'endereco')}
                required
              />
            </section>
          </section>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="end_rua">Endereço:</label>
              <input
                type="text"
                id="end_rua"
                name="end_rua"
                value={formData.endereco?.end_rua || ''}
                onChange={(e) => handleInputChange(e, 'end_rua', 'endereco')}
                required
              />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="end_numero">Número:</label>
              <input
                type="text"
                id="end_numero"
                name="end_numero"
                value={formData.endereco?.end_numero || ''}
                onChange={(e) => handleInputChange(e, 'end_numero', 'endereco')}
                required
              />
            </section>
          </section>
          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="end_bairro">Bairro:</label>
              <input
                type="text"
                id="end_bairro"
                name="end_bairro"
                value={formData.endereco?.end_bairro || ''}
                onChange={(e) => handleInputChange(e, 'end_bairro', 'endereco')}
                required
              />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="cli_gender">Gênero:</label>
              <input
                type="text"
                id="cli_gender"
                name="cli_gender"
                value={formData.cli_gender || ''}
                onChange={(e) => handleInputChange(e, 'cli_gender')}
                required
              />
            </section>
          </section>

          <section className={styles.infos_group}>
            <section className={styles.individual_infos}>
              <label htmlFor="cli_cpf">CPF:</label>
              <input
                required
                type="text"
                id="cli_cpf"
                name="cli_cpf"
                value={formData.cli_cpf || ''}
                onChange={(e) => handleInputChange(e, 'cli_cpf')}
              />
            </section>
            <section className={styles.individual_infos}>
              <label htmlFor="cpf_date">Emissão CPF:</label>
              <input
                required
                type="date"
                id="cpf_date"
                name="cpf_date"
                value={formatDateForInput(formData.cpf_date)}
                onChange={handleDateChange}
              />
            </section>
          </section>

          <section className={styles.add_remove} id='RGs'>
            {formData.rgs.map((rg, index) => (
              <section key={`rg-${rg.rg_id || `new-${index}`}`} className={styles.infos_group}>
                <section className={styles.individual_infos}>
                  <label htmlFor={`rg_Value-${index}`}>RG:</label>
                  <input
                    required
                    type="text"
                    id={`rg_Value-${index}`}
                    name="rg_Value"
                    value={rg.rg_Value || ''}
                    onChange={(e) => handleArrayInputChange(e, 'rgs', index, 'rg_Value')}
                  />
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor={`rg_date-${index}`}>Emissão RG:</label>
                  <input
                    required
                    type="date"
                    id={`rg_date-${index}`}
                    name="rg_date"
                    value={formatDateForInput(rg.rg_date)}
                    onChange={(e) => handleArrayInputChange(e, 'rgs', index, 'rg_date')}
                  />
                </section>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => handleRemoveArrayItem('rgs', index)}
                >
                  Remover
                </button>
              </section>
            ))}
          </section>
          <section className={styles.actions_btn}>
            <section className={styles.actions}>
              <button className={styles.addBtn} onClick={() => handleAddArrayItem('rgs')} type='button'>Adicionar RG</button>
            </section>
          </section>

          <section className={styles.add_remove} id='Tels'>
            {formData.telefones.map((telefone, index) => (
              <section key={`tel-${telefone.tel_id || `new-${index}`}`} className={styles.infos_group}>
                <section className={styles.individual_infos}>
                  <label htmlFor={`tel_ddd-${index}`}>DDD:</label>
                  <input
                    required
                    type="text"
                    id={`tel_ddd-${index}`}
                    name="tel_ddd"
                    value={telefone.tel_ddd || ''}
                    onChange={(e) => handleArrayInputChange(e, 'telefones', index, 'tel_ddd')}
                  />
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor={`tel_num-${index}`}>Telefone:</label>
                  <input
                    required
                    type="text"
                    id={`tel_num-${index}`}
                    name="tel_num"
                    value={telefone.tel_num || ''}
                    onChange={(e) => handleArrayInputChange(e, 'telefones', index, 'tel_num')}
                  />
                </section>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => handleRemoveArrayItem('telefones', index)}
                >
                  Remover
                </button>
              </section>
            ))}
          </section>
          <section className={styles.actions_btn}>
            <section className={styles.actions}>
              <button className={styles.addBtn} onClick={() => handleAddArrayItem('telefones')} type='button'>Adicionar Telefone</button>
            </section>
          </section>

          <h3>Emails:</h3>
          <section className={styles.add_remove} id='Emails'>
            {formData.emails.map((email, index) => (
              <section key={`email-${email.email_id || `new-${index}`}`} className={styles.infos_group}>
                <section className={styles.individual_infos}>
                  <label htmlFor={`email_value-${index}`}>Email:</label>
                  <input
                    required
                    type="email"
                    id={`email_value-${index}`}
                    name="email_value"
                    value={email.email_value || ''}
                    onChange={(e) => handleArrayInputChange(e, 'emails', index, 'email_value')}
                  />
                </section>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => handleRemoveArrayItem('emails', index)}
                >
                  Remover
                </button>
              </section>
            ))}
          </section>
          <section className={styles.actions_btn}>
            <section className={styles.actions}>
              <button className={styles.addBtn} onClick={() => handleAddArrayItem('emails')} type='button'>Adicionar Email</button>
            </section>
          </section>

          <h3>Produtos:</h3>
          <section className={styles.add_remove} id='Prods'>
            {formData.produtos.map((produto, index) => (
              <section key={`prod-${produto.prod_id || `new-${index}`}`} className={styles.infos_group}>
                <section className={styles.individual_infos}>
                  <label htmlFor={`prod_name-${index}`}>Produto:</label>
                  <input
                    required
                    type="text"
                    id={`prod_name-${index}`}
                    name="prod_name"
                    value={produto.prod_name || ''}
                    onChange={(e) => handleArrayInputChange(e, 'produtos', index, 'prod_name')}
                  />
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor={`prod_value-${index}`}>Valor:</label>
                  <input
                    required
                    type="text"
                    id={`prod_value-${index}`}
                    name="prod_value"
                    value={produto.prod_value || ''}
                    onChange={(e) => handleArrayInputChange(e, 'produtos', index, 'prod_value')}
                  />
                </section>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => handleRemoveArrayItem('produtos', index)}
                >
                  Remover
                </button>
              </section>
            ))}
          </section>
          <section className={styles.actions_btn}>
            <section className={styles.actions}>
              <button className={styles.addBtn} onClick={() => handleAddArrayItem('produtos')} type='button'>Adicionar Produto</button>
            </section>
          </section>

          <h3>Serviços: </h3>
          <section className={styles.add_remove} id='Serv'>
            {formData.servicos.map((servico, index) => (
              <section key={`serv-${servico.serv_id || `new-${index}`}`} className={styles.infos_group}>
                <section className={styles.individual_infos}>
                  <label htmlFor={`serv_name-${index}`}>Serviços:</label>
                  <input
                    required
                    type="text"
                    id={`serv_name-${index}`}
                    name="serv_name"
                    value={servico.serv_name || ''}
                    onChange={(e) => handleArrayInputChange(e, 'servicos', index, 'serv_name')}
                  />
                </section>
                <section className={styles.individual_infos}>
                  <label htmlFor={`serv_value-${index}`}>Valor:</label>
                  <input
                    required
                    type="text"
                    id={`serv_value-${index}`}
                    name="serv_value"
                    value={servico.serv_value || ''}
                    onChange={(e) => handleArrayInputChange(e, 'servicos', index, 'serv_value')}
                  />
                </section>
                <button
                  type="button"
                  className={styles.addBtn}
                  onClick={() => handleRemoveArrayItem('servicos', index)}
                >
                  Remover
                </button>
              </section>
            ))}
          </section>
          <section className={styles.actions_btn}>
            <section className={styles.actions}>
              <button className={styles.addBtn} onClick={() => handleAddArrayItem('servicos')} type='button'>Adicionar Serviço</button>
            </section>
          </section>

          <section className={styles.button_action}>
            <button className={styles.send_btn} type='submit'>Atualizar Cliente</button>
            <button className={styles.delete_btn} type='button' onClick={handleDelete}>Deletar Cliente</button>
          </section>
        </form>
      </section>
    </>
  );
}