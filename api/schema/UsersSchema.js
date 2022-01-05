const UsersSchema = {
  id: {
    type: Number,
    autoIncrement: true,
    ref: 'journal',
  },
  login: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    // encryption: encryptFunc,
  }
}

module.exports = UsersSchema;