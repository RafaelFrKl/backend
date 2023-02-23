const express = require('express')
const morgan = require('morgan') // Morgan Logger
const app = express()
const cors = require('cors')

app.use(express.json()) // add New Persons: HTTP POST requests
app.use(morgan('tiny')) // Morgan Logger
app.use(cors())
app.use(express.static('build')) // Use Build

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

// Display all Persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// Info Page
const date = new Date();

app.get('/info', (request, response) => {
    response.send(`
        <h3>Phonebook has info for ${persons.length} people</h3>
        <h3>${date}</h3>
    `)  
})

// Fetch an individual resource
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    //console.log(id)
    const person = persons.find(person => person.id === id)
    //console.log(person)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// Deletion Route
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// New Persons
const generateId = () => { //Give a new ID
    return Math.floor(Math.random() * 10000);
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) { // name property may not be empty.
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) { // number property may not be empty.
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (persons.find(person => person.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

// Middelware function for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})