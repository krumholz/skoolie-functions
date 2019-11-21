// Required reading/watching for function and folder structure:
// https://medium.com/@atbe/firebase-functions-true-routing-2cb17a5cd288
// https://fireship.io/courses/cloud-functions/intro-project-structure/

import * as express from "express";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as instagramOauth from "./http/instagram";

admin.initializeApp(functions.config().firebase);

export { shareLocationToTrusted } from './firestore/automaticSharing';

const instagram = express();
// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
instagram.disable("x-powered-by");
// Any requests to /api/users will be routed to the user router!
instagram.use("/instagram", instagramOauth.oauthRouter);
// Again, lets be nice and help the poor wandering servers, any requests to /api
// that are not /api/users will result in 404.
instagram.get("*", async (req: express.Request, res: express.Response) => {
    res.status(404).send("This route does not exist.");
});
exports.instagram = functions.https.onRequest(instagram);