const express = require('express')
const app = express()

app.use(express.json())

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

// const generateId = () => {
//     const maxId = notes.length > 0
//       ? Math.max(...notes.map(n => Number(n.id)))
//       : 0
//     return String(maxId + 1)
// }

// app.post('/api/notes', (request, response) => {
    
//     const body = request.body

//     if (!body.content) {
//         return response.status(400).json({
//             error: 'content missing'
//         })
//     }

//     const note = {
//         content: body.content,
//         important: Boolean(body.important) || false,
//         id: generateId()
//     }
    
//     notes = notes.concat(note)

//     console.log("Note:",note)
//     response.json(note)
//   })

// app.delete('/api/notes/:id', (request, response) => {
//     const id = request.params.id
//     notes = notes.filter(note => note.id !== id)

//     response.status(204).end()
//   })

const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})
