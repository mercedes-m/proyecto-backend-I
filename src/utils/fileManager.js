const fs = require('fs').promises;

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  readFile,
  writeFile,
};