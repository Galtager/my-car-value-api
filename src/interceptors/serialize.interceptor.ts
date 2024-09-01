import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable, pipe } from "rxjs";

interface ClassConstructor {
    new(...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializerInterceptor(dto))
}

class SerializerInterceptor implements NestInterceptor {

    constructor(private dto: ClassConstructor) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // before hook
        return next.handle().pipe(
            map((data: ClassConstructor) => {
                // after hook
                return plainToClass(this.dto, data, { excludeExtraneousValues: true })
            })
        )
    }

}