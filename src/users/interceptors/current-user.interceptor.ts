import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../../users/users.service";
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