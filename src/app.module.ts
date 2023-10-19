import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateController } from "./controllers/authenticate";
import { CreateAccountController } from "./controllers/create-account";
import { CreateTaskController } from "./controllers/create-task";
import { FetchTaskController } from "./controllers/fetch-tasks";
import { ModifyTaskController } from "./controllers/modify-task";
import { PrismaService } from "./prisma/prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateTaskController,
    FetchTaskController,
    ModifyTaskController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
