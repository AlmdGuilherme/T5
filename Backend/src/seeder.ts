import { PrismaClient } from "./generated/prisma";
const dadosClientes = require('./data/clientes.json')

const prisma = new PrismaClient()

interface RG {
  rg_value: string;
  rg_date: string;
}

interface Endereco{
  end_estado: string;
  end_cidade: string;
  end_rua: string;
  end_bairro: string;
  end_numero: string;
}

interface Telefone {
  tel_ddd: string;
  tel_num: string;
}

interface Email {
  email_value: string; 
}

interface Servico {
  serv_name: string;
  serv_value: string; 
}

interface Produto {
  prod_name: string;
  prod_value: string; 
}

interface ClienteJson {
  cli_nome: string;
  cli_sobreNome: string;
  cli_cpf: string;
  cpf_date: string; 
  cli_gender: string;
  rgs?: RG[];
  telefones?: Telefone[];
  emails?: Email[];
  servicos?: Servico[];
  produtos?: Produto[];
  endereco: Endereco 
}


async function main(){
  console.log('Iniciando Banco de Dados (WB5)')
  try{
    await prisma.rG.deleteMany();
    await prisma.telefone.deleteMany();
    await prisma.email.deleteMany();
    await prisma.servico.deleteMany();
    await prisma.produto.deleteMany();
    await prisma.endereco.deleteMany(); 
    await prisma.clientes.deleteMany();
    console.log('Remoção dos dados existentes concluída!')
  } catch (error){
    console.error(`Erro ao tentar remover dados existentes. Isso pode acontecer se as tabelas estiverem vazias: ${error}`)
  }

  console.log('Dados do JSON carregados:')


  for (const clienteJson of dadosClientes){
    try{
      const cliente = await prisma.clientes.create({
        data:{
          cli_nome: clienteJson.cli_nome,
          cli_sobreNome: clienteJson.cli_sobreNome,
          cli_cpf: clienteJson.cli_cpf,
          cpf_date: new Date(clienteJson.cpf_date),
          cli_gender: clienteJson.cli_gender,
          rgs: {
            create: clienteJson.rgs?.map((rg: RG) => ({
              rg_Value: rg.rg_value,
              rg_date: new Date(rg.rg_date)
            })) || []
          },
          telefones:{
            create: clienteJson.telefones?.map((telefone: Telefone) => ({
              tel_ddd: telefone.tel_ddd,
              tel_num: telefone.tel_num
            })) || []
          },
          emails: {
            create: clienteJson.emails?.map((email: Email) => ({
              email_value: email.email_value
            })) || []
          },
          servicos: {
            create: clienteJson.servicos?.map((serv: Servico) => ({
              serv_name: serv.serv_name,
              serv_value: serv.serv_value
            })) || []
          },
          produtos: {
            create: clienteJson.produtos?.map((prod: Produto) => ({
              prod_name: prod.prod_name,
              prod_value: prod.prod_value
            })) || []
          }, 
          endereco:{
            create: {
              end_estado: clienteJson.endereco.end_estado,
              end_cidade: clienteJson.endereco.end_cidade,
              end_rua: clienteJson.endereco.end_rua,
              end_bairro: clienteJson.endereco.end_bairro,
              end_numero: clienteJson.endereco.end_numero
            }
          }
        },
      });
      console.log(`Cliente "${cliente.cli_nome} ${cliente.cli_sobreNome}" criado com sucesso. ID: ${cliente.cli_id}`)
    } catch (error: any) {
      if(error.code === 'P2002' && error.meta?.target?.includes('cli_cpf')){
        console.warn(`Aviso: Cliente ${clienteJson.cli_nome} ${clienteJson.cli_sobreNome} possui CPF duplicado (${clienteJson.cli_cpf}). Pulando para o próximo.`)
      } else {
        console.error(`Erro ao criar cliente ${clienteJson.cli_nome} ${clienteJson.cli_sobreNome}:`, error)
      }
    }
  }

  console.log('Processo de seeding concluído!')
}

main()
  .catch(async (e) => {
    console.error('Ocorreu um erro fatal durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
