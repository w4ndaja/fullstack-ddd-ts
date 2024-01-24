import { IBook } from "@/domain/model/book";
import { Repository } from "./repository";
import { IBookRepository } from "@/domain/service/book-repository";
import { injectable } from "inversify";

@injectable()
export class BookRepository extends Repository<IBook> implements IBookRepository {
  constructor() {
    super("books");
  }
  async findByOrderId(orderId: string): Promise<IBook> {
    const mongo = await this.collection.findOne({ bookId: orderId });
    const { _id, ...bookDto } = mongo;
    return <IBook>bookDto;
  }
  async findByParticipantAndMentorId(
    participantId: string,
    mentorUserId: string
  ): Promise<IBook | null> {
    const bookMongo = await this.collection.findOne(
      {
        participantId: participantId,
        "mentor.userId": mentorUserId,
        expiredDate: {
          $gte: Date.now(),
        },
      },
      {
        sort: {
          createdAt: -1,
        },
      }
    );
    if (!bookMongo) return null;
    const { _id, ..._bookMongo } = bookMongo;
    return <IBook>_bookMongo;
  }
  async findAllByParticipantId(participantId: string, status: string): Promise<IBook[]> {
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
  async findAllByMentorId(userId: string, status: string): Promise<IBook[]> {
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
