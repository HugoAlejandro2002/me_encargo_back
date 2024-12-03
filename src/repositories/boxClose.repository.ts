import AppDataSource from "../config/dataSource";
import { ICategoria } from "../entities/ICategoria";
import { ICierreCaja } from "../entities/ICierreCaja";
import { CierreCajaEntity } from "../entities/implements/CierreCajaEntity";
import { Categoria } from "../models/Categoria";

const boxCloseRepository = AppDataSource.getRepository(CierreCajaEntity);

const findAll = async (): Promise<ICierreCaja[]> => {
  return await boxCloseRepository.find();
};

const registerBoxClose = async (
  boxClose: ICierreCaja
): Promise<ICierreCaja> => {
  const newBoxClose = boxCloseRepository.create(boxClose);
  const savedBoxClose = await boxCloseRepository.save(newBoxClose);
  return savedBoxClose;
};

const getBoxCloseById = async (id: number) => {
  return await boxCloseRepository.findOne({
    where: {
      id_cierre_caja: id,
    },
  });
};

export const BoxCloseRepository = {
  findAll,
  registerBoxClose,
  getBoxCloseById,
};