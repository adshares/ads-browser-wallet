export function InvalidPasswordError() {
  this.constructor.prototype.__proto__ = Error.prototype;
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Invalid password';
}

export function InvalidAddressError() {
  this.constructor.prototype.__proto__ = Error.prototype;
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Invalid address';
}

export function AccountsLimitError() {
  this.constructor.prototype.__proto__ = Error.prototype;
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Maximum account limit has been reached';
}

export function UnknownPublicKeyError() {
  this.constructor.prototype.__proto__ = Error.prototype;
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Cannot find a key in storage. Please import private key first.';
}

export function ImportedKeysLimitError() {
  this.constructor.prototype.__proto__ = Error.prototype;
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = 'Maximum keys limit has been reached';
}
