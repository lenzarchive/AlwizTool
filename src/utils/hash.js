const crypto = require('crypto');

function createHash(text, algorithm) {
  const validAlgorithms = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];
  if (!validAlgorithms.includes(algorithm)) {
    throw new Error('Invalid algorithm');
  }
  return crypto.createHash(algorithm).update(text, 'utf8').digest('hex');
}

function hashAll(text) {
  return {
    md5: createHash(text, 'md5'),
    sha1: createHash(text, 'sha1'),
    sha256: createHash(text, 'sha256'),
    sha384: createHash(text, 'sha384'),
    sha512: createHash(text, 'sha512'),
  };
}

module.exports = { createHash, hashAll };
