import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    async create(email: string, password: string) {
        try {
            const user = this.repo.create({ email, password })
            return await this.repo.save(user);

        } catch (error) {
            throw error
        }
    }
    async findOne(id: number) {
        try {
            if (!id) { return null }
            return await this.repo.findOneBy({ id });
        } catch (error) {
            throw error
        }
    }
    async find(email: string) {
        try {
            return await this.repo.find({ where: { email } });
        } catch (error) {
            throw error
        }
    }
    async update(id: number, attrs: Partial<User>) {
        try {
            if (!id) { return null; }
            const user = await this.repo.findOneBy({ id });
            if (!user) {
                throw new NotFoundError('user not found')
            }
            const newUser = Object.assign(user, attrs)
            return await this.repo.save(newUser);
        } catch (error) {
            throw error
        }
    }
    async remove(id: number) {
        try {
            if (!id) { return null; }
            const user = await this.repo.findOneBy({ id });
            if (!user) {
                throw new Error('user not found')
            }
            return await this.repo.remove(user);
        } catch (error) {
            throw error
        }
    }

}
