import { log, dump, error } from './LogService';
import md5 from 'blueimp-md5';
import btoa from 'btoa';

export interface ICreateTinyUrlResp {
    shortUrl: string;
    origUrl: string;
    expiresOn: number;
    userId: string;
}

export interface ILookupUrlResp {
    shortUrl: string;
    origUrl: string;
    expiresOn: number;
    userId: string;
}

export const hexToBase64 = (hexStr:string):any => {
    const m = hexStr.match(/\w{2}/g);
    if (!m) {
        throw new Error('Invalid BTOA match on hexStr');
    }
    return btoa(m.map(function (a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(''));
};

/**
 * This should really be its own service to scale
 * Change in thought, originally, I was thinking we could use the original url
 * and hash that, but then we didn't want conflicts with other users and that url
 * (the same url should not hash to the same short url from another user, as the
 * there may be different expirations or deletions)
 * So then I thought of appeneding the user id to it, which I could, but didn't
 * have the user id implemented yet.
 * Thinking about it again, that seems like it is coupling users with the url too
 * much. Really, this is just a random string, right? So lets just generate random
 * strings! We can even pregenerate them! Have a bunch of them ready to go and
 * send them to the servers in a batch. And to many servers if needed. This would
 * scale really well. Kinda cool I think
 * But for now, here is a simple implementation
 * OK, now about the key...
 * Base64 gives us, obviously, 64 possibilities per char. If we use a 6 character
 * long url, that is 64^6 => which is 68 billion. If we shortened 10 mil urls per day
 * that would give us 18 years before we ran out of key space. Then we could just add
 * another character and get 4.3 trillion, or about another 1000 years of keys
 * at 10M/day ;-)
 * Base64 does produce three invalid URL characters, '+', '/', and '=', so we need to
 * just replace those during transformation:
 *      + => -
 *      / => .
 *      = => _
 *  As for generation, we still need a random space, so we can hash the URL with the current
 *  time. But since the same url could be hashed at the same time, lets add another nonce, which
 *  can just be a counter that is reset with the server start. Not important to persist it
 */
let nonce = 0;
export const getRawBase64Key = (url: string):string => {
    const nonceStr = (nonce++).toString() + Date.now().toString();
    const strToHash = url + nonceStr;
    log('strToHash:', strToHash);
    const hash = md5(strToHash);
    const b64 = hexToBase64(hash);
    // this hash will be 128 bits (16 bytes) which as a 32 char long string:
    //  78e73102 7d8fd50e d642340b 7c9a63b3
    // if we just url encoded that we would get which encoded would be
    // rCOMg+SvSwumGYm3 FbNyRw== Which is 24 chars, minus two for padding => 22
    // so we
    log('hash:', hash);
    log('b64:', b64);
    return b64;
};

const db:any = {};

export const genNewKey = (url: string, expiresOn:number, userId:string) => {
    let count = 10;
    while (count > 0) {
        const rawKey:string = getRawBase64Key(url);
        const tryKey = rawKey.slice(0, 6)
            .replace(/\+/g, '-')
            .replace(/\//g, '.')
            .replace(/=/g, '_');
        log(`tryKey: ${tryKey}`);
        if (!db[tryKey]) {
            db[tryKey] = {
                shortUrl: tryKey,
                origUrl: url,
                expiresOn,
                userId,
            };
            return db[tryKey];
        }
        count--;
    }
    throw new Error('Ran out of keygen counts');
};

export const createUrl = (origUrl:string, userId:string, expiresOn?:number, customUrl?:string): ICreateTinyUrlResp => {
    log(`svc.createUrl(${origUrl}, userId: ${userId}, expiresOn: ${expiresOn}, customUrl: ${customUrl})`);
    const now = new Date();
    const defaultExpires = now.setFullYear(now.getFullYear() + 5);
    console.log('now', now.getTime());
    console.log('expiresOn', expiresOn);
    console.log('defaultExpires', defaultExpires);
    if (expiresOn) {
        if (expiresOn < now.getTime()) {
            error('expiresOn was sit before now. setting to default (should throw)');
            expiresOn = defaultExpires;
        }
    } else {
        console.log('setting expiresOn to default', defaultExpires);
        expiresOn = defaultExpires;
    }
    console.log('FINAL expiresOn', expiresOn);
    // const shortUrl = 'ABCDEF';
    const result = genNewKey(origUrl, expiresOn, userId);
    dump('svc.createUrl result', result);
    return result;
};

export const lookupUrl = (shortUrl:string): ILookupUrlResp | undefined => {
    console.log(`svc.lookupUrl(${shortUrl})`);
    dump('lookupUrl DB:', db);
    const item = db[shortUrl];
    dump('lookupUrl DB.item:', item);
    if (item) {
        log('found DB.item:', item);
        return item;
    }
    console.log(`svc.lookupUrl(${shortUrl}) FAILED`);
    return undefined;
};
