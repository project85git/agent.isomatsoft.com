function xorEncryptDecrypt(value, secretKey) {
  if (typeof value !== 'string') {
    value = JSON.stringify(value); // Ensure value is a string
  }
  if (!secretKey || secretKey.length === 0) {
    throw new Error('Secret key cannot be empty');
  }
  const keyLength = secretKey.length;
  return value.split('').map((char, index) => {
    return String.fromCharCode(char.charCodeAt(0) ^ secretKey.charCodeAt(index % keyLength));
  }).join('');
}

function toHex(input) {
  return input.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
}

function fromHex(input) {
  return input.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
}

export function hashObject(obj, secretKey) {
  function encryptValue(value) {
    const encrypted = xorEncryptDecrypt(JSON.stringify(value), secretKey); // Encrypt as a string
    return toHex(encrypted); // Convert to hex for safe transmission
  }

  function recursiveEncrypt(input) {
    if (Array.isArray(input)) {
      return input.map(item => recursiveEncrypt(item));
    } else if (typeof input === 'object' && input !== null) {
      const encryptedObj = {};
      for (const [key, value] of Object.entries(input)) {
        const encryptedKey = toHex(xorEncryptDecrypt(key, secretKey)); // Encrypt and hex-encode the key
        encryptedObj[encryptedKey] = recursiveEncrypt(value); // Recursively encrypt the value
      }
      return encryptedObj;
    } else {
      return encryptValue(input); // Encrypt primitive values
    }
  }

  return recursiveEncrypt(obj); // Return fully encrypted object/array
}


export function decryptObject(encryptedObj, secretKey) {
  function decryptValue(encryptedValue) {
    const decryptedString = xorEncryptDecrypt(fromHex(encryptedValue), secretKey); // Decode hex and decrypt
    try {
      return JSON.parse(decryptedString); // Try parsing as JSON
    } catch {
      return decryptedString; // Return as is if not JSON
    }
  }

  function recursiveDecrypt(input) {
    if (Array.isArray(input)) {
      return input.map(item => recursiveDecrypt(item));
    } else if (typeof input === 'object' && input !== null) {
      const decryptedObj = {};
      for (const [encryptedKey, encryptedValue] of Object.entries(input)) {
        const decryptedKey = xorEncryptDecrypt(fromHex(encryptedKey), secretKey); // Decode hex and decrypt key
        decryptedObj[decryptedKey] = recursiveDecrypt(encryptedValue); // Recursively decrypt value
      }
      return decryptedObj;
    } else {
      return decryptValue(input); // Decrypt primitive values
    }
  }

  return recursiveDecrypt(encryptedObj); // Return fully decrypted object/array
}
