import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NestMiddleware } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../users/users.service";
import { User } from "../users/user.entity";
import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private usersService: UsersService) { }


    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {};
        if (userId) {
            const user = await this.usersService.findOne(userId)
            req.currentUser = user;
        }
        return next()
    }
}