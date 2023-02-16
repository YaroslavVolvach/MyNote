const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
const app = express();

var notes = require('./db/db.json') || [];
let id_generator = notes[0] || 0;
if (notes.length === 0) {notes.push(id_generator)}

function writeFileSyncFun(path_=path.join(__dirname, './db/db.json'), data=notes){
    fs.writeFileSync(path_, JSON.stringify(data, null, 2));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(notes.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


app.post('/api/notes', (req, res) => {
    let body = req.body;
    body.id = id_generator;
    id_generator ++;
    notes[0] = id_generator;
    notes.push(body);
    writeFileSyncFun()
    res.json(body);
    });

app.delete('/api/notes/:id', (req, res) => {
    let id = req.params.id;
    notes = notes.filter(note => note.id != id || typeof note.id === "undefined")
    writeFileSyncFun()
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});