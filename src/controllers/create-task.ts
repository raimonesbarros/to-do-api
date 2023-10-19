import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { Token } from "src/auth/jwt.strategy";
import { ZodValidationPipe } from "src/pipes/zod-validation.pipes";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { getAllTasks } from "./fetch-tasks";

const createTaskBodySchema = z.object({
  content: z.string().min(1),
  checked: z.boolean().optional().default(false),
});

const bodyValidationPipe = new ZodValidationPipe(createTaskBodySchema);

type Task = z.infer<typeof createTaskBodySchema>;

@Controller("/tasks")
@UseGuards(AuthGuard("jwt"))
export class CreateTaskController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: Task,
    @CurrentUser() user: Token
  ) {
    const { content, checked } = body;
    const userId = user.sub;

    await this.prisma.task.create({
      data: {
        content,
        checked,
        userId,
      },
    });

    const tasks = await getAllTasks(userId, this.prisma);

    return tasks;
  }
}
