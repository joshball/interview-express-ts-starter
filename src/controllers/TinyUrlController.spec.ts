import request from 'supertest';
import { log, off } from '../services/LogService';
import { app } from '../app';

off();

describe('Test TinyUrlController', () => {
    it('POST to create tiny url with https://www.singularity6.com/ should return valid short', async () => {
        const origUrl = 'https://www.singularity6.com/';
        const expiresOn = Date.now();
        const body = {
            url: origUrl,
        };
        const createResult = await request(app).post('/').send(body);
        console.log('TEST result', createResult.status, createResult.body);

        expect(createResult.status).toBe(201);
        const D = createResult.body.data;

        expect(D.origUrl).toBe(origUrl);
        expect(D.expiresOn).toBeGreaterThanOrEqual(expiresOn);
        expect(D.shortUrl.length).toBe(6);

        const lookupUrl = `/${D.shortUrl}`;
        const lookupResult = await request(app).get(lookupUrl).send();
        log('lookupResult status: ', lookupResult.status);
        log('lookupResult body: ', lookupResult.body);
    });

    it('GET to invalid should return not found', async () => {
        const lookupUrl = '/invalid';
        const lookupResult = await request(app).get(lookupUrl).send();
        log('lookupResult status: ', lookupResult.status);
        log('lookupResult body: ', lookupResult.body);
        expect(lookupResult.status).toBe(404);
    });
});
