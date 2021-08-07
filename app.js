// Dépendances
const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Routes
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Mise en place de la base de donnée
mongoose.connect('mongodb+srv://Guillaume660:kx3nYtmax3nY@cluster0.awx0s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Framework Express
const app = express();

// Configuration du header des requêtes pour la communication cross-serveur (empêche l\'erreur CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Module de sécurité helmet
app.use(helmet());

// Transforme le corps des requêtes en objet JSON
app.use(bodyParser.json());

// Accès au dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
