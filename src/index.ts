import "reflect-metadata";
import { container } from "@/ioc/container";
import { WebServer } from "@/presentation/web/web-server";

// Initialize Web Server
container.get(WebServer);
