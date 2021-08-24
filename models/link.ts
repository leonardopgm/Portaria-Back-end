import { Schema, model } from 'mongoose';

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

const linkSchema = new Schema<Users>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    apNumber: {type: String, required: true},
    bloco: {type: String, required: true},
    vehicle: {type: String, required: true},
    placa: {type: String, required: true},
    visitante: {type: String, required: true},
    hora: {type: String, required: true},
    obs: {type: String, required: false}
})


module.exports = model<Users>('Link', linkSchema)