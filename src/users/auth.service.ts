import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { randomBytes, scrypt } from 'crypto';


const _scrypt = promisify(scrypt)

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {

        const user = await this.usersService.find(email);
        if (user.length) {
            throw new BadRequestException('email already in use')
        }

        const salt = randomBytes(8).toString('hex');
        const hash = await _scrypt(password, salt, 32) as Buffer;
        const result = salt + '.' + hash.toString('hex')

        const createdUser = this.usersService.create(email, result)
        return createdUser

    }
    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException('bad credentials')
        }

        const [salt, storedHash] = user.password.split('.')
        const hash = await _scrypt(password, salt, 32) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad credentials')
        }

        return user;

    }
}
