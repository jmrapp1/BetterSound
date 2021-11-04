import ResourceMapper from '../ResourceMapper';
import UserResource from "../../resources/user/UserResource";

class UserMapper extends ResourceMapper {

    id = 'UserMapper';
    resourceType = UserResource;

    build(data): UserResource {
        return new UserResource().init(data._id, data.email, data.clientId, data.oauth);
    }

    getUndefinedKeyResponse(key: string) {
        return 'Please enter your ' + key + '.';
    }

}

export default new UserMapper();
