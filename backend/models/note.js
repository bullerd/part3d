//part3c2
const mongoose = require("mongoose");
//const password = encodeURIComponent(process.argv[2]);
//const url = `mongodb+srv://davidmbuller_db_user:${password}@cluster0.3tpfwj2.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;
const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url, { family: 4 })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: { type: String, minLength: 5, required: true },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
