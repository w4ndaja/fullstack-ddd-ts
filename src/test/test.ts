import { container } from "@/ioc/container";
import { EmailService } from "@/services/email-service";

const emailService = container.get(EmailService);
emailService.subscribe('annas@rexhoster.id', '.Annasw4ndaja')