import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { map, Observable, pipe } from "rxjs";


export function Serialize(dto: any) {
    return UseInterceptors(new SerializerInterceptor(dto))
}

class SerializerInterceptor implements NestInterceptor {

    constructor(private dto: any) { }
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // before hook
        return next.handle().pipe(
            map((data: any) => {
                // after hook
                return plainToClass(this.dto, data, { excludeExtraneousValues: true })
            })
        )
    }

}