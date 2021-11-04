import ResourceMapper from '../ResourceMapper';
import UserCredsResource from "../../resources/user/UserCredsResource";

class UserCredsMapper extends ResourceMapper {

    id = 'UserCredsMapper';
    resourceType = UserCredsResource;

    build(data): UserCredsResource {
        return new UserCredsResource().init(data.clientId, data.oauth);
    }

    getUndefinedKeyResponse(key: string) {
        return 'Please enter your ' + key + '.';
    }

}

export default new UserCredsMapper();
