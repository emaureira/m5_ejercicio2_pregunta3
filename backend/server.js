const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();


const medicos = [
  { "id": 1, "nombre": "edgard maureira", "apellido": "toledo", "experiencia": "5 años", "especializacion": "Cardiología" },
  { "id": 2, "nombre": "Ana", "apellido": "Gómez", "experiencia": "10 años", "especializacion": "Pediatría" },
  { "id": 3, "nombre": "Carlos", "apellido": "Rodríguez", "experiencia": "7 años", "especializacion": "Neurología" }
];

dotenv.config();

app.use(cors());
app.use(express.json());

const apiKey = process.env.API_KEY;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;


// Middleware para verificar API Key
const validateApiKey = (req, res, next) => {
  const receivedApiKey = req.headers['x-api-key'];
  if (!receivedApiKey || receivedApiKey !== apiKey) {
    return res.status(401).json({ message: 'API Key no válida' });
  }
  next();
};

// Middleware para generar JWT (simulación de login)
app.post('/login', validateApiKey, (req, res) => {
  const { username, password } = req.body;
  // Simulación de verificación de usuario (debes usar un sistema de autenticación real)
  if (username === 'user' && password === 'password') {
    const payload = {
      user: {
        id: 1,
        username: username,
        role: 'admin'
      },
    };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiration,
    });
    res.json({ message: 'Login exitoso', token: token });
  } else if (username === 'doctor' && password === 'doctor'){
    const payload = {
      user: {
        id: 2,
        username: username,
        role: 'doctor'
      },
    };
    const token = jwt.sign(payload, jwtSecret, { 
      expiresIn: jwtExpiration
    });
    res.json({ message: 'Login exitoso', token: token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded.user;
      next();
    } catch (error) {
        if (error.name === "TokenExpiredError"){
          return res.status(403).json({ message: 'Token expirado' });
        }
        return res.status(401).json({ message: 'Token no válido' });
    }
};


//Ruta protegida que requiere API Key y JWT válido
app.get('/datos-protegidos', validateApiKey, verifyToken, (req, res) => {
  const datosSensibles = [
    { id: 1, nombre: 'Paciente 1', cita: '10:00 AM' },
    { id: 2, nombre: 'Paciente 2', cita: '11:00 AM' },
    { id: 3, nombre: 'Paciente 3', cita: '11:30 AM' },
  ];
  res.json(datosSensibles);
});


  // Ruta protegida: Obtener todos los médicos (requiere API Key y JWT)
  app.get('/medicos', validateApiKey, verifyToken,  (req, res) => {
    res.json(medicos);
});



app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});