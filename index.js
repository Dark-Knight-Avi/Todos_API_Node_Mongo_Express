const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://aritra:1234@todos.kjte8ex.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((error) => console.log(error));

// Define schema
const Schema = mongoose.Schema;
const todoSchema = new Schema({
  title: String,
  description: String,
  completed: Boolean,
});

// Define model
const Todo = mongoose.model('Todo', todoSchema);

// Define routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Get all todos
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Create a new todo
app.post('/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed,
  });
  const result = await todo.save();
  res.json(result);
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findByIdAndUpdate(
    id,
    {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
    },
    { new: true }
  );
  res.json(todo);
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const result = await Todo.findByIdAndDelete(id);
  res.json(result);
});

// Start the server
const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
