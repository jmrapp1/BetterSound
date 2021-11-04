import {BodyParam, Get, JsonController, Post, Put, Req, Res, UseBefore} from 'routing-controllers';
import { encode } from 'jwt-simple';
import { BuildResource } from '../decorators/BuildResource';
import UserRegisterMapper from '../../shared/mappers/user/UserRegisterMapper';
import UserRegisterResource from '../../shared/resources/user/UserRegisterResource';
import HttpUtils from '../util/HttpUtils';
import UserLoginMapper from '../../shared/mappers/user/UserLoginMapper';
import UserLoginResource from '../../shared/resources/user/UserLoginResource';
import { Inject } from 'typedi';
import UserService from '../services/UserService';
import JwtMapper from '../../shared/mappers/user/JwtMapper';
import BaseController from './BaseController';
import UserCredsMapper from "../../shared/mappers/user/UserCredsMapper";
import UserCredsResource from "../../shared/resources/user/UserCredsResource";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import UserMapper from "../../shared/mappers/user/UserMapper";

@JsonController('/user')
export default class UserController extends BaseController {

    @Inject()
    userService: UserService;

    @Post('/register')
    register(@Res() response: any, @BuildResource(UserRegisterMapper, true) registerResource: UserRegisterResource) {
        if (!registerResource) return response;
        return this.userService.register(registerResource).then(
            res => response.status(200).json({}),
            err => this.handleServiceError(response, err)
        );
    }

    @Post('/login')
    login(@Res() response: any, @BuildResource(UserLoginMapper, true) loginResource: UserLoginResource) {
        if (!loginResource) return response;
        return this.userService.login(loginResource).then(
            res => response.status(200).json(HttpUtils.mappedResourceToJson(res.data, JwtMapper)),
            err => this.handleServiceError(response, err)
        );
    }

    @Put('/creds')
    @UseBefore(AuthMiddleware)
    setUserCreds(@Req() request: any, @Res() response: any, @BuildResource(UserCredsMapper, true) credsRes: UserCredsResource) {
        if (!credsRes) return response;
        const user = request.user;
        return this.userService.setCreds(user, credsRes).then(
            res => response.status(200).json(HttpUtils.mappedResourceToJson(res.data, UserMapper)),
            err => this.handleServiceError(response, err)
        );
    }

    @Get('/auth')
    @UseBefore(AuthMiddleware)
    auth(@Res() response: any) {
        return response.status(200).json({});
    }
}
