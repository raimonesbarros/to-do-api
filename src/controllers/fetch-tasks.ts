import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/auth/current-user-decorator";
import { Token } from "src/auth/jwt.strategy";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("/tasks")
@UseGuards(AuthGuard("jwt"))
export class FetchTaskController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@CurrentUser() user: Token) {
    const userId = user.sub;

    const notChecked = await this.prisma.task.findMany({
      where: {
        checked: false,
      },
    });

    const checked = await this.prisma.task.findMany({
      where: {
        checked: true,
      },
    });

    const total = notChecked.length + checked.length;

    const totalChecked = checked.length;

    return {
      tasks: {
        not_checked: notChecked,
        checked,
      },
      total,
      checked: totalChecked,
    };
  }
}
