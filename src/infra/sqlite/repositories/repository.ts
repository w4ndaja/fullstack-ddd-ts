import { calcSkip } from "@/common/libs/pagination/calc-skip";
import { IBaseGetParam, ICreateGenericPaginatedData } from "@/common/libs/pagination";
import { EntityTarget, IsNull, ObjectLiteral, Repository as RepositoryTypeOrm } from "typeorm";
import { SQLiteDataSource } from "../data-source";
import { Entity, IEntity } from "@/domain/model/entity";
import { container } from "@/ioc/container";
import { IRepository } from "@/domain/service/repository";

export class Repository<I> implements IRepository<I> {
  protected typeormModel: EntityTarget<ObjectLiteral>;
  protected repository: RepositoryTypeOrm<ObjectLiteral>;
  protected datasource: SQLiteDataSource;

  constructor(typeormModel: object) {
    this.typeormModel = <EntityTarget<ObjectLiteral>>typeormModel;
    this.datasource = container.get<SQLiteDataSource>(SQLiteDataSource);
    this.repository = this.datasource.datasource.getRepository(this.typeormModel);
  }

  async findAll({ page, limit, search }: IBaseGetParam): Promise<ICreateGenericPaginatedData<I>> {
    await this.datasource.waitUntilInitialized;
    const [data, totalRow] = await this.repository.findAndCount({
      skip: calcSkip(page, limit),
      take: limit,
      where: {
        deletedAt: IsNull(),
      },
      order: {
        createdAt: "DESC",
      },
    });
    return {
      page,
      limit,
      data: <I[]>data,
      totalRow,
    };
  }

  async findById(id: string): Promise<I> {
    await this.datasource.waitUntilInitialized;
    const resultSqlite = await this.repository.findOneBy({ id });
    if (resultSqlite) return <I>resultSqlite;
    throw new Error("NOT FOUND");
  }

  async save(data: I): Promise<I> {
    await this.datasource.waitUntilInitialized;
    const resultSqlite = await this.repository.save({
      ...data,
      deletedAt: (<IEntity<I>>data).deletedAt || undefined,
    });
    return <I>Entity.create(resultSqlite);
  }
}
