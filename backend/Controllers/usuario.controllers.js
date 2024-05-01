import { PrismaClient } from "@prisma/client";
import generateToken from "../utils/jwt.js";

const prisma = new PrismaClient();

export const criarUsuario = async (req, res) => {
  // verificando se o email já está cadastrado
  const existe = await prisma.usuario.findFirst({
    where: {
      email: req.body.email,
    },
    select: { email: true },
  });

  // se o email já foi cadastrado, ele não pode ser cadastrado novamente
  if (existe)
    return res.status(400).json({
      data: existe,
      msg: "Email já cadastrado. O email é uma chave única e não pode ser cadastrada duas vezes.",
    });

  // se o email não foi cadastrado, o usuário é criado

  const usuario = await prisma.usuario.create({
    data: {
      email: req.body.email,
      senha: req.body.senha,
      role: req.body.role,
      perfil: {
        create: {
          nome: req.body.nome,
          telefone: req.body.telefone,
        },
      },
      pedido: {
        create: {
          valor: 0,
          livro: { create: [] },
        },
      },
    },
  });

  const token = generateToken(usuario); // gerando token de acesso

  res.status(201).json({
    // retornando informações do usuário criado
    data: usuario,
    token: token,
    msg: "Usuário criado com sucesso!",
  });
};

export const getUsuario = async (req, res) => {
  // buscando usuários com o nome do perfil
  const usuarios = await prisma.usuario.findMany({
    where: {
      perfil: {
        nome: {
          contains: req.query.nome,
        },
      },
    },
    include: {
      perfil: true,
    },
  });

  // retornando usuários encontrados
  res.json({
    data: usuarios,
    msg: "Usuários encontrados com sucesso!",
  });
};

export const getUsuarioPorId = async (req, res) => {
  // buscando usuário com o id
  const usuario = await prisma.usuario.findUnique({
    where: {
      id: parseInt(req.params.usuarioId),
    },
  });

  // retornando usuário encontrado
  res.json({
    data: usuario,
    msg: "Usuário encontrado com sucesso!",
  });
};

export const atualizarUsuario = async (req, res) => {
  // buscando usuário com o id e atualizando email e perfil
  const usuario = await prisma.usuario.update({
    where: {
      id: parseInt(req.params.usuarioId),
    },
    data: {
      email: req.body.email,
      perfil: {
        update: {
          nome: req.body.nome,
          telefone: req.body.telefone,
        },
      },
    },
  });

  // retornando usuário e perfil atualizados
  res.json({
    data: usuario,
    msg: "Usuário e perfil atualizados com sucesso!",
  });
};

export const deletarUsuario = async (req, res) => {
  // buscando usuário com o id e deletando perfil e usuário
  const usuarioDeletado = await prisma.perfil.deleteMany({
    where: {
      Usuario: {
        id: parseInt(req.params.usuarioId),
      },
    },
  });

  // retornando mensagem de sucesso
  res.json({
    msg: "Usuário deletado com sucesso!",
  });
};

export const login = async (req, res) => {
  const user = await prisma.usuario.findFirst({
    // buscando usuário com esse email e senha
    where: {
      AND: {
        email: req.body.email,
        senha: req.body.senha,
      },
    },
  });

  if (user === null || user.senha !== req.body.senha) {
    // nenhum usuário encontrado
    return res.status(403).json({
      msg: "Email ou senha incorretos.",
    });
  }

  const token = generateToken(user); // gerando o token de acesso
  res.json({
    // deu tudo certo, o usuário foi logado
    data: user,
    token: token,
    msg: "Login realizado com sucesso!",
  });
};
