import mongoose, { Document, Schema } from 'mongoose';

export interface Suburb extends Document {
  cp: string;
  colonia: string;
  estado: string;
  municipio: string;
  tipo: string;
  asentamiento: string;
}

export const suburbSchema: Schema = new mongoose.Schema(
  {
    cp: String,
    colonia: String,
    estado: String,
    municipio: String,
    tipo: String,
    asentamiento: String,
  },
  {
    versionKey: false,
    collection: 'Suburbs',
    timestamps: { createdAt: false, updatedAt: false },
    autoCreate: false,
  }
);

const SuburbModel = mongoose.model<Suburb>('Suburb', suburbSchema);

export default SuburbModel