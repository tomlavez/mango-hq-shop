import jwt from "jsonwebtoken";

export default function userLevel(req, res, next) {
  const authenticator = req.headers["authorization"]; // procura por um autenticador no header

  if (!authenticator) {
    // autenticador não foi encontrado
    return res.status(401).json({
      msg: "Nenhum autenticador encontrado. Verifique as informações do header e tente novamente.",
    });
  }

  const token = authenticator.split(" ")[1]; // separa o token no autenticador

  if (token) {
    // token encontrado
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        // token inválido
        return res.status(403).json({
          data: user,
          token: token,
          msg: `Token para o usuário enviado é inválido`,
        });
      }

      if (user.id !== req.body.id) {
        return res.status(403).json({
          token: token,
          msg: `O usuário que está tentando acessar essa rota não é o usuário dono desse perfil`,
        });
      }

      next(); // deu tudo certo, pode seguir para a próxima rota
    });
  } else {
    // o token não está no formato correto
    return res.status(401).json({
      token: authenticator,
      msg: "Formato para o token inválido. Formato esperado: 'Bearer <token>'",
    });
  }
}
