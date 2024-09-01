import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { handleRetry } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { map, Observable, pipe } from "rxjs";
import { UsersService } from "src/users/users.service";
import { User } from "../user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}


@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

    constructor(private usersService: UsersService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        // before hook
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};
        if (userId) {
            const user = await this.usersService.findOne(userId)
            request.currentUser = user;
        }
        return next.handle()
    }

}