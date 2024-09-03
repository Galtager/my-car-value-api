import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password })
        }

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService, useValue: fakeUsersService

                }]
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    it('can create an instance of auth service', () => {
        expect(authService).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await authService.signup("gal@test.com", 'somePass');
        expect(user.password).not.toEqual("somePass");
        const [salt, hash] = user.password.split(".");
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()

    });
    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' }]);
        await expect(authService.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(BadRequestException);
    });
    it('throws if signin is called with an unused email', async () => {
        await expect(authService.signin('asdflkj@asdlfkj.com', 'passdflkj')).rejects.toThrow(NotFoundException);
    });
    it('throw error when user password incorrect', async () => {
        const { id, email, password } = await authService.signup("gal@test.com", 'somePass');
        fakeUsersService.find = () => Promise.resolve([{ id, email, password }]);
        await expect(authService.signin('asdflkj@asdlfkj.com', 'somePass2')).rejects.toThrow(BadRequestException);
    });
    it('sign in user with correct credentials', async () => {
        const { id, email, password } = await authService.signup("gal@test.com", 'somePass');
        fakeUsersService.find = () => Promise.resolve([{ id, email, password }]);

        const user = await authService.signin("gal@test.com", 'somePass');
        expect(user.id).toEqual(id)
    });
});
