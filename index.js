require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('data', (request) => {
    if (request.method === 'POST')
        return JSON.stringify(request.body)
})

app.use(morgan('tiny', { skip: (request) => request.method === 'POST' }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {
    skip: (request) => request.method !== 'POST'
}))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const info = `<div>Phonebook has info of ${persons.length} people 
                    <br/>
                    <br/>${Date().toLocaleString()}<div>`
        response.send(info)
    })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            if (result) {
                response.status(204).end()

            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    if (body.number && body.number.length > 7) {

        const person = {
            name: body.name,
            number: body.number,
        }

        Person.findByIdAndUpdate(request.params.id, person, { new: true })
            .then(updatedPerson => {
                response.json(updatedPerson.toJSON())
            })
            .catch(error => next(error))
    }
    else if (!body.number) {
        response.status(400)
            .send({ error: 'Number is required.' })
    }
    else {
        response.status(400)
            .send({ error: `Number ${body.number} (${body.number.length}) is shorter than the minimum allowed length (8).` })
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404)
        .send({ error: 'Unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400)
            .send({ error: 'Malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400)
            .send({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})