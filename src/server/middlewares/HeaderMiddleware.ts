import {ExpressMiddlewareInterface, Middleware} from 'routing-controllers';

@Middleware({ type: 'before' })
class HeaderMiddleware implements ExpressMiddlewareInterface {

    use(request: any, res: any, next: (err?: any) => any): any {
        res.setHeader('Content-Type', 'application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Content-Security-Policy', 'connect-src self ws://*:* wss://192.168.1.158:* https: http:');
        next();
    }

}
