const fs = require("fs");
const path = require("path");

const source = path.resolve(__dirname, "..", "build");
const backendPublic = path.resolve(__dirname, "..", "..", "backend", "public");
const destinations = [
  path.join(backendPublic, "app"),
  path.join(backendPublic, "react"),
];

if (!fs.existsSync(source)) {
  throw new Error(`Build directory not found: ${source}`);
}

for (const destination of destinations) {
  fs.rmSync(destination, { recursive: true, force: true });
  fs.cpSync(source, destination, { recursive: true });
  console.log(`Frontend build copied to ${destination}`);
}