
// criar um usuario administrador para poder criar os produtos mais facilmente durante o desenvolvimento

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const initAdmin = async () => {
  // verificando se o usuário existe
  const exists = await prisma.usuario.findFirst({
    where: {
      email: "admin@gmail.com",
    },
  });

  if (exists)
    // se o email já foi cadastrado, ele não pode ser cadastrado novamente
    return console.log(
      "Para utilizar as funções de administrador, faça login com o email: admin@gmail.com e a senha: admin1234 e utilize o token gerado para fazer as requisições"
    );

  const user = await prisma.usuario.create({
    // criando o usuário
    data: {
        // as informações serão enviadas no body da requisição
        email: "admin@gmail.com",
        senha: "admin1234",
        role: true,
        pedido: {
            create: {
                valor: 0,
                livro: { create: [] },
            },
        },
        perfil: {
            create: {
                nome: "admin show de bola",
                telefone: "1234-5678",
                },
            },
        },
    });

  console.log({
    // retornando informações do usuário criado
    data: user,
    msg: "Admin criado com sucesso!",
  });
};

export const initLivros = async () => {
  // verificando se existem livros na base de dados
  let count = await prisma.livro.count();
  if (count > 0){
    console.log("Livros já existem na base de dados!")

   return;
  }

  // se não existirem livros, a api será populada com livros
  initManga();
  initGraphicNovels();

  console.log("Api populada com sucesso!")
}

const initManga = async () => {
  // buscando livros do tipo mangá
  const response = await fetch("https://www.googleapis.com/books/v1/volumes?q=%20Mang%C3%A1&maxResults=20");

  const data = await response.json();

  const livros = data.items.map(async (item) => {
    // verificando se o livro já existe na base de dados
    const livro = await prisma.livro.findFirst({
      where: {
        titulo: item.volumeInfo.title,
      },
      })
    // se o livro não existir e o livro possuir uma capa, ele será criado
    if (!livro && 'imageLinks' in item.volumeInfo) {
      let autores = "Autores não informados!"
      if (item.volumeInfo.authors) {
        autores = ""
        item.volumeInfo.authors.forEach((autor) => {
          autores += autor + "; "
        })
      }
      await prisma.livro.create({
        data: {
          titulo: item.volumeInfo.title,
          autor: autores,
          estoque: 20,
          valor: 50,
          capa: item.volumeInfo.imageLinks.thumbnail,
        },
      });
    }
  });
}

const initGraphicNovels = async () => {
  // buscando livros do tipo graphic novels
  const response = await fetch("https://www.googleapis.com/books/v1/volumes?q=subject:%20Graphic%20Novels&maxResults=20");

  const data = await response.json();

  const livros = data.items.map(async (item) => {
    // verificando se o livro já existe na base de dados
    const livro = await prisma.livro.findFirst({
      where: {
        titulo: item.volumeInfo.title,
      },
      })
    // se o livro não existir, ele será criado
    if (!livro && 'imageLinks' in item.volumeInfo) {
      let autores = "Autores não informados!"
      if (item.volumeInfo.authors) {
        autores = ""
        item.volumeInfo.authors.forEach((autor) => {
          autores += autor + "; "
        })
      }
      await prisma.livro.create({
        data: {
          titulo: item.volumeInfo.title,
          autor: autores,
          estoque: 20,
          valor: 50,
          capa: item.volumeInfo.imageLinks.thumbnail,
        },
      });
    }
  });
}

