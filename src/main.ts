import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Env } from "env";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  const corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.enableCors(corsOptions);

  const configService = app.get<ConfigService<Env, true>>(ConfigService);
  const PORT = configService.get("PORT", { infer: true });

  await app.listen(PORT);
}

bootstrap();
