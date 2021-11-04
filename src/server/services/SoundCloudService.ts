import {Service} from 'typedi';
import ServiceResponse from "./response/ServiceResponse";

const axios = require('axios');

const APP_VERSION = 1635861800;
const LOCALE = 'en';

const API_ROOT = 'https://api-v2.soundcloud.com';
const API_ME = '/me';
const API_TRACK = '/tracks/{trackId}';
const API_PLAY_HISTORY = `/me/play-history/tracks?client_id={clientId}&limit=25&offset={offset}&linked_partitioning=1&app_version=${APP_VERSION}&app_locale=${LOCALE}`
const API_LIKED_TRACKS = `/users/{userId}/track_likes?limit=24&client_id={clientId}&app_version=${APP_VERSION}&app_locale=${LOCALE}`

const API_HEADERS = {
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Host": "api-v2.soundcloud.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
    "Accept": "application/json, text/javascript, */*; q=0.01"
}

@Service()
export default class SoundCloudService {

    async getMe(oauth: string) {
        this.verifyOAuth(oauth);
        const res = await axios({
            method: 'get',
            url: API_ROOT + API_ME,
            headers: {
                ...API_HEADERS,
                'Authorization': this.buildOAuthToken(oauth)
            }
        });
        return res.data;
    }

    async getPlayHistory(oauth: string, clientId: string, offset = 0) {
        this.verifyOAuth(oauth);
        this.verifyClientId(clientId);
        const res = await axios({
            method: 'get',
            url: API_ROOT + API_PLAY_HISTORY
                .replace('{clientId}', clientId)
                .replace('{offset}', offset + ''),
            headers: {
                ...API_HEADERS,
                'Authorization': this.buildOAuthToken(oauth)
            }
        });
        return res.data;
    }

    async getLikedTracks(userId: string, clientId: string, offset?: number) {
        this.verifyClientId(clientId);
        const res = await axios({
            method: 'get',
            url: API_ROOT + API_LIKED_TRACKS
                .replace('{clientId}', clientId)
                .replace('{userId}', userId),
            headers: API_HEADERS
        });
        return res.data;
    }

    async getTrackStream(oauth: string, trackId: string) {
        this.verifyOAuth(oauth);
        const res = await axios({
            method: 'get',
            url: API_ROOT + API_TRACK
                .replace('{trackId}', trackId),
            headers: {
                ...API_HEADERS,
                'Authorization': this.buildOAuthToken(oauth)
            }
        });

        const trackMediaData = res.data?.media?.transcodings;
        if (!trackMediaData || trackMediaData.length == 0) {
            throw new Error('Unable to stream requested track');
        }

        const streamRes = await axios({
            method: 'get',
            url: trackMediaData[0].url,
            headers: {
                ...API_HEADERS,
                'Authorization': this.buildOAuthToken(oauth)
            }
        });
        const streamUrl = streamRes.data.url;
        if (!streamUrl) {
            throw new Error('Unable to stream requested track');
        }
        return { url: streamUrl };
    }

    private buildOAuthToken(oauth: string) {
        if (!oauth.toLowerCase().startsWith("oauth")) {
            return 'OAuth ' + oauth;
        }
        return oauth;
    }

    private verifyOAuth(oauth: string) {
        if (!oauth || oauth.trim().length === 0) {
            throw new ServiceResponse('Please provide your OAuth token through your user settings.', 400);
        }
    }

    private verifyClientId(clientId: string) {
        if (!clientId || clientId.trim().length === 0) {
            throw new ServiceResponse('Please provide your Client ID through your user settings.', 400);
        }
    }

}
