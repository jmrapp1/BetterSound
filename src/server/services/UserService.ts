import {Service} from 'typedi';
import ServiceResponse from './response/ServiceResponse';
import UserLoginResource from '../../shared/resources/user/UserLoginResource';
import DatabaseService from './DatabaseService';
import {encode} from 'jwt-simple';
import JwtResource from '../../shared/resources/user/JwtResource';
import User, {UserDocument} from '../models/User';
import UserRegisterResource from '../../shared/resources/user/UserRegisterResource';
import UserCredsResource from "../../shared/resources/user/UserCredsResource";

@Service()
export default class UserService extends DatabaseService<UserDocument> {

    model = User;

    async login(loginResource: UserLoginResource): Promise<ServiceResponse<JwtResource>> {
        const userSearch = await this.findWithLimit({email: loginResource.email}, 1)
        if (!userSearch.isEmpty()) {
            const user = userSearch.data[0];
            const passValidated = await (user as any).comparePassword(loginResource.password);
            if (passValidated) {
                const token = encode(user, process.env.PASSPORT_SECRET);
                return new ServiceResponse(new JwtResource().init('Bearer ' + token));
            }
            throw new ServiceResponse('The username or password is incorrect.', 400);
        } else {
            throw new ServiceResponse('The username or password is incorrect.', 400);
        }
    }

    async validateRegisterData(registerResource: UserRegisterResource): Promise<ServiceResponse<any>> {
        const res = await this.find({email: registerResource.email})
        if (res.isEmpty()) {
            return new ServiceResponse();
        }
        throw new ServiceResponse('A user already exists with that email', 400);
    }

    async register(registerResource: UserRegisterResource): Promise<ServiceResponse<any>> {
        await this.validateRegisterData(registerResource)
        return this.insert({
            email: registerResource.email,
            password: registerResource.password,
        });
    }

    async setCreds(userReq: UserDocument, credsResource: UserCredsResource) {
        const user = await this.findById(userReq._id);
        let oauth = credsResource.oauth;
        if (oauth.toLowerCase().startsWith('oauth')) {
            oauth = oauth.substring(5).trim();
        }
        return await this.updateById(user.data._id, {
            clientId: credsResource.clientId,
            oauth: oauth
        }, true);
    }
}
