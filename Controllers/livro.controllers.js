import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const criarLivro = async (req, res) => {
  // verificando se o livro já existe
  const exists = await prisma.livro.findFirst({
    where: {
      titulo: req.body.titulo,
    },
  });

  // se o livro já existe, atualiza as informações
  if (exists) {
    const livro = await prisma.livro.update({
      where: {
        id: exists.id,
      },
      data: {
        estoque: parseInt(req.body.estoque),
        valor: parseFloat(req.body.valor),
      },
    });

    // retorna o livro atualizado
    res.json({
      data: livro,
      msg: "Estoque atualizado com sucesso!",
    });
    return;
  }

  // se o livro não existe, ele é criado
  const livro = await prisma.livro.create({
    data: {
      titulo: req.body.titulo,
      autor: req.body.autor,
      estoque: parseInt(req.body.estoque),
      valor: parseFloat(req.body.valor),
      capa: req.file.path,
    },
  });

  // retorna o livro criado
  res.json({
    data: livro,
    msg: "Livro criado com sucesso!",
  });
};

export const getLivros = async (req, res) => {
  // busca livros por título e/ou autor
  const livros = await prisma.livro.findMany({
    where: {
      titulo: {
        contains: req.query.titulo,
      },
      autor: {
        contains: req.query.autor,
      },
    },
  });

  // retorna os livros encontrados
  res.json({
    data: livros,
    msg: "Livros encontrados com sucesso!",
  });
};

export const getLivroPorId = async (req, res) => {
  // busca livro por id
  const livro = await prisma.livro.findUnique({
    where: {
      id: parseInt(req.params.livroId),
    },
  });

  // retorna o livro encontrado
  res.json({
    data: livro,
    msg: "Livro encontrado com sucesso!",
  });
};

export const deletarLivro = async (req, res) => {
  // busca livro por id e deleta
  const livroDeletado = await prisma.livro.delete({
    where: {
      id: parseInt(req.params.livroId),
    },
  });

  // retorna mensagem de sucesso
  res.json({
    msg: "Livro deletado com sucesso!",
  });
};
