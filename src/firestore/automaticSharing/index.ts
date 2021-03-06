const functions = require('firebase-functions');
const admin = require('firebase-admin');

export const shareLocationToTrusted = functions.firestore
    .document(`users/{uid}/locations/{locationId}`)
    .onWrite(async (change: any, context: any) => {

        const newData = change.after.data();
        const uid = context.params.uid;
        const locationId = context.params.locationId;

        try {
            if (newData.visibility === 'private') {
                console.log({ data: newData, uid: uid, locationId: locationId });
                console.log('#1');

                const shared = await admin.firestore()
                    .collection(`users/${uid}/trusted`)
                    .doc('location_sharing')
                    .get();

                console.log(shared.data().friends);
                console.log('#2');

                await shared.data().friends.forEach(async (element: any) => {
                    console.log(element);
                    console.log('#3');

                    const combined = {
                        ...newData,
                        friend: element,
                        visible: true
                    }

                    delete combined.visibility;

                    await admin.firestore()
                        .collection(`users/${uid}/trusted/location_sharing/shared/`)
                        .doc(`${combined.friend.uid}`)
                        .set(combined, { merge: true })
                });
                return;

                // const batch = await admin.firestore().batch();

                // await trustedContacts.friends.array.forEach((element: any) => {
                //     console.log(element);
                //     batch.set(shared, { data, friend: element });
                // });

                // return await batch.commit();
            }

        }
        catch (error) {
            console.log(error);
            return error;
        }
    });