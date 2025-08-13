const express = require("express");
const admin = require("../firebaseAdmin");
const router = express.Router();

router.post("/grant", async (req, res) => {
  const { uid, userInfo } = req.body;

  if (!uid || !userInfo) {
    return res.status(400).json({ error: "UID or user info missing" });
  }

  try {
    await admin.firestore().collection("cards").doc(uid).set({
      ...userInfo,
      granted: true,
    });

    res.json({ message: "Card granted and data stored in Firestore." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
