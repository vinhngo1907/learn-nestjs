import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";

// Same options object used by microservices server
export const microserviceOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        package: 'hero',
        url:'0.0.0.0:3000',
        protoPath: join(__dirname, '/grpc/hero.proto')
    }
}