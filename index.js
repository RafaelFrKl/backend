require('dotenv').config() //used for sensitive info
const express = require('express')
const morgan = require('morgan') // Morgan Logger
const app = express()
const cors = require('cors')
const Person = require('./models/person') //MongoDB Model

app.use(express.static('build')) // Use Build
app.use(express.json()) // json-parser - add New Persons: HTTP POST requests
app.use(morgan('tiny')) // Morgan Logger
app.use(cors())


/*let persons = [
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
]*/

// Info Page
const date = new Date();

app.get('/info', (request, response) => {
    response.send(`
        <h3>Phonebook has info for ${persons.length} people</h3>
        <h3>${date}</h3>
    `)  
})

// DGet all Persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// Fetch an individual Person
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Create New Person
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
    } 
    const person = new Person({
        name: body.name,
        number: body.number || false,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// Update Person
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true }) //new: true parameter, causes event handler to be called with the new modified document instead of original
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

// Delete Person
app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// Middelware function for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
// Handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}
// Handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})