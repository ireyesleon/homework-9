const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('..//helpers/fsUtils');
const uuid = require('../helpers/uuid');

notes.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    });

notes.delete('/notes/:id', (req, res) => {
    const noteID = req.params.id;
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
        const result = json.filter((note) => note.id !== noteID);
        writeToFile('./db/db.json', result);
        res.json(`Note ${noteID} has been deleted`);
    });
});

notes.post('/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
    } else {
        res.error('Error in adding note');
    }
});

module.exports = notes;