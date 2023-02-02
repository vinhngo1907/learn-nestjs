import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { Post, Body } from "@nestjs/common"
import { IsNotEmpty, IsString } from 'class-validator';


class RegisterValidator {
    @IsNotEmpty() @IsString() email: string;
    @IsNotEmpty() @IsString() name: string;
    @IsNotEmpty() @IsString() password: string;
}

@Controller('/api/auth')

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: RegisterValidator) {
        try {
            const obj = new RegisterValidator();
            if (Object.keys(body).length < 0) {
                throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
            }
            return await this.authService.register(body);
        } catch (error: any) {
            console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('login')
    async login(@Body() body: { email: string, password: string }) {
        try {
            if (!body.email || !body.password) {
                throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
            }
            return await this.authService.login(body);
        } catch (error: any) {
            // console.log(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
