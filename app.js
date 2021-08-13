const express = require('express');

const app = express();
const knex = require('knex')(require('./knexfile').development);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/movies', (req, res) => {
    if (req.query.title) {
        knex
            .select('*')
            .from('movies')
            .where({ title: req.query.title })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    res.status(200).json(data)
                } else {
                    res.status(404).json({
                        message: 'Title not found'
                    })
                }
            })
            .catch(err => {
                res.status(400).json({
                    message: 'Invalid title'
                })
            })
    } else {
        knex
            .select('*')
            .from('movies')
            .then(data => res.status(200).json(data))
            .catch(err => {
                res.status(404).json({
                    message:
                        'The data you are looking for could not be found. Please try again'
                })
            });
    }
});

app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id++;
    knex
        .select('*')
        .from('movies')
        .where({ id: movieId })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                res.status(200).json(data)
            } else {
                res.status(404).json({
                    message: 'Movie ID not found'
                })
            }
        })
        .catch(err => {
            res.status(418).json({
                message: 'Invalid ID supplied'
            })
        })
});
//this way works but is not elegant enough
// app.post('/movies', (req, res) => {
//     knex('movies').max('id')
//         .then(data => {
//             let movieId = data[0].max;
//             movieId++;
//             knex('movies')
//                 .insert({
//                     id: movieId,
//                     title: req.body.title,
//                     runtime: req.body.runtime,
//                     release_year: req.body.release_year,
//                     director: req.body.director
//                 })
//                 .then(data => {
//                     res.status(200).json(data)
//                 }).catch(err => res.send({ err }))
//         })
// })

app.post('/movies', (req, res) => {
    knex('movies')
        .insert({
            title: req.body.title,
            runtime: req.body.runtime,
            release_year: req.body.release_year,
            director: req.body.director
        })
        .then(data => {
            res.status(200).json(data)
        }).catch(err => {
            console.error('error: ', err)
            res.send({ error: err })
        })
})

app.delete('/movies/:id', (req, res) => {
    knex('movies')
        .where({ id: parseInt(req.params.id) })
        //  .where({ id: movieId })
        .del()
        .then(() => res.json({ message: 'Movie deleted!', data: req.params.id }))
        .catch(() => res.json({ message: 'Something went wrong' }))
});

module.exports = app;
