import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post("/signup")
    createUser(@Body() createDto: CreateUserDto) {
        return this.userService.create(createDto.email, createDto.password)
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
