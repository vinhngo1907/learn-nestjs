import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { microserviceOptions } from "./grpc/gRPC.options";
import { Observable } from 'rxjs';
import { join } from 'path';

interface HeroesService {
  FindOne(data: { id: number }): Observable<any>;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  
  @Client({
    transport: Transport.GRPC,
    options: {
        package: 'hero',
        url:'0.0.0.0:3000',
        protoPath: join(__dirname, '/../../src/grpc/hero.proto')
    }
  }) 
  private client: ClientGrpc;
  private heroesService: HeroesService;
  
  onModuleInit() {
    this.heroesService = this.client.getService<HeroesService>('HeroService')
  }

  @Get()
  getHello(): Observable<string> {
    return this.heroesService.FindOne({ id: 1 })
  }
  // getHello(): string {
  //   return this.appService.getHello();
  // }

}
