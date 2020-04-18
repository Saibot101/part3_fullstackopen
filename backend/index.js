const express = require('express');
const morgan = require('morgan')
const app = express();

app.use(express.json());
morgan.token('request', function (req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request'))

let persons=  [
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (req, res) => {
    const send = new Date().toUTCString();
    const output = 'Phonebook has info for '+persons.length+' people <br/>' + send;
    console.log(new Date().getUTCDate())
    res.send(
        output
    )
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if(person){
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req,res)=> {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
});

const randomNumber = () => {
    const number = Math.random() * 1000;

    if(persons.find(person => person.id === number)){
        randomNumber();
    }
    return Math.floor(number);


}

app.post('/api/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number){
        return res.status(400).json({
            error: 'name or number is missing'
        })
    }
    if(persons.find(person => person.name === body.name)){
        return res.status(400).json({
            error: 'name is already in the phonebook'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: randomNumber()
    }

    persons = persons.concat(person)
    res.status(200).json(person)
})




const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
