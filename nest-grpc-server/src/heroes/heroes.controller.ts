import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Controller('heroes')
export class HeroesController {
    @GrpcMethod('HeroService', 'FindOne')
    findOne(data: any, metaddata: Metadata, call: ServerUnaryCall<any, any>): any {
        const items = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Doe' }
        ];

        return items.find(({ id }) => id === data.id);
    }
}