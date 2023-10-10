import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialAuth1694434591472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "auth",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "userId",
            type: "varchar",
          },
          {
            name: "expiredAt",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "expired",
            type: "boolean",
          },
          {
            name: "lastLoginAt",
            type: "varchar",
          },
          {
            name: "token",
            type: "varchar",
          },
          {
            name: "createdAt",
            type: "integer",
          },
          {
            name: "updatedAt",
            type: "integer",
          },
          {
            name: "deletedAt",
            type: "integer",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("auth");
  }
}
