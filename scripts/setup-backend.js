const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const cloudRoot = path.join(root, "cloud.adapdog");
const backendDir = path.join(cloudRoot, "adapdog");
const venvDir = path.join(cloudRoot, "venv");
const requirements = path.join(backendDir, "requirements.txt");
const envCloud = path.join(cloudRoot, ".env");
const envBackend = path.join(backendDir, ".env");

const venvPython = process.platform === "win32"
  ? path.join(venvDir, "Scripts", "python.exe")
  : path.join(venvDir, "bin", "python");

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} 실패 (exit ${result.status})`);
  }
}

function isValidPython(cmd) {
  const probe = spawnSync(cmd, ["-c", "import sys; print(sys.version)"], {
    encoding: "utf8",
    shell: false,
  });
  const output = `${probe.stdout || ""}${probe.stderr || ""}`;
  return probe.status === 0 && /3\.\d+/.test(output);
}

function findWindowsPythonPaths() {
  const localAppData = process.env.LOCALAPPDATA;
  if (!localAppData) {
    return [];
  }

  const roots = [
    path.join(localAppData, "Programs", "Python"),
    path.join(process.env.ProgramFiles || "C:\\Program Files", "Python"),
  ];

  const found = [];
  for (const rootDir of roots) {
    if (!fs.existsSync(rootDir)) {
      continue;
    }
    for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }
      const candidate = path.join(rootDir, entry.name, "python.exe");
      if (fs.existsSync(candidate)) {
        found.push(candidate);
      }
    }
  }
  return found;
}

function findSystemPython() {
  const candidates = [];

  if (process.platform === "win32") {
    const where = spawnSync("where.exe", ["python"], {
      encoding: "utf8",
      shell: false,
    });
    if (where.status === 0 && where.stdout) {
      candidates.push(
        ...where.stdout
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .filter((line) => !line.toLowerCase().includes("windowsapps")),
      );
    }
    candidates.push(...findWindowsPythonPaths());
  }

  candidates.push("python3", "python", "py");

  const seen = new Set();
  for (const cmd of candidates) {
    if (!cmd || seen.has(cmd)) {
      continue;
    }
    seen.add(cmd);
    if (isValidPython(cmd)) {
      return cmd;
    }
  }
  return null;
}

function ensureEnvFile() {
  if (fs.existsSync(envBackend)) {
    return;
  }
  if (fs.existsSync(envCloud)) {
    fs.copyFileSync(envCloud, envBackend);
    console.log(`환경변수 복사: cloud.adapdog/.env → adapdog/.env`);
    return;
  }
  const example = path.join(backendDir, ".env.example");
  if (fs.existsSync(example)) {
    fs.copyFileSync(example, envBackend);
    console.log(`환경변수 생성: adapdog/.env.example → adapdog/.env`);
    console.log("adapdog/.env 에 DATABASE_URL 등을 채워 주세요.");
  }
}

function main() {
  if (!fs.existsSync(requirements)) {
    console.error(`requirements.txt 를 찾을 수 없습니다: ${requirements}`);
    process.exit(1);
  }

  const systemPython = findSystemPython();
  if (!systemPython) {
    console.error("\nPython이 설치되어 있지 않습니다.\n");
    console.error("https://www.python.org/downloads/ 에서 Python 3.12+ 설치 후");
    console.error('"Add python.exe to PATH" 를 체크하고 다시 실행하세요:\n');
    console.error("  npm run install:backend\n");
    process.exit(1);
  }

  ensureEnvFile();

  if (!fs.existsSync(venvPython)) {
    console.log(`가상환경 생성: ${venvDir}`);
    run(systemPython, ["-m", "venv", venvDir]);
  }

  console.log("Python 패키지 설치 중...");
  run(venvPython, ["-m", "pip", "install", "--upgrade", "pip"]);
  run(venvPython, ["-m", "pip", "install", "-r", requirements]);

  console.log("\n백엔드 설치 완료. 실행: npm run dev:backend");
}

main();
