import { injectable } from "inversify";
import { Router, asyncWrapper } from "../libs";
import { MentorService } from "@/services";
import { NextFunction, Request, Response } from "express";
import { RestMapper } from "@/dto/mappers/rest-mapper";
import { IMentorSortType } from "@/domain/service";

@injectable()
export class MentorController extends Router {
  constructor(private mentorService: MentorService) {
    super("/mentors");
    this.routes.get("/", asyncWrapper(this.getMentors.bind(this)));
    this.routes.get("/sorted", asyncWrapper(this.getMentorsSorted.bind(this)));
    this.routes.get("/all", asyncWrapper(this.getAllMentors.bind(this)));
    this.routes.get("/:id/detail", asyncWrapper(this.getDetailMentor.bind(this)));
    this.routes.put("/:id/approve", asyncWrapper(this.approve.bind(this)));
  }
  private async getMentors(req: Request, res: Response, next: NextFunction): Promise<void> {
    const mentors = await this.mentorService.getMentors();
    res.json(RestMapper.dtoToRest(mentors));
  }
  private async getMentorsSorted(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { sortType } = req.query;
    const mentors = await this.mentorService.getMentorsSorted(<IMentorSortType>sortType);
    res.json(RestMapper.dtoToRest(mentors));
  }
  private async getAllMentors(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { search, category, limit, offset, sortBy, verified } = {
      search: req.query.search || "",
      category: req.query.category || "",
      limit: req.query.limit || "10",
      offset: req.query.offset || "0",
      sortBy: req.query.sortBy || "HIGHER_RATING",
      verified: req.query?.verified ? req.query?.verified === "true" : true,
    };
    const mentors = await this.mentorService.getAllMentors(
      <string>search,
      <string>category,
      <IMentorSortType>sortBy,
      Number(limit),
      Number(offset),
      verified
    );
    res.json(RestMapper.dtoToRest(mentors));
  }
  private async getDetailMentor(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.params;
    const mentor = await this.mentorService.getDetailMentor(id);
    res.json(RestMapper.dtoToRest(mentor));
  }
  private async approve(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await this.mentorService.approveMentor(id);
    res.json(RestMapper.dtoToRest(result));
  }
}
