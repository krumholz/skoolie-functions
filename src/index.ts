// Required reading/watching for function and folder structure:
// https://medium.com/@atbe/firebase-functions-true-routing-2cb17a5cd288
// https://fireship.io/courses/cloud-functions/intro-project-structure/

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp(functions.config().firebase);

export { shareLocationToTrusted } from './firestore/automaticSharing';
