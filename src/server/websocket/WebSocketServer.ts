import {UserSocket} from "./UserSocket";

const ws = require('ws');
const jwt = require('jsonwebtoken');
import UserService from "../services/UserService";
import {Container} from "typedi";
import * as queryString from "querystring";

function keepAliveCheck(wss) {
    return setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) {
                console.log('Disconnecting dead socket');
                ws.userSocket.destroy();
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping(() => {
                console.log('Got ping');
                ws.isAlive = true;
            })
        })
    }, 30000)
}

async function verifyJwt(token): Promise<{ validated: boolean, user?: object}>  {
    return new Promise(resolve => {
        const userService = Container.get(UserService);
        jwt.verify(token, process.env.PASSPORT_SECRET, async function (err, payload){
            if (err === undefined || err === null) {
                try {
                    const user = await userService.findById(payload._id);
                    return resolve({validated: true, user: user.data});
                } catch (e) {
                }
            }
            return resolve({ validated: false });
        });
    })
}

async function validateAuth(connectionParams): Promise<{ validated: boolean, user?: object}> {
    if (connectionParams.auth?.startsWith('Bearer ')) {
        return await verifyJwt(connectionParams.auth.substring(7));
    }
    console.log('Failed to auth user through ws');
    return { validated: false };
}

function createUserSocket(wss, socket, user) {
    new UserSocket(socket, user);
}

export function startWebSocketServer(expressServer) {
    const wss = new ws.Server({
        noServer: true,
        path: "/ws",
    });
    console.log('Started WebSocket Server.');

    expressServer.on("upgrade", async (request, socket, head) => {
        const [_path, params] = request?.url?.split("?");
        const connectionParams = queryString.parse(params);

        const authRes = await validateAuth(connectionParams);
        if (authRes.validated) {
            wss.handleUpgrade(request, socket, head, (websocket) => {
                wss.emit("connection", websocket, request, authRes.user);
            });
        } else {
            socket.write('HTTP/1.1 401 Web Socket Protocol Handshake\r\n' +
                'Upgrade: WebSocket\r\n' +
                'Connection: Upgrade\r\n' +
                '\r\n');
            socket.destroy();
            return;
        }
    });

    wss.on(
        "connection",
        function connection(webSocket, connectionRequest, user) {
            createUserSocket(wss, webSocket, user);
        }
    );

    const keepAliveInterval = keepAliveCheck(wss);

    wss.destroyResources = async function() {
        return new Promise((resolve, reject) => {
            clearInterval(keepAliveInterval);
            for (const client of wss.clients) {
                ws.terminate();
            }
            wss.close(cb => resolve(null));
        });
    }

    return wss;
}
