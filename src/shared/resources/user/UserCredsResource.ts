import Resource from '../Resource';

export default class UserCredsResource extends Resource {

    clientId: string = '';
    oauth: string = '';

    init(clientId: string, oauth: string) {
        this.clientId = clientId;
        this.oauth = oauth;
        return this;
    }

}
