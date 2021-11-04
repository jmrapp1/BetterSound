import Resource from '../Resource';

export default class UserLoginResource extends Resource {

    email: string = '';
    password: string = '';

    init(email: string, password: string) {
        this.email = email;
        this.password = password;
        return this;
    }

}
