import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { Caracteristicas_ProductoEntity } from "../entities/implements/Caracteristicas_ProductoEntity";
import { CaracteristicasEntity } from "../entities/implements/CaracteristicasEntity";
import { ProductoEntity } from "../entities/implements/ProductoEntity";

dotenv.config();


const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        Caracteristicas_ProductoEntity, 
        CaracteristicasEntity,
        ProductoEntity
    ],
    subscribers: [],
    migrations: [],
    ssl: true
});
export default AppDataSource;