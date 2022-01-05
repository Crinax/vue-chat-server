const JournalSchema = {
  id: {
    type: Number,
    autoIncrement: true,
  },
  user: Number,
  message: String,
}

module.exports = JournalSchema;