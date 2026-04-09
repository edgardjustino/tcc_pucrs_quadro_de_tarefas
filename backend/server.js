require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// conf inicial
const app = express();
const corsOptions = {
  // Substitua a URL abaixo pela URL real do seu site na Vercel
  origin: 'https://tcc-pucrs-quadro-de-tarefas.vercel.app', 
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
const PORT = 4000;

// 3. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 4. CONEXÃO COM O BANCO DE DADOS
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('ERRO FATAL: A variável de ambiente MONGO_URI não foi definida no arquivo .env');
  process.exit(1); 
}

mongoose.connect(mongoURI)
  .then(() => console.log('Conexão com o MongoDB (Railway) estabelecida com sucesso!'))
  .catch((error) => {
    console.error('Erro ao conectar com o MongoDB:', error.message);
    process.exit(1);
  });

// def de moldes

// Molde para Tarefas (Tasks) - Agora com userId
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  color: String,
  rotation: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Associa a tarefa a um usuário
});
const Task = mongoose.model('Task', taskSchema);

// Molde para Usuários (Users)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);


// 6. MIDDLEWARE DE AUTENTICAÇÃO (O "PORTEIRO")
function auth(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'Nenhum token, autorização negada.' });
  }

  try {
    const decoded = jwt.verify(token, 'secreto-da-aplicacao');
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
}



// ROTAS DE AUTENTICAÇÃO 

// ROTA DE CADASTRO (REGISTER)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor, forneça nome, email e senha.' });
  }

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Usuário criado com sucesso!' });

  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

// ROTA DE LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Por favor, forneça email e senha.' });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(payload, 'secreto-da-aplicacao', { expiresIn: '5h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});


// ROTAS DE TAREFAS

// ROTA 1: Obter tarefas do usuário logado (GET)
app.get('/api/tasks', auth, async (req, res) => {
  try {
    const tasksFromDb = await Task.find({ userId: req.user.id });
    
    const tasksForFrontend = tasksFromDb.map(task => ({
      id: task._id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      color: task.color,
      rotation: task.rotation
    }));
    
    res.json(tasksForFrontend);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas.' });
  }
});

// ROTA 2: Criando uma nova tarefa para o usuário logado (POST)
app.post('/api/tasks', auth, async (req, res) => {
  const { title, description, completed, color, rotation } = req.body;
  
  const newTask = new Task({
    title,
    description,
    completed,
    color,
    rotation,
    userId: req.user.id // Associa a tarefa ao usuário
  });

  try {
    const savedTask = await newTask.save();
    res.status(201).json({
      id: savedTask._id,
      title: savedTask.title,
      description: savedTask.description,
      completed: savedTask.completed,
      color: savedTask.color,
      rotation: savedTask.rotation
    });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao salvar a tarefa.' });
  }
});

// ROTA 3: deletar uma tarefa do usuário logado (DELETE)
app.delete('/api/tasks/:id', auth, async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID inválido fornecido.' });
    }

    try {
        const result = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!result) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence ao usuário.' });
        }
        res.status(200).json({ message: 'Tarefa deletada com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});


// Rota de teste geral
app.get('/', (req, res) => {
  res.send('API do Quadro de Tarefas com sistema de autenticação está no ar!');
});

// inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}. Conectado ao MongoDB.`);
});
