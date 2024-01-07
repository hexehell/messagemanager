
import SuburbModel from "@CampaignCreator/database/Schemas/Suburb/Suburb.schema";
import { AbstractSuburbData } from "../abstract/Suburb";
import { Suburb } from "../interfaces/Suburb";

export class SuburbMongo extends AbstractSuburbData {
  
    async getSuburbByID(id: string): Promise<Suburb | undefined> {



        return [(await SuburbModel.findOne({ _id: id }, {
            cp: 1,
            colonia: 1,
            estado: 1,
            municipio: 1,
            tipo: 1,
            asentamiento: 1,
            _id: 1,


        }))].map(suburb => ({

            cp: suburb?.cp,
            colonia: suburb?.colonia,
            estado: suburb?.estado,
            municipio: suburb?.municipio,
            tipo: suburb?.tipo,
            asentamiento: suburb?.asentamiento,
            id: suburb?._id

        } as Suburb))[0]

    }

    async findFirst(colonia:string){

        

        return [(await SuburbModel.findOne({ colonia: colonia }, {
            cp: 1,
            colonia: 1,
            estado: 1,
            municipio: 1,
            tipo: 1,
            asentamiento: 1,
            _id: 1,


        }))].map(suburb => ({

            cp: suburb?.cp,
            colonia: suburb?.colonia,
            estado: suburb?.estado,
            municipio: suburb?.municipio,
            tipo: suburb?.tipo,
            asentamiento: suburb?.asentamiento,
            id: suburb?._id

        } as Suburb))[0]

    }

    async listAllByName(): Promise<Suburb[]> {
        return (await SuburbModel.find({}, {
            cp: 1,
            colonia: 1,
            estado: 1,
            municipio: 1,
            tipo: 1,
            asentamiento: 1,
            _id: 1,


        })).map(suburb => ({

            cp: suburb?.cp,
            colonia: suburb?.colonia,
            estado: suburb?.estado,
            municipio: suburb?.municipio,
            tipo: suburb?.tipo,
            asentamiento: suburb?.asentamiento,
            id: suburb?._id

        } as Suburb))
    }

    async create({
        cp,
        colonia,
        estado,
        municipio,
        tipo,
        asentamiento
    }: Suburb): Promise<boolean> {

        return !!(await SuburbModel.create({
            cp: cp,
            colonia: colonia,
            estado: estado,
            municipio: municipio,
            tipo: tipo,
            asentamiento: asentamiento,
        }))
    }

    async update({ id,
        cp,
        colonia,
        estado,
        municipio,
        tipo,
        asentamiento }: Suburb): Promise<boolean> {

        return !!(await SuburbModel.updateOne({ _id: id }, {

            cp: cp,
            colonia: colonia,
            estado: estado,
            municipio: municipio,
            tipo: tipo,
            asentamiento: asentamiento,

        }))
    }

    async delete(old: Suburb): Promise<boolean> {

        return !!(await SuburbModel.deleteOne({ _id: old.id })).deletedCount


    }


}