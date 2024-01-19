import { injectable } from "inversify";
import { Repository } from "./repository";
import { IMentor } from "@/domain/model/mentor";
import { IMentorRepository, IMentorSortType } from "@/domain/service/mentor-repository";

@injectable()
export class MentorRepository extends Repository<IMentor> implements IMentorRepository {
  constructor() {
    super("mentors");
  }
  async findByUserId(userId: string): Promise<IMentor | null> {
    const collection = await this.collection.findOne({ userId });
    if (!collection) {
      return null;
    }
    const { _id, ...data } = collection;
    return <IMentor>data;
  }
  async getMentors(): Promise<IMentor[]> {
    const collection = await this.collection.find({}, { limit: 50 });
    if (!collection) {
      return [];
    }
    const arrayCollections = (await collection.toArray()).map((item) => item);
    return arrayCollections.map(({ _id, ...item }) => <IMentor>item);
  }
  async getMentorsSorted(sortType: IMentorSortType): Promise<IMentor[]> {
    const collection = await this.collection.find(
      {},
      {
        limit: 50,
        sort: {
          ...(sortType === "rating" && { reviewPoint: -1 }),
          ...(sortType === "price" && { price: 1 }),
          ...(sortType === "certified" && { isCertified: -1 }),
        },
      }
    );
    if (!collection) {
      return [];
    }
    const arrayCollections = (await collection.toArray()).map((item) => item);
    return arrayCollections.map(({ _id, ...item }) => <IMentor>item);
  }
  async getAllMentors(
    search: string,
    category: string,
    sortBy: IMentorSortType,
    limit: number,
    offset: number
  ): Promise<IMentor[]> {
    const collection = await this.collection.aggregate([
      {
        $set: {
          certificatesCount: {
            $size: "$certificates",
          },
        },
      },
      ...(sortBy == "HIGHER_CERTIFICATE"
        ? [
            {
              $sort: {
                _id: 1,
                certificatesCount: -1,
              },
            },
          ]
        : []),
      ...(sortBy == "LOWER_PRICE"
        ? [
            {
              $sort: {
                _id: 1,
                price: 1,
              },
            },
          ]
        : []),
      ...(sortBy == "HIGHER_PRICE"
        ? [
            {
              $sort: {
                _id: 1,
                price: -1,
              },
            },
          ]
        : []),
      ...(sortBy == "HIGHER_RATING"
        ? [
            {
              $sort: {
                _id: 1,
                rating: -1,
              },
            },
          ]
        : []),
      {
        $match: {
          ...(search && { fullname: { $regex: search, $options: "i" } }),
          ...(category && { className: category }),
          // verifiedAt: {
          //   $ne: null,
          // },
        },
      },
      {
        $limit: limit + offset,
      },
      {
        $skip: offset,
      },
    ]);
    if (!collection) {
      return [];
    }
    const arrayCollections = (await collection.toArray()).map((item) => item);
    return arrayCollections.map(({ _id, ...item }) => <IMentor>item);
  }
}
