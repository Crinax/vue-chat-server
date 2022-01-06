const UsersSchema = {
  id: {
    type: Number,
    autoIncrement: true,
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
