const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://ruairidhgallagher:Bb00230762@cluster0-y2nks.mongodb.net/winch-driving-app?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
