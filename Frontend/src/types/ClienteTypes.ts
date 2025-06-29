export interface ClienteData {
  cli_id?: number;
  cli_nome: string;
  cli_sobreNome: string;
  cli_cpf: string;
  cpf_date: Date;
  cli_gender: string;
  rgs: RG[];
  endereco: Endereco;
  telefones: Telefone[];
  emails: Email[]
  servicos: Servico[]
  produtos: Produto[]
}

export interface RG{
  rg_id?: number;
  rg_Value: string;
  rg_date: Date
  cliente?:ClienteData;
  cli_id?: number
}

export interface Endereco{
  end_id?: number;
  cli_id?: number;
  end_estado: string;
  end_cidade: string;
  end_rua: string;
  end_bairro: string;
  end_numero: string;
  cliente?: ClienteData;
}

export interface Telefone{
  tel_id?: number;
  cli_id?: number;
  tel_ddd: string;
  tel_num: string;
  cliente?: ClienteData;
}

export interface Email{
  email_id?: number
  cli_id?: number;
  email_value: string;
  cliente?:ClienteData
}

export interface Servico{
  serv_id?: number;
  cli_id?: number;
  serv_name: string;
  serv_value: string
  cliente?: ClienteData;
}

export interface Produto{
  prod_id?: number;
  cli_id?: number;
  prod_name: string;
  prod_value: string;
  cliente?: ClienteData;
}