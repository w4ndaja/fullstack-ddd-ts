import { IBook } from "@/domain/model/book";
import { Repository } from "./repository";
import { IBookRepository } from "@/domain/service/book-repository";
import { injectable } from "inversify";

@injectable()
export class BookRepository extends Repository<IBook> implements IBookRepository {
  constructor() {
    super("books");
  }
  async getByParticipantId(participantId: string, status: string): Promise<IBook[]> {
    const collection = await this.collection.find(
      {
        participantId,
        ...(status !== "" ? { status } : {}),
      },
      {
        sort: {
          createdAt: -1,
        },
      }
    );
    if (!collection) {
      return [];
    }
    const arrayCollections = (await collection.toArray()).map((item) => item);
    return arrayCollections.map(({ _id, ...item }) => <IBook>item);
  }
  async getByMentorId(userId: string, status: string): Promise<IBook[]> {
    const collection = await this.collection.find(
      {
        "mentor.userId": userId,
        ...(status !== "" ? { status } : {}),
      },
      {
        sort: {
          createdAt: -1,
        },
      }
    );
    if (!collection) {
      return [];
    }
    const arrayCollections = (await collection.toArray()).map((item) => item);
    return arrayCollections.map(({ _id, ...item }) => <IBook>item);
  }
}
