"use server";
import { AppError } from "@/common/libs/error-handler";
import { container } from "@/ioc/container";
import { LiveTrainingService } from "@/services";
const liveTrainingService = container.get<LiveTrainingService>(LiveTrainingService);
export async function getLiveTraining(roomId: string, mentorId: string) {
  try {
    const result = await liveTrainingService.findActiveByRoomIdAndMentorId(roomId, mentorId);
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
}
