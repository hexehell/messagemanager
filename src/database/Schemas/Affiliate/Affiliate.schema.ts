import mongoose from "mongoose";
import { Document,  } from 'mongoose';
import { Sponsor } from "../Sponsor/Sponsor.schema";
import { Suburb } from "../Suburb/Suburb.schema";

interface Affiliate extends Document {
    name: string;
    phone: string;
    marital: boolean;
    kids: boolean;
    birthDate?: Date;
    suburb: mongoose.Types.ObjectId |Suburb ;
    sponsor: mongoose.Types.ObjectId| Sponsor;
    relation: 'AFILIADO' | 'EXTERNO' | 'SINDICALIZADO';
    active: boolean;
}


// Definición del esquema
const affiliateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    marital: {
        type: Boolean,
        default: false
    },
    kids: {
        type: Boolean,
        default: false
    },
    birthDate: Date,
    suburb: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Suburb'
    },
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sponsor'
    },
    relation: {
        type: String,
        required: true,
        default: 'AFILIADO',
        enum: ['AFILIADO', 'EXTERNO', 'SINDICALIZADO']
    },
    active: {
        type: Boolean,
        default: true
    }
}, { collection: 'Affiliates' }); // Nombre de la colección

// Crear el modelo a partir del esquema
 const AffiliateModel = mongoose.model<Affiliate>('Affiliate', affiliateSchema);

export default AffiliateModel