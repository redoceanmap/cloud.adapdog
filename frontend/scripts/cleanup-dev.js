const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const devDir = path.join(__dirname, "..", ".next", "dev");
const lockPath = path.join(devDir, "lock");

if (!fs.existsSync(lockPath)) {
  process.exit(0);
}

let pid;
try {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  pid = lock.pid;
} catch {
  fs.rmSync(lockPath, { force: true });
  process.exit(0);
}

if (!pid) {
  fs.rmSync(lockPath, { force: true });
  process.exit(0);
}

let running = false;
try {
  if (process.platform === "win32") {
    const out = execSync(`tasklist /FI "PID eq ${pid}" /NH`, { encoding: "utf8" });
    running = out.includes(String(pid));
  } else {
    process.kill(pid, 0);
    running = true;
  }
} catch {
  running = false;
}

if (!running) {
  fs.rmSync(lockPath, { force: true });
}
