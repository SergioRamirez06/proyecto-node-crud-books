const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const { config } = require('dotenv');
config()

const booksRoute = require('./routes/books.router')

// usamos express para los milddleware
const app = express();
app.use(bodyParse.json()); //parseador de bodies

// Aca conectamos la base de datos
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });
const db  = mongoose.connection
app.use( '/books', booksRoute )

const port = process.env.PORT || 3000


app.listen( port, () => {
    console.log(`Servidor en el puerto ${ port }`)
});