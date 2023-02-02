import { IsNotEmpty, IsString } from "class-validator";

export class RegisterValidator {
	@IsNotEmpty() @IsString() email: string;
	@IsNotEmpty() @IsString() name: string;
	@IsNotEmpty() @IsString() password: string;
}

export class LoginValidator {
	@IsNotEmpty() @IsString() email: string;
	@IsNotEmpty() @IsString() password: string;
}