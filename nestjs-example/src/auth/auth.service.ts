import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { IsNotEmpty, IsString } from 'class-validator';
import { UserRepository } from '../repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterValidator, LoginValidator } from './auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
	) { }

	async register(body: RegisterValidator) {
		const user = await this.userRepository.findByCondition({ email: body?.email });
		// console.log(user);
		if (user) {
			throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
		}
		const hashedPass = await bcrypt.hash(body.password, 12);
		const newUser = await this.userRepository.create({ ...body, password: hashedPass });
		const token = await this.generateToken(newUser);
		return {
			user: { ...newUser._doc }, ...token
		};
	}

	async login(body: LoginValidator) {
		const user = await this.userRepository.findByCondition({ email: body?.email });
		if (!user) {
			throw new HttpException('Incorrect email or/and password', HttpStatus.BAD_REQUEST);
		}

		const isValidPass = await bcrypt.compare(body?.password, user?.password);
		if (!isValidPass) {
			throw new HttpException('Incorrect email or/and password', HttpStatus.BAD_REQUEST);
		}
		const token = await this.generateToken(user);
		return {
			user: { ...user._doc },
			...token
		}
	}

	private async generateToken(
		payload: RegisterValidator,
		isSecondFactorAuthenticated = false,
		refresh = true,
	) {
		const { email } = payload;
		const accessToken = this.jwtService.sign({ email, isSecondFactorAuthenticated }, {
			secret: process.env.SECRETKEY_ACCESS,
			expiresIn: process.env.EXPIRESIN
		});
		if (refresh) {
			const refreshToken = this.jwtService.sign({ email, isSecondFactorAuthenticated }, {
				secret: process.env.SECRETKEY_RF,
				expiresIn: process.env.EXPIRESIN_RF
			});
			await this.userRepository.update({ email: email }, {
				refreshToken: refreshToken
			});
			return {
				expiresIn: process.env.EXPIRESIN,
				accessToken,
				refreshToken,
				expiresInRefresh: process.env.EXPIRESIN_RF,
			}
		} else {
			return {
				accessToken,
				expiresIn: process.env.EXPIRESIN,
			}
		}
	}
}
