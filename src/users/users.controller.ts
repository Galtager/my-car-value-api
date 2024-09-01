import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @Post("/signup")
    async createUser(@Body() createDto: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(createDto.email, createDto.password);
        session.userId = user.id
        return user;
    }
    @Post("/signin")
    async signIn(@Body() createDto: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(createDto.email, createDto.password);
        session.userId = user.id
        return user;
    }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@Req() requst: Request) {
        return requst.currentUser;
    }

    @Post("/signout")
    async signOut(@Session() session: any) {
        session.userId = null
    }
    @Get("/:id")
    async findUser(@Param("id") id: string) {
        return await this.userService.findOne(+id)
    }
    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email)
    }
    @Patch("/:id")
    updateUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(+id, updateUserDto)
    }
    @Delete("/:id")
    removeUser(@Param("id") id: string) {
        return this.userService.remove(+id)
    }
}
