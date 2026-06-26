const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const backendDir = path.join(root, "cloud.adapdog", "adapdog");
const mainPy = path.join(backendDir, "main.py");
const venvPython = process.platform === "win32"
  ? path.join(root, "cloud.adapdog", "venv", "Scripts", "python.exe")
  : path.join(root, "cloud.adapdog", "venv", "bin", "python");

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

function discoverPythonCandidates() {
  const discovered = [];

  if (process.env.PAWPRINT_PYTHON) {
    discovered.push(process.env.PAWPRINT_PYTHON);
  }
  if (fs.existsSync(venvPython)) {
    discovered.push(venvPython);
  }
  if (process.platform === "win32") {
    const where = spawnSync("where.exe", ["python"], {
      encoding: "utf8",
      shell: false,
    });
    if (where.status === 0 && where.stdout) {
      discovered.push(
        ...where.stdout
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .filter((line) => !line.toLowerCase().includes("windowsapps")),
      );
    }
    discovered.push(...findWindowsPythonPaths());
  }

  discovered.push("python3", "python", "py");
  return [...new Set(discovered.filter(Boolean))];
}

const candidates = discoverPythonCandidates();

function trySpawn(pythonCmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(pythonCmd, args, {
      cwd: backendDir,
      stdio: "inherit",
      shell: false,
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (signal) {
        reject(new Error(`백엔드가 시그널 ${signal}로 종료되었습니다.`));
        return;
      }
      resolve(code ?? 0);
    });
  });
}

async function main() {
  if (!fs.existsSync(mainPy)) {
    console.error(`백엔드 진입점을 찾을 수 없습니다: ${mainPy}`);
    process.exit(1);
  }

  let lastError;
  for (const pythonCmd of candidates) {
    if (!isValidPython(pythonCmd)) {
      continue;
    }
    try {
      const code = await trySpawn(pythonCmd, [mainPy]);
      process.exit(code);
    } catch (error) {
      lastError = error;
    }
  }

  console.error("\n백엔드를 실행할 Python을 찾지 못했습니다.\n");
  console.error("1. 프로젝트 루트에서: npm run install:backend");
  console.error("2. Python이 없다면 https://www.python.org/downloads/ 에서 3.12+ 설치");
  console.error('   (설치 시 "Add python.exe to PATH" 체크)');
  console.error("3. 다시: npm run dev:backend\n");
  if (lastError) {
    console.error(String(lastError.message || lastError));
  }
  process.exit(1);
}

main();
