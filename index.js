const express = require('express')
require('dotenv').config()
var morgan = require('morgan')
const app = express()

const Person = require('./models/person')


const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))


const requestLogger = (request, response, next) => {
  console.log('---')  
  console.log('Method:', request.method)
  console.log('Path: ', request.path)
  console.log('---')
  next()
}



app.use(express.json())
app.use(requestLogger)
// console.log("using morgan")
// app.use(morgan('tiny'))
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/',(request, response) => {
    response.send('<h1>Hello World!</h1><p><a href="/api/persons">persons</a><p> <p><a href="/info">info</a><p>')
})

app.get('/api/persons', (request, response) => {
    console.log("Request received")
    Person.find({}).then(persons => {
      response.json(persons)
      })
  })

app.get('/api/persons/:id', (request, response)=>{

    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
})

app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(persons => {
      const personsCount = persons.length
      response.send(`<p>Phonebook has info for ${personsCount} people</p><p>${date}</p>`)
    })
  })



app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
    console.log("Updating number for:",person)
  
    Person.findOneAndUpdate({name: body.name}, person, { new: true }).then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



app.post('/api/persons', (request, response) => {
    
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    // const nameAlreadyUsed = persons.some(person => person.name === body.name)
    
    // if(nameAlreadyUsed){
    //   return response.status(400).json({
    //   error: 'Name must be unique'
    //   })
    // }

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson=> {
      response.json(savedPerson)
    })
    
  })

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
        
  })

const unkownEndpoint = (request, response) => {
  response.status(404).send({error: 'Unknown endpoint'})
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(unkownEndpoint)
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
