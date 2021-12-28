const bcrypt = require('bcrypt');
const saltRounds = 10;

const encript = (text) => {
  return bcrypt.hash(text, saltRounds)
}

const compare = (text, password) => {
  return bcrypt.compare(text, password)
}

module.exports = {encript, compare}