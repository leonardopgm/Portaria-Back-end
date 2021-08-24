import express, { request } from 'express'
import cors from 'cors'
import { v4 as uuid } from 'uuid'
import mongoose from 'mongoose'
const Link = require('../models/Link.ts')
const Visit = require('../models/visit.ts')

const app = express()

mongoose.connect('mongodb://localhost/diNapoli', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

let db = mongoose.connection;

db.on("error", () => console.log("Houve um erro"))
db.once("open", () => console.log("Banco carregado com sucesso"))

app.use(express.json())
app.use(cors({origin: 'http://localhost:8080'}))

interface infoVisitas {
    id: string
    name: string
    phone: string
    apNumber: number
    bloco: string
    data: string
    hora: string
}

interface Users {
    id: string,
    name: string,
    phone: string,
    apNumber: string,
    bloco: string,
    vehicle: string,
    placa: string,
    visitante: string,
    hora: string,
    obs: string
}

let users:Users[] = []
let visitor:infoVisitas[] = []

app.get('/users', (request, response) => {
    return allUsers(request, response)
})

const allUsers = async (request: any, response: any) => {
    try {
        let links = await Link.find({})
        users = []
        links.map((link: Users) => {
            users.push(link)
        })
    } catch (error) {
        response.send(error)
    }
    return response.json(users)
}

app.get('/visits', (request, response) => {
    return allVisits(request, response)
})

const allVisits = async (request: any, response: any) => {
    try {
        let visits = await Visit.find({})
        visitor = []
        visits.map((visit: infoVisitas) => {
            visitor.push(visit)
        })
    } catch (error) {
        console.warn(error)
    }
    return response.json(visitor)
}

app.get('/users/:apNumber', (request, response) => {
    const { apNumber } = request.params
    const userIndex = users.filter(user => user.apNumber === apNumber)

    console.log(userIndex)
    return response.json(userIndex)
})

app.get('/visits/:nameUser', (request, response) => {
    const { nameUser } = request.params
    let nome = nameUser
    const userIndex = visitor.filter(user => user.name.indexOf(nome.toLowerCase()) != -1)

    console.log(userIndex)
    return response.json(userIndex)
})

app.post('/visits', (request, response) => {
    const { name, phone, apNumber, bloco, data, hora } = request.body  

    const nome = name.toLowerCase()
    const visit = new Visit ({id: uuid(), name: nome, phone, apNumber, bloco, data, hora })
    visit.save()
    visitor.push(visit)
    return response.json(visit)
})

app.post('/users', (request, response) => {
    const { name, phone, apNumber, bloco, vehicle, placa } = request.body  

    const user = new Link ({id: uuid(), name, phone, apNumber, bloco, vehicle, placa, visitante: 'N/A', hora: 'N/A', obs: 'N/A' })
    user.save()
    users.push(user)
    return response.json(user)
})

app.post('/users/:id', (request, response) => {
    return updateUser(request, response)
})

const updateUser = async (request: any, response: any) => {
    const { id } = request.params
    const { name, phone, apNumber, bloco, vehicle, placa, obs } = request.body  

    try {
        const user = await Link.updateOne({id:id}, { name, phone, apNumber, bloco, vehicle, placa, obs })
    } catch (error) {
        
    }
}

app.delete('/users/:id', (request, response) => {
    
    return deleteUser(request, response)
})

const deleteUser = async (request: { params: { id: any } }, response: any) => {
    const { id } = request.params
    const userIndex = users.findIndex(user => user.id === id)
    const UserDB = await Link.find({ id: id })
    let idUser = 0
    UserDB.map((user: any) => idUser = user._id)
    
    users.splice(userIndex, 1)
    try {
        //await Link.deleteOne({_id:id})
        await Link.findByIdAndDelete(idUser)
    } catch (error) {
        response.status(404).send(error)
    }
    return response.json(users)
}

app.delete('/visits/:id', (request, response) => {
    
    return deleteVisit(request, response)
})

const deleteVisit = async (request: { params: { id: any } }, response: any) => {
    const { id } = request.params
    const userIndex = visitor.findIndex(user => user.id === id)
    const VisitDB = await Visit.find({ id: id })
    let idVisit = 0
    VisitDB.map((visit: any) => idVisit = visit._id)
    
    visitor.splice(userIndex, 1)
    try {
        //await Link.deleteOne({_id:id})
        await Visit.findByIdAndDelete(idVisit)
    } catch (error) {
        response.status(404).send(error)
    }
    return response.json(visitor)
}

app.listen('3333', () => console.log(`Server running on port 3333`))