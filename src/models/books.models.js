const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        years: Number,
        genre: String,
        publication_date: String,
    }
)


module.exports = mongoose.model( 'Book', booksSchema );