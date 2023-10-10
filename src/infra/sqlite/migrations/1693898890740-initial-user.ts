import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialUser1693898890740 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "fullname",
            type: "varchar",
          },
          {
            name: "username",
            type: "varchar",
          },
          {
            name: "password",
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
    await queryRunner.dropTable("user");
  }
}
