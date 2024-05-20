const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: String,
    rating: Number,
    review: String,
    poster: String
});

const Movie = mongoose.model('Movie', movieSchema);

// Routes
app.post('/submit-recommendation', async (req, res) => {
    const { title, rating, review } = req.body;

    const response = await fetch(`https://www.omdbapi.com/?t=${title}&apikey=${process.env.OMDB_API_KEY}`);
    const data = await response.json();

    if (data.Response === 'True') {
        const movie = new Movie({
            title: data.Title,
            rating,
            review,
            poster: data.Poster
        });

        await movie.save();
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Movie not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
