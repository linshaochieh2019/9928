const express = require("express");
const router = express.Router();
const { MERCHANT_ID, MPG_URL, aesEncrypt, aesDecrypt, sha256, pointPackages } = require("../utils/spgateway");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Employer = require("../models/Employer");
const PointTransaction = require("../models/PointTransaction");

// Access FE/BE URL from env.local
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4200";


// ✅ Initiate payment (called by frontend to get TradeInfo etc)
router.post("/initiate", async (req, res) => {
    try {
        const { packageId, employerId } = req.body;

        // Generate unique order number
        const merchantOrderNo = `ORDER_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

        // ✅ lookup amount from package table
        const pkg = pointPackages[packageId];
        if (!pkg) return res.status(400).json({ error: "Invalid packageId" });
        const amount = pkg.amount;

        // ✅ Save pending payment before redirect
        await Payment.create({
            employerId,
            packageId,
            merchantOrderNo,
            amount,
            status: "pending",
        });

        // Step 1: Build the raw payload string
        const payload = new URLSearchParams({
            MerchantID: MERCHANT_ID,
            RespondType: "JSON",
            TimeStamp: Math.floor(Date.now() / 1000).toString(),
            Version: "2.3",
            MerchantOrderNo: merchantOrderNo,
            Amt: amount.toString(),
            ItemDesc: `Points Package ${packageId}`,
            NotifyURL: `${BACKEND_URL}/payments/callback`, // backend
            ReturnURL: `${FRONTEND_URL}/employers/payment-result`,  // frontend
            ClientBackURL: `${FRONTEND_URL}/employers/payment-result?status=cancel` // frontend for cancelled payment
        }).toString();

        // Step 2: Encrypt payload
        const tradeInfo = aesEncrypt(payload);

        // Step 3: Hash encrypted string
        const tradeSha = sha256(tradeInfo);

        // Step 4: Send back to frontend
        res.json({
            MerchantID: MERCHANT_ID,
            TradeInfo: tradeInfo,
            TradeSha: tradeSha,
            Version: "2.3",
            actionUrl: MPG_URL, // frontend will post form to this URL
        });

    } catch (err) {
        console.error("Payment initiate error", err);
        res.status(500).json({ error: "Payment initiation failed" });
    }
});

// ✅ Payment callback (from Spgateway)
router.post("/callback", async (req, res) => {
    try {
        console.log("Callback received:", req.body);

        const { Status, TradeInfo, TradeSha } = req.body;

        // 1. Verify SHA (integrity check)
        const checkSha = sha256(TradeInfo);
        if (checkSha !== TradeSha) {
            console.error("❌ SHA mismatch");
            return res.status(400).send("Invalid checksum");
        }

        // 2. Decrypt TradeInfo
        const decrypted = aesDecrypt(TradeInfo);

        // Try parsing JSON
        let parsed;
        try {
            parsed = JSON.parse(decrypted);
        } catch (err) {
            console.error("❌ Failed to parse TradeInfo", decrypted);
            return res.status(400).send("Invalid TradeInfo");
        }

        console.log("Decrypted TradeInfo:", parsed);

        // Use parsed.Result.* instead of parsed.*
        const merchantOrderNo = parsed.Result.MerchantOrderNo;
        const tradeNo = parsed.Result.TradeNo;

        // 3. Update Payment record
        const payment = await Payment.findOne({ merchantOrderNo });
        if (!payment) {
            console.error("❌ Payment not found:", merchantOrderNo);
            return res.status(404).send("Order not found");
        }

        // 🔒 Prevent double-credit
        if (payment.status === "success") {
            console.log(`⚠️ Payment already processed: ${merchantOrderNo}`);
            return res.send("OK");
        }

        if (Status === "SUCCESS") {
            payment.status = "success";
            payment.tradeNo = tradeNo;
            payment.rawResponse = parsed;
            await payment.save();

            // 4. Credit employer points
            const pkg = pointPackages[payment.packageId];
            if (!pkg) {
                console.error("Unknown package:", payment.packageId);
                return res.status(500).send("Unknown package");
            }
            const points = pkg.points;

            // Update employer's points balance
            const employer = await Employer.findByIdAndUpdate(
                payment.employerId,
                { $inc: { points } },
                { new: true }
            );

            // 5. Record point transaction (credit)
            await PointTransaction.create({
                employerId: payment.employerId,
                type: "credit",
                points,
                reason: `purchase:${payment.packageId}`,
                referenceId: payment._id
            });

            console.log(`✅ Credited ${points} points to employer ${payment.employerId}`);
        } else {
            payment.status = "failed";
            payment.rawResponse = parsed;
            await payment.save();
            console.log("❌ Payment failed for", merchantOrderNo);
        }

        // 6. Always respond with 200 OK so NewebPay doesn’t retry
        res.send("OK");
    } catch (err) {
        console.error("Payment callback error", err);
        res.status(500).send("ERROR");
    }
});


module.exports = router;
