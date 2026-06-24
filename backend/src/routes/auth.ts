import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  clearAuthCookie,
  createToken,
  COOKIE_NAME,
  setAuthCookie,
  verifyToken,
} from "../lib/auth";
import { createUser, findUserByEmail, findUserById, toPublicUser } from "../lib/db";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "이메일, 비밀번호, 이름을 모두 입력해주세요." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "비밀번호는 6자 이상이어야 합니다." });
      return;
    }

    if (findUserByEmail(email)) {
      res.status(409).json({ error: "이미 가입된 이메일입니다." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser(email, name, passwordHash);
    const token = await createToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    setAuthCookie(res, token);

    res.json({ user: toPublicUser(user) });
  } catch {
    res.status(500).json({ error: "회원가입 중 오류가 발생했습니다." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
      return;
    }

    const user = findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다." });
      return;
    }

    const token = await createToken({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
    setAuthCookie(res, token);

    res.json({ user: toPublicUser(user) });
  } catch {
    res.status(500).json({ error: "로그인 중 오류가 발생했습니다." });
  }
});

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.json({ success: true });
});

router.get("/me", async (req, res) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    res.json({ user: null });
    return;
  }

  const session = await verifyToken(token);
  if (!session) {
    res.json({ user: null });
    return;
  }

  const user = findUserById(session.sub);
  if (!user) {
    res.json({ user: null });
    return;
  }

  res.json({ user: toPublicUser(user) });
});

export default router;
