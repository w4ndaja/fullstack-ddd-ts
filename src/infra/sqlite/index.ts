import { container } from "@/ioc/container";
import { SQLiteDataSource } from "./data-source";

const dataSource = container.get<SQLiteDataSource>(SQLiteDataSource);
export default dataSource.datasource;
