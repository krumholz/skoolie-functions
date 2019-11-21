import * as express from "express";
import * as functions from "firebase-functions";
// import * as querystring from "querystring";
// import * as crypto from "crypto";
import * as admin from "firebase-admin";

const request = require('request-promise');
const appID = functions.config().instagram.app_id;
const appSecret = functions.config().instagram.app_secret;

export let oauthRouter = express.Router();

oauthRouter.get("/auth", async function auth(req: express.Request, res: express.Response) {
    let code = req.query.code;

    if (code) {
        code = code.slice(0, -2);
        console.log(code);

        const authURL = "https://api.instagram.com/oauth/access_token?app_id=" + appID + "&app_secret=" + appSecret + "&grant_type=authorization_code&redirect_uri=https%3A%2F%2Fskoolie.app%2Finstagram%2Fauth&code=" + code;

        console.log(authURL);

        request
            .post(authURL)
            .then((resp: any) => {
            console.log(resp);
            return admin
                .firestore()
                .collection(`users/BiqklgsgjbZ1zrh8iLWjiKTrEJd2/instagram_auth/`)
                .doc("access_token")
                .set(resp);
            })
            .catch((error: any) => {
            console.log('This errored out');
            console.log(`{error: ${error}}`);
            return res
                .status(error.statusCode)
                .send(error.error.error_description);
            });
        return res.status(200).send('Complete');
    }
    return;
});


// oauthRouter.get("/callback", async function callback(req: express.Request, res: express.Response) {
//     console.log("Callback Activated");
//     console.log(Object.keys(req));
//     console.log(Object.values(req));
//     const { shop, hmac, code, state } = req.query;
//     console.log(`${shop}-${hmac}-${code}-${state}`);
//     // const cookies = cookie.parse(req.headers.cookie || '');
//     // const stateCookie = cookies.state;
//     // // const stateCookie = cookie.parse(req.headers.cookie).state;
//     // console.log(`{cookies: ${cookies}}`);
//     // console.log(`{stateCookie: ${stateCookie}}`);
//     // console.log(`{state: ${state}}`);
//     console.log(`{apiSecret: ${appSecret}}`);
//     const apiVersion = functions.config().shopify.api_version;
//     console.log(`{apiVersion: ${apiVersion}}`);

//     // if (state !== stateCookie) {
//     //     return res.status(403).send('Request origin cannot be verified');
//     // }

//     if (shop && hmac && code) {
//         // DONE: Validate request is from Shopify
//         const map = Object.assign({}, req.query);
//         console.log(`{map: ${map}}`);
//         delete map['signature'];
//         delete map['hmac'];
//         console.log(`{map: ${map}}`);
//         const message = querystring.stringify(map);
//         console.log(`{message: ${message}}`);
//         const providedHmac = Buffer.from(hmac, 'utf-8');
//         console.log(`{providedHmac: ${providedHmac}}`);
//         const generatedHash = Buffer.from(
//           crypto
//             .createHmac("sha256", appSecret)
//             .update(message)
//             .digest("hex"),
//           "utf-8"
//         );
//         let hashEquals = false;

//         try {
//             hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
//         } catch (e) {
//             hashEquals = false;
//         };

//         if (!hashEquals) {
//             return res.status(400).send('HMAC validation failed');
//         }

//         // DONE: Exchange temporary code for a permanent access token
//         const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
//         const accessTokenPayload = {
//           client_id: appID,
//           client_secret: appSecret,
//           code
//         };

//         return;

//         // request.post(accessTokenRequestUrl, { json: accessTokenPayload })
//         //     .then((accessTokenResponse: any) => {

//         //         return admin.firestore().collection(`merchants/${shop}/shops/${shop}/private`).doc('internal').set({ access_token: accessTokenResponse.access_token });

//         //         // console.log(`{accessTokenResponse: ${accessTokenResponse}}`);
//         //         // const accessToken = accessTokenResponse.access_token;
//         //         // // DONE: Use access token to make API call to 'shop' endpoint
//         //         // const shopRequestUrl = 'https://' + shop + '/admin/api/' + apiVersion + '/shop.json';
//         //         // const shopRequestHeaders = {
//         //         //     'X-Shopify-Access-Token': accessToken,
//         //         // };

//         //         // request.get(shopRequestUrl, { headers: shopRequestHeaders })
//         //         //     .then((shopResponse: any) => {
//         //         //         console.log(`{shopResponse: ${shopResponse}}`);
//         //         //         return res.status(200).send(shopResponse);
//         //         //     })
//         //         //     .catch((error: any) => {
//         //         //         console.log(`{error: ${error}}`);
//         //         //         return res.status(error.statusCode).send(error.error.error_description);
//         //         //     });
//         //     })
//         //     .then(() => {
//         //         res.redirect(`https://jibe.app/${shop}`);
//         //         return;
//         //     })
//         //     .catch((error: any) => {
//         //         console.log(`{error: ${error}}`);
//         //         return res.status(error.statusCode).send(error.error.error_description);
//         //     });

//     } else {
//         return res.status(400).send('Required parameters missing');
//     }

// });


// oauthRouter.post("/webhook/delete/shop", async function webhookDeleteShop(req: express.Request, res: express.Response) {

//     console.log(req.body);
//     const shop = req.body.shop;

//     return admin.firestore()
//         .collection(`merchants/${shop}/shops/${shop}/private`)
//         .doc('internal')
//         .get()
//         .then(async (doc) => {
//             if (!doc.exists) {
//                 console.log('No such document!');
//                 res.status(400).send('No such document!');
//             } else {
//                 const data = doc.data();
//                 if (data) {
//                     console.log('Document data: ', data);
//                     await admin.firestore()
//                         .collection(`merchants/${shop}/shops/${shop}/private`)
//                         .doc('internal')
//                         .update({ access_token: '', deleted_access_token: data.access_token })
//                     res.status(200).send('Deletion succeeded!');
//                 }

//             }
//         })
//         .catch(err => {
//             console.log('Error getting document', err);
//             res.status(400).send(err);
//         });



// });


// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
oauthRouter.get("*", async (req: express.Request, res: express.Response) => {
    return res.status(404).send("This route does not exist.");
});