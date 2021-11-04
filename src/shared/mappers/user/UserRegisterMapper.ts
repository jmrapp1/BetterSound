import * as EmailValidator from 'email-validator';
import ResourceMapper from '../ResourceMapper';
import UserRegisterResource from '../../resources/user/UserRegisterResource';

class UserRegisterMapper extends ResourceMapper {

    id = 'UserRegisterMapper';
    resourceType = UserRegisterResource;

    build(data): UserRegisterResource {
        return new UserRegisterResource().init(data.email, data.password, data.confirmPassword);
    }

    verifyStrictConstraints(resource: UserRegisterResource) {
        if (resource.password !== resource.confirmPassword) return 'Please make sure the passwords match.';
        if (resource.password.length < 6) return 'Please enter a password at least 6 characters long.';
        if (!EmailValidator.validate(resource.email)) return 'Please enter a valid email.';
    }

    getUndefinedKeyResponse(key: string) {
        if (key === 'confirmPassword') return 'Please enter the password confirmation.';
        if (key === 'password') return 'Please enter a password.';
        return 'Please enter your ' + key + '.';
    }

}

export default new UserRegisterMapper();
