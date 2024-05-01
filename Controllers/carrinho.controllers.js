import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const adcionarAoCarrinho = async (req, res) => {
  const livros = await prisma.livro.findMany({
    where: {
      id: {
        in: req.body.livro.map((p) => p.id),
      },
    },
  });

  if (
    !(
      livros.every((atual) => atual.estoque > 0) &&
      livros.length > 0 &&
      livros.length === req.body.livro.length
    )
  ) {
    // verifica se o produto ainda está disponível
    return res.status(400).json({
      msg: "O produto que você está tentando adicionar ao carrinho está esgotado ou não existe. Por favor, busque por outro em nossa loja!",
    });
  }

  const pedidos = await prisma.pedido
    .update({
      // como o carrinho tem o mesmo id do usuario sempre, posso fazer isso
      where: {
        id: req.body.id,
      },
      data: {
        livro: {
          connect: req.body.livro,
        },
      },
    })
    .catch(() => {
      return null;
    });

  res.status(200).json({
    msg: "Produto adicionado com sucesso!",
  });
};

export const removerDoCarrinho = async (req, res) => {
  const livros = await prisma.livro.findMany({
    where: {
      id: {
        in: req.body.livro.map((p) => p.id),
      },
    },
  });
  const livro = await prisma.pedido
    .update({
      where: {
        id: req.body.id,
        livro: {
          some: {
            id: {
              // verificar se o livro que está sendo retirado do carrinho realmente está nele
              in: req.body.livro.map((p) => p.id),
            },
          },
        },
      },
      data: {
        livro: {
          disconnect: req.body.livro,
        },
      },
    })
    .catch(() => {
      return null;
    });

  if (livro === null) {
    return res.status(400).json({
      msg: "Nenhum dos itens enviados está no carrinho. Portanto, não é possível removê-los.",
    });
  }

  res.status(200).json({
    msg: "Produto removido com sucesso!",
  });
};
