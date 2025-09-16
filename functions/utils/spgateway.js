const crypto = require("crypto");

const env = process.env.SPGATEWAY_ENV || "sandbox";

const MERCHANT_ID =
  env === "production"
    ? process.env.SPGATEWAY_PROD_MERCHANT_ID
    : process.env.SPGATEWAY_SANDBOX_MERCHANT_ID;

const HASH_KEY =
  env === "production"
    ? process.env.SPGATEWAY_PROD_HASH_KEY
    : process.env.SPGATEWAY_SANDBOX_HASH_KEY;

const HASH_IV =
  env === "production"
    ? process.env.SPGATEWAY_PROD_HASH_IV
    : process.env.SPGATEWAY_SANDBOX_HASH_IV;

const MPG_URL =
  env === "production"
    ? "https://core.newebpay.com/MPG/mpg_gateway"
    : "https://ccore.newebpay.com/MPG/mpg_gateway";

function aesEncrypt(data) {
  const cipher = crypto.createCipheriv("aes-256-cbc", HASH_KEY, HASH_IV);
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function aesDecrypt(encrypted) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", HASH_KEY, HASH_IV);
  decipher.setAutoPadding(true);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function sha256(encrypted) {
  const plainText = `HashKey=${HASH_KEY}&${encrypted}&HashIV=${HASH_IV}`;
  return crypto.createHash("sha256").update(plainText).digest("hex").toUpperCase();
}

const pointPackages = {
  "1_point": { points: 1, amount: 150 },
  "8_points": { points: 8, amount: 990 }
};

module.exports = { MERCHANT_ID, HASH_KEY, HASH_IV, MPG_URL, aesEncrypt, aesDecrypt, sha256, pointPackages };
