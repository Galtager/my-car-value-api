import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {

    fakeAuthService = {
      signup: (email: string, password: string) => Promise.resolve({ id: 1, email, password }),
      signin: (email: string, password: string) => Promise.resolve({ id: 3, email, password })
    }
    fakeUsersService = {
      find: (email: string) => Promise.resolve([{ id: 1, email, password: "test" }]),
      findOne: (id: number) => Promise.resolve({ id, email: "test@test.com", password: "test" }),
      remove: (id: number) => Promise.resolve({ id, email: "test@test.com", password: "test" }),
      update: (id: number, attrs: Partial<User>) => Promise.resolve({ id, email: "test@test.com", password: "test", ...attrs })
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService }]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of the users with the given email', async () => {
    const users = await controller.findAllUsers("gal@email.com")
    expect(users.length).toBe(1);
    expect(users[0].email).toEqual("gal@email.com");

  });
  it('findUser return a single user with the given id', async () => {
    const userId = 2
    const user = await controller.findUser(userId.toString())
    expect(user).toBeDefined();
    expect(user.id).toEqual(userId);

  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session: { userId?: string } = {}
    const user = await controller.signIn({ email: "test@test.com", password: "testPass" }, session);
    expect(session.userId).toEqual(3)
    expect(user.id).toEqual(3)
  });
});
