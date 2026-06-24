import fs from "fs";
import path from "path";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), "data", "users.json");

function ensureDb(): User[] {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as User[];
}

function saveDb(users: User[]) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export function findUserByEmail(email: string): User | undefined {
  return ensureDb().find((u) => u.email === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return ensureDb().find((u) => u.id === id);
}

export function createUser(
  email: string,
  name: string,
  passwordHash: string,
): User {
  const users = ensureDb();
  const user: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    name,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveDb(users);
  return user;
}

export function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}
