import { Controller, Delete, Param, Patch, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { Token } from "src/auth/jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { getAllTasks } from "./fetch-tasks";

const modifyQuerySchema = z.string().uuid();

type Params = z.infer<typeof modifyQuerySchema>;

@Controller("/tasks")
@UseGuards(AuthGuard("jwt"))
export class ModifyTaskController {
  constructor(private prisma: PrismaService) {}

  @Delete(":id")
  async handleDelete(@Param("id") taskId: Params, @CurrentUser() user: Token) {
    const userId = user.sub;

    await this.prisma.task.delete({
      where: {
        userId,
        id: taskId,
      },
    });
  }

  @Patch(":id")
  async handleMarkAsChecked(
    @Param("id") taskId: Params,
    @CurrentUser() user: Token
  ) {
    const userId = user.sub;

    const task = await this.prisma.task.findUnique({
      where: {
        userId,
        id: taskId,
      },
    });

    await this.prisma.task.update({
      where: {
        userId,
        id: taskId,
      },
      data: {
        checked: !task?.checked,
      },
    });

    const tasks = await getAllTasks(userId, this.prisma);

    return tasks;
  }
}
