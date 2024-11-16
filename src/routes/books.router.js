const express = require('express');
const router = express.Router();
const Book = require('../models/books.models');

// MIDDLEWARE
const getBooks = async( req, res, next ) => {

    let book;

    const { id } = req.params;
    
    if( !id.match(/^[0-9a-fA-F]{24}$/) ) {
        return res.status(404).json({
            message: 'Al ID del libro no es valido'
        })
    };

    try {
        book = await Book.findById(id);

        if( !book ){
            res.status(404).json({
                message: 'El libro no es valido'
            })
        };
    } catch (error) {

        res.status(500).json(
            {
                message: error.message
            }
        )
        
    }
    res.book = book
    next()
}


// Obtener todos los Libros [GET]
router.get('/', async (req, res) => {

    try {
        const books =  await Book.find();
        console.log('Obtener', books );

        if( books.length === 0 ) return res.status(204).json([]);

        res.json( books );
        
    } catch (error) {
        res.status(500).json({ message: error_message });
    }

});



//Crear un nuevo libro (recurso) [POST]
router.post('/', async ( req, res ) => {

    const { title, author, years, genre, publication_date } = req?.body

    if( !title || !author || !years || !genre || !publication_date ) {
        return res.status(400).json(
            { 
                message: ' Los campo title, author, years, genre y publication_date son obligatorio'
            }
        )
    }

    const book =  new Book(
        {
            title: title, 
            author: author, 
            years: years, 
            genre: genre, 
            publication_date: publication_date
        }
    )

    try {

        const newBooks = await book.save();
        res.status(200).json(newBooks);
        console.log('Nuevo Books', newBooks)
        
    } catch (error) {
        res.status(400).json({ message:  error.message })
        
    }
});

router.get('/:id', getBooks, async (req, res) => {
    res.json(res.book);
});

router.put('/:id', getBooks, async (req, res) => {

    try {
        const book = res.book
        
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.years = req.body.years || book.years
        book.genre = req.body.genre || book.genre 
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBooks = await book.save();
        res.json( updateBooks );

    } catch (error) {
        res.status(400).json(
            {
                message: error.message
            }
        )
        
    }

});


router.patch('/:id', getBooks, async(req, res) => {

    if (!req.body.title && !req.body.author && !req.body.years && !req.body.genre && !req.body.publication_date ) {
        return res.status(400).json({ 
            message: 'Al menos uno de estos campos debe de ser enviado: título, autor, género, año, fecha de publicación' 
        });
    }

               
    try {
        const book = res.book
        
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.years = req.body.years || book.years
        book.genre = req.body.genre || book.genre 
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBooks = await book.save();
        res.json( updateBooks );

    } catch (error) {
        res.status(400).json(
            {
                message: error.message
            }
        )
        
    }

})

router.delete('/:id', getBooks, async( req, res ) => {

    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        })
        res.json({
            message: `El libro ${ book.title } fue eliminado correctamente`
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
   

})

module.exports = router



