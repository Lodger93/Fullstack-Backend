const express = require('express')
var morgan = require('morgan')
const app = express()



let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const requestLogger = (request, response, next) => {
  console.log('---')  
  console.log('Method:', request.method)
  console.log('Path: ', request.path)
  console.log('---')
  next()
}

const unkownEndpoint = (request, response) => {
  response.status(404).send({error: 'Unknown endpoint'})
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
    response.json(persons)
  })

app.get('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.statusMessage = `person with id ${id} not found`;
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    const date = new Date()
    const personsCount = persons.length
    response.send(`<p>Phonebook has info for ${personsCount} people</p><p>${date}</p>`)
  })

const generateId = () => {
    // const maxId = notes.length > 0
    //   ? Math.max(...notes.map(n => Number(n.id)))
    //   : 0

    const id = Math.random()*10000

    return String(Math.floor(id))
}

app.post('/api/persons', (request, response) => {
    
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const nameAlreadyUsed = persons.some(person => person.name === body.name)
    
    if(nameAlreadyUsed){
      return response.status(400).json({
      error: 'Name must be unique'
      })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    
    persons = persons.concat(person)

    // console.log("Person:",person)
    response.json(person)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
  })

app.use(unkownEndpoint)
const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
