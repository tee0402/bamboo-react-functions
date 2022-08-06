import { https, pubsub } from "firebase-functions";
import admin from "firebase-admin";
import fetch from "node-fetch";
admin.initializeApp();

// export const getPersonalSavingRate = https.onCall(async (data, context) => {
//   const fetchResponse = await fetch("https://api.stlouisfed.org/fred/series/observations?series_id=PSAVERT&api_key=f4bda26c0f1d058e0ea9e2a84f5a11a2&file_type=json&limit=1&sort_order=desc");
//   const json = await fetchResponse.json();
//   return {personalSavingRate: Number(json.observations[0].value)};
// });

export const scheduledGetPersonalSavingRate = pubsub.schedule("0 0 * * *").timeZone("America/New_York").onRun(async context => {
  const fetchResponse = await fetch("https://api.stlouisfed.org/fred/series/observations?series_id=PSAVERT&api_key=f4bda26c0f1d058e0ea9e2a84f5a11a2&file_type=json&limit=1&sort_order=desc");
  const json = await fetchResponse.json();
  return await admin.firestore().collection("data").doc("data").update("personalSavingRate", Number(json.observations[0].value)).then(() => "success").catch(error => error);
});