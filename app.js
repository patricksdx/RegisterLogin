const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

const users = [];

app.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    // Verifica si el usuario ya existe
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crea un nuevo usuario
    const newUser = { username, password, email };
    users.push(newUser);

    // Crea un token
    const token = jwt.sign({ username }, 'secreto_token_jwt', { expiresIn: '1h' });

    res.status(201).json({ message: 'Usuario creado', token });
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verifica si el usuario existe
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verifica la contraseña
    if (user.password !== password) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Genera un nuevo token
    const token = jwt.sign({ username }, 'secreto_token_jwt', { expiresIn: '1h' });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
});

// Ruta para servir "login.html"
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para servir "error.html"
app.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).redirect('/error'); 
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000/login');
});