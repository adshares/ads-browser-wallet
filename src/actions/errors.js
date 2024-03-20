/* eslint-disable no-proto */
export function InvalidPasswordError() {
  this.constructor.prototype.__proto__ = Error.prototype;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.message = 'Invalid password';
}

export function InvalidAddressError() {
  this.constructor.prototype.__proto__ = Error.prototype;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.message = 'Invalid address';
}

export function AccountsLimitError(limit) {
  this.constructor.prototype.__proto__ = Error.prototype;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.data = { limit };
  this.message = `Maximum account limit (${limit}) has been reached`;
}

export function UnknownPublicKeyError(publicKey) {
  this.constructor.prototype.__proto__ = Error.prototype;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.data = { publicKey };
  this.message = 'Cannot find a key in storage. Please import secret key first.';
}

export function ItemNotFound(name, id) {
  this.constructor.prototype.__proto__ = Error.prototype;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.data = { id, name };
  this.message = `Cannot find the ${name} [${id}] in storage.`;
}

export function ImportedKeysLimitError(limit) {
  this.constructor.prototype.__proto__ = Error.prototype;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.data = { limit };
  this.message = `Maximum keys limit (${limit}) has been reached`;
}

export function PostMessageError(message, code) {
  this.constructor.prototype.__proto__ = Error.prototype;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.code = code;
  this.message = message;
}

export function TransactionDataError(message) {
  this.constructor.prototype.__proto__ = Error.prototype;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.message = message;
}

export function RpcError(message, data) {
  this.constructor.prototype.__proto__ = Error.prototype;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
  this.name = this.constructor.name;
  this.message = message;
  this.data = data;
}
