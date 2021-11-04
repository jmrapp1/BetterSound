import Resource from '../Resource';

export default class UserRegisterResource extends Resource {

    email: string = '';
    password: string = '';
    confirmPassword: string = '';

    init(email: string, password: string, confirmPassword: string) {
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        return this;
    }

}
