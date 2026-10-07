// ——————————————————————————————
// Imports (Firebase Modular Functions SDK v2)
// ——————————————————————————————
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Stripe with secret key from environment config
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.secret);

// ——————————————————————————————
// Initialize Firebase Admin SDK
// ——————————————————————————————
admin.initializeApp();

// ——————————————————————————————
// Express App Setup for Stripe Payment API
// ——————————————————————————————
const app = express();
app.use(cors({origin: true}));
app.use(express.json());

// Route: Test endpoint
app.get("/", (req, res) => {
  res.status(200).send("Hello from Firebase Cloud Functions");
});

// Route: Stripe Payment
app.post("/payment/create", async (req, res) => {
  const total = parseInt(req.query.total);

  console.log("💰 Payment Request Received >> Amount (paise):", total);

  if (isNaN(total) || total < 50) {
    return res.status(400).send({error: "Invalid or too small amount"});
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "inr",
    });

    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Stripe Error:", error.message);
    res.status(400).send({error: error.message});
  }
});

// Export the Express HTTP API
exports.api = onRequest(app);

// ——————————————————————————————
// Firestore Trigger: Return Pickup Threshold Check
// ——————————————————————————————
exports.checkReturnThreshold = onDocumentUpdated(
    "returnPincodes/{pincode}",
    async (event) => {
      const newData = event.data.after.data();
      const previousData = event.data.before.data();

      if (newData.count >= 3 && !previousData.thresholdReached) {
        const db = admin.firestore();
        const {returns} = newData;
        const batch = db.batch();
        const notificationsRef = db.collection("notifications");

        // 3 days later
        const pickupDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        const formattedDate = pickupDate.toLocaleDateString();

        // Notify all users with returns
        returns.forEach((returnItem) => {
          const newNotificationRef = notificationsRef.doc();
          batch.set(newNotificationRef, {
            userId: returnItem.userId,
            title: "Return Pickup Scheduled",
            message: `Return pickup scheduled for items in ${
              newData.location
            }. Date: ${formattedDate}`,
            type: "return_pickup",
            read: false,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });
        });

        // Update returnPincodes document
        const pincodeRef = db
            .collection("returnPincodes")
            .doc(event.params.pincode);

        batch.update(pincodeRef, {
          thresholdReached: true,
          pickupDate: admin.firestore.Timestamp.fromDate(pickupDate),
          count: 0,
        });

        await batch.commit();
        console.log(
            `✅ Threshold reached for pincode ${
              event.params.pincode
            }. Notifications sent.`,
        );
      }

      return null;
    },
);
