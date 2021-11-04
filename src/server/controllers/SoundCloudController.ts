import {BodyParam, Get, JsonController, Post, QueryParam, Req, Res, UseBefore} from 'routing-controllers';
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
import SoundCloudService from "../services/SoundCloudService";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import {UserDocument} from "../models/User";

@JsonController('/sc')
export default class SoundCloudController extends BaseController {

    @Inject()
    soundCloudService: SoundCloudService;

    @Get('/me')
    @UseBefore(AuthMiddleware)
    async me(@Req() request: any, @Res() response: any) {
        const user = request.user as UserDocument;
        return this.soundCloudService.getMe(user.oauth).then(
            me => response.status(200).json(me),
            err => this.handleServiceError(response, err));
    }

    @Get('/history')
    @UseBefore(AuthMiddleware)
    async history(@Req() request: any, @Res() response: any) {
        const user = request.user as UserDocument;
        return this.soundCloudService.getPlayHistory(user.oauth, user.clientId).then(
            history => response.status(200).json(history),
            err => this.handleServiceError(response, err));
    }

    @Get('/liked')
    @UseBefore(AuthMiddleware)
    async liked(@Req() request: any, @QueryParam("userId") userId: string, @Res() response: any) {
        const user = request.user as UserDocument;
        return this.soundCloudService.getLikedTracks(userId, user.clientId).then(
            liked => response.status(200).json(liked),
            err => this.handleServiceError(response, err));
    }

    @Get('/stream')
    @UseBefore(AuthMiddleware)
    async stream(@Req() request: any, @QueryParam("trackId") trackId: string, @Res() response: any) {
        const user = request.user as UserDocument;
        return this.soundCloudService.getTrackStream(user.oauth, trackId).then(
            stream => response.status(200).json(stream),
            err => this.handleServiceError(response, err));
    }
}
