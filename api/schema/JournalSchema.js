const JournalSchema = {
  id: {
    type: Number,
    autoIncrement: true,
  },
  user: {
    type: Number,
    ref: 'users:id',
  },
  message: String,
}

module.exports = JournalSchema;
