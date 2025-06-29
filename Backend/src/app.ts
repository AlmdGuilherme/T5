import express from "express";
import { PrismaClient } from "./generated/prisma";
import cors from 'cors'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.status(200).json({message: 'Bem vindo à API do sistema de clientes WB'})
})

app.get('/clientes', async (req, res) => {
  try{
    const clientes = await prisma.clientes.findMany({
      include:{
        rgs: true,
        telefones: true,
        emails: true,
        servicos: true,
        produtos: true,
        endereco: true
      }
    })
    res.status(200).json(clientes)
  } catch (error) {
    console.error(`Erro ao buscar dados dos clientes: Error - ${error}`)
    res.status(500).json({error: 'Não foi possível buscar os clientes'})
  }
})

app.get('/clientes/:id', async (req, res) => {
  try{
    const {id} = req.params;
    const cliente = await prisma.clientes.findUnique({
      where: {
        cli_id: Number(id)
      }, include: {
        rgs: true,
        telefones: true,
        emails: true,
        servicos: true,
        produtos: true,
        endereco: true
      }
    });
    res.status(200).json(cliente)
  } catch (error) {
    console.error(`Erro ao buscar cliente - Error: ${error}`)
    res.status(500).json({error: 'Não foi possível buscar o cliente'})
  }
})


app.get('/filtro/mais-produtos', async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany({
      include: { produtos: true },
    });

    const ordenado = clientes
      .sort((a, b) => b.produtos.length - a.produtos.length)
      .slice(0, 10);

    res.json(ordenado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os clientes' });
  }
});


app.get('/filtro/mais-servicos', async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany({
      include: { servicos: true },
    });

    const ordenado = clientes
      .sort((a, b) => b.servicos.length - a.servicos.length)
      .slice(0, 10);

    res.json(ordenado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os clientes' });
  }
});


app.get('/filtro/menos-produtos', async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany({
      include: { produtos: true },
    });

    const ordenado = clientes
      .sort((a, b) => a.produtos.length - b.produtos.length)
      .slice(0, 10);

    res.json(ordenado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os clientes' });
  }
});


app.get('/filtro/menos-servicos', async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany({
      include: { servicos: true },
    });

    const ordenado = clientes
      .sort((a, b) => a.servicos.length - b.servicos.length)
      .slice(0, 10);

    res.json(ordenado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os clientes' });
  }
});

app.get('/filtro/maior-valor', async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany({
      include: { produtos: true, servicos: true },
    });

    const clientesComValor = clientes.map((cliente) => {
      const totalProdutos = cliente.produtos.reduce((acc, p) => acc + Number(p.prod_value), 0);
      const totalServicos = cliente.servicos.reduce((acc, s) => acc + Number(s.serv_value), 0);
      return {
        ...cliente,
        valorTotal: totalProdutos + totalServicos,
      };
    });

    const ordenado = clientesComValor
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 5);

    res.json(ordenado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os clientes por valor' });
  }
});


app.get('/filtro/produtos-mais-consumidos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany();

    const contagem: Record<string, { nome: string; quantidade: number }> = {};

    produtos.forEach((produto) => {
      if (!contagem[produto.prod_name]) {
        contagem[produto.prod_name] = { nome: produto.prod_name, quantidade: 1 };
      } else {
        contagem[produto.prod_name].quantidade++;
      }
    });

    const ordenado = Object.values(contagem)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    res.json(ordenado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos mais consumidos' });
  }
});


app.get('/filtro/servicos-mais-consumidos', async (req, res) => {
  try {
    const servicos = await prisma.servico.findMany();

    const contagem: Record<string, { nome: string; quantidade: number }> = {};

    servicos.forEach((servico) => {
      if (!contagem[servico.serv_name]) {
        contagem[servico.serv_name] = { nome: servico.serv_name, quantidade: 1 };
      } else {
        contagem[servico.serv_name].quantidade++;
      }
    });

    const ordenado = Object.values(contagem)
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    res.json(ordenado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar serviços mais consumidos' });
  }
});

app.get('/filtro/por-genero', async (req, res) => {
  try {
    const clientes = await prisma.clientes.findMany();

    const totalPorGenero: Record<string, number> = {};

    clientes.forEach((cliente) => {
      const genero = cliente.cli_gender;
      if (!totalPorGenero[genero]) {
        totalPorGenero[genero] = 1;
      } else {
        totalPorGenero[genero]++;
      }
    });

    const resultado = Object.entries(totalPorGenero).map(([genero, total]) => ({
      genero,
      total,
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes por gênero' });
  }
});

app.post('/cadastrar-clientes', async(req, res) => {
  try {
    const {cli_nome, cli_sobreNome, cli_cpf, cpf_date, cli_gender, rgs, telefones, emails, servicos, produtos, endereco} = req.body;

    const novoCliente = await prisma.clientes.create({
      data: {
        cli_nome,
        cli_sobreNome,
        cli_cpf,
        cpf_date, 
        cli_gender, 
        rgs:{
          create: rgs || []
        },
        telefones:{
          create: telefones || []
        },
        emails: {
          create:  emails || []
        },
        servicos: {
          create: servicos || []
        },
        produtos: {
          create: produtos || []
        },
        endereco: {
          create: endereco
        }
      }, 
      include:{
        rgs: true,
        telefones: true,
        emails: true,
        servicos: true,
        produtos: true,
        endereco: true
      }
    });
    res.status(201).json(novoCliente)
  } catch (error) {
    console.error(`Erro ao cadastrar cliente: Error - ${error}`)
    res.status(500).json({error: 'Não foi possível cadastrar um novo cliente. Verifique os dados fornecidos.'})
  }
})

app.put('/atualizar-clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      cli_nome,
      cli_sobreNome,
      cli_cpf,
      cpf_date,
      cli_gender,
      rgs,
      telefones,
      emails,
      servicos,
      produtos,
      endereco
    } = req.body;

    await prisma.rG.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.telefone.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.email.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.servico.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.produto.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.endereco.deleteMany({ where: { cliente: { cli_id: Number(id) } } });

    const clienteAtualizado = await prisma.clientes.update({
      where: { cli_id: Number(id) },
      data: {
        cli_nome,
        cli_sobreNome,
        cli_cpf,
        cpf_date,
        cli_gender,
        rgs: {
          create: rgs || []
        },
        telefones: {
          create: telefones || []
        },
        emails: {
          create: emails || []
        },
        servicos: {
          create: servicos || []
        },
        produtos: {
          create: produtos || []
        },
        endereco: {
          create: endereco
        }
      },
      include: {
        rgs: true,
        telefones: true,
        emails: true,
        servicos: true,
        produtos: true,
        endereco: true
      }
    });

    res.status(200).json(clienteAtualizado);
  } catch (error) {
    console.error(`Erro ao atualizar cliente - Error: ${error}`);
    res.status(500).json({ error: 'Não foi possível atualizar o cliente. Verifique os dados fornecidos.' });
  }
});


app.delete('/deletar-clientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.rG.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.telefone.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.email.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.servico.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.produto.deleteMany({ where: { cliente: { cli_id: Number(id) } } });
    await prisma.endereco.deleteMany({ where: { cliente: { cli_id: Number(id) } } });

    await prisma.clientes.delete({
      where: {
        cli_id: Number(id),
      },
    });

    res.status(200).json({ message: `Cliente ${id} deletado com sucesso` });
  } catch (error) {
    console.error(`Erro ao deletar cliente - Error: ${error}`);
    res.status(500).json({ error: 'Não foi possível deletar o cliente.' });
  }
});


export {app, prisma}