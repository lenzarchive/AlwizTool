const crypto = require('crypto');

const VALID_ALGOS = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];

function createHash(text, algorithm) {
  if (!VALID_ALGOS.includes(algorithm)) throw new Error('Invalid algorithm');
  return crypto.createHash(algorithm).update(text, 'utf8').digest('hex');
}

function createHmac(text, key, algorithm) {
  if (!VALID_ALGOS.includes(algorithm)) throw new Error('Invalid algorithm');
  return crypto.createHmac(algorithm, key).update(text, 'utf8').digest('hex');
}

function hashAll(text) {
  return Object.fromEntries(VALID_ALGOS.map(a => [a, createHash(text, a)]));
}

function hashAllHmac(text, key) {
  return Object.fromEntries(VALID_ALGOS.map(a => [a, createHmac(text, key, a)]));
}

module.exports = { createHash, createHmac, hashAll, hashAllHmac };
