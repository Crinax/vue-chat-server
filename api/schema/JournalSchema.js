const JournalSchema = {
  id: {
    type: Number,
    autoIncrement: true,
  },
  login: String,
  message: String,
}

module.exports = JournalSchema;