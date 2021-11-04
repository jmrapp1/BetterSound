import Resource from '../Resource';

export default class UserResource extends Resource {

    _id: string = '';
    email: string = '';
    clientId: string = '';
    oauth: string = '';

    init(_id: string, email: string, clientId: string, oauth: string) {
        this._id = _id;
        this.email = email;
        this.clientId = clientId;
        this.oauth = oauth;
        return this;
    }

}
