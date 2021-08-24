import { Schema, model } from 'mongoose';

interface infoVisitas {
    id: string
    name: string
    phone: string
    apNumber: number
    bloco: string
    data: string
    hora: string
}

const linkSchema = new Schema<infoVisitas>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    apNumber: {type: String, required: true},
    bloco: {type: String, required: true},
    data: {type: String, required: true},
    hora: {type: String, required: true},
})


module.exports = model<infoVisitas>('Visit', linkSchema)