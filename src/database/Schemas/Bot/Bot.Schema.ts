import mongoose from "mongoose";
import { Document,  } from 'mongoose';


interface Bot extends Document {
    id: string;
    phone: string;
    botType:string
}


// Definición del esquema
const botSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    botType: {
        type:String,
        required:true,
        default:'wwjs'

    }
}, { collection: 'Bot',timestamps: { createdAt: false, updatedAt: 'updatedAt' }, }); // Nombre de la colección

// Crear el modelo a partir del esquema
 const BotModel = mongoose.model<Bot>('Bot', botSchema);

export default BotModel