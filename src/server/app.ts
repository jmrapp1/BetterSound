import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
const contentSecurityPolicy = require("helmet-csp");
import 'reflect-metadata'; // required
import './mixins/underscore';
import registerPassport from './config/passport';

import {createExpressServer, useContainer} from 'routing-controllers';
import {Container} from 'typedi';

import DatabaseSetup from './util/DatabaseSetup';
import UserController from './controllers/UserController';
import SoundCloudController from "./controllers/SoundCloudController";
import {startWebSocketServer} from "./websocket/WebSocketServer";

useContainer(Container);

const express = require('express');

const app = createExpressServer({
    cors: true,
    routePrefix: '/api',
    controllers: [UserController, SoundCloudController]
});

dotenv.load({path: '.env'});

if (process.env.NODE_ENV === 'production') {
    console.log('Using production build');
    app.use(express.static('dist/client'));
}

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

registerPassport(passport);
app.use(passport.initialize());

app.use(function (err, req, res, next) {
    next(err);
});

(async () => {
    try {
        await new DatabaseSetup().setupDb();
        const server = app.listen(app.get('port'), () => {
            console.log('Listening on port ' + app.get('port'));
        });

        const wss = startWebSocketServer(server);

        for (const exitCode of ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException']) {
            process.on('SIGINT', function () {
                server.close(async function () {
                    await wss.destroyResources();
                });
            });
        }
    } catch (e) {
        console.error('ERROR: Encountered critical error: ', e);
    }
})();

export {app};
