const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('..//helpers/fsUtils');
const uuid = require('../helpers/uuid');
const fs = require('fs');

notes.get('/notes', (req, res) => {
    readFromFile('db/db.json', 'utf8').then((data) => {
    console.log(data)
    return res.json(JSON.parse(data));
    })
});



notes.post('/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };
        console.log(newNote)
    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
    } else {
        res.error('Error in adding note');
    }
});

// Pending delete function
notes.delete('/:id', (req, res) => {
    const noteID = req.params.id;
    fs.readFile('db/db.json', 'utf8').then((err, data) => {
        const dataDB = JSON.parse(data);
    if (err) throw err;
    else {
        for (let i = 0; i < dataDB.length; i++) {
            if (noteID === dataDB[i].id) {
                dataDB.splice([i], 1)
                writeToFile('./db/db.json', JSON.stringify(dataDB), (err) => {
                    if (err) throw err;
                    return res.json(dataDB)
                })
            }
            }
        }
    })
})

module.exports = notes;