
import jwt from "jsonwebtoken"

// gerando token de autenticação (expira em 30 minutos)
export default function generateToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "18000s" });
}