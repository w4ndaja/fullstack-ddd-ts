import { IBaseGetParam, IGenericPaginatedData, PaginationLib } from "@/common/libs/pagination";
import { MongoDBConnection } from "./connection";
import { container } from "@/ioc/container";
import { Collection } from "mongodb";
import { IEntity } from "@/domain/model/entity";
import { injectable, unmanaged } from "inversify";
import { IRepository } from "@/domain/service/repository";

@injectable()
export class Repository<IData> implements IRepository<IData> {
  protected collectionName: string;
  protected collection: Collection;
  private connection: MongoDBConnection = container.get(MongoDBConnection);

  // @ts-ignore
  constructor(@unmanaged() collectionName: string) {
    this.collectionName = collectionName;
    this.collection = this.connection.database.collection(this.collectionName);
  }

  async findAll({ page, limit, search }: IBaseGetParam): Promise<IGenericPaginatedData<IData>> {
    const skip: number = PaginationLib.calcSkip(page, limit);
    const collections = await this.collection.find(
      {
        deletedAt: null,
        // TODO: DO Search Query
      },
      { limit, skip }
    );
    const arrayCollections = (await collections.toArray()).map((item) => item);
    const genericPaginatedData = {
      page,
      limit,
      data: arrayCollections.map(({ _id, ...item }) => <IData>item),
      totalRow: await this.collection.countDocuments(),
    };
    return <IGenericPaginatedData<IData>>genericPaginatedData;
  }

  async findById(id: string): Promise<IData> {
    const collection = await this.collection.findOne({ id });
    if (collection) {
      const { _id, ...data } = collection;
      return <IData>data;
    } else {
      throw new Error("Not Found");
    }
  }

  async save(_data: Partial<IData>): Promise<IData> {
    const data = <IEntity<IData>>{..._data};
    const checkExist = await this.collection.findOne({ id: data.id });
    if (checkExist?._id) {
      await this.collection.updateOne(
        { id: data.id },
        {
          $set: data,
        }
      );
    } else {
      await this.collection.insertOne(data);
    }
    return <IData>data;
  }
}
