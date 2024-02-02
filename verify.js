import dotenv from "dotenv";
import speakeasy from "speakeasy";
dotenv.config();

const key = process.env.SECRET_KEY;
var sessionId = null;

// Including crypto module
import crypto from "crypto";

export function verifyOTP(otp) {
  const verified = speakeasy.totp.verify({
    secret: key,
    encoding: "base32",
    token: otp,
  });

  return verified;
}

export function verifyPassword(password, storedSalt, storedHash) {
  const hash = crypto
    .pbkdf2Sync(password, storedSalt, 1000, 64, `sha512`)
    .toString(`hex`);
  return storedHash === hash;
}

export function verifySessionId(givenSessionId) {
  return givenSessionId == sessionId && sessionId != null;
}

export function generateSessionId(res) {
  // Calling randomBytes method with callback
  crypto.randomBytes(127, (err, buf) => {
    if (err) {
      // Prints error
      console.log(err);
      return;
    }

    sessionId = buf.toString("hex");
    res.send(sessionId);
  });
}
const verify = {
  createSession: generateSessionId,
  sessionId: verifySessionId,
  password: verifyPassword,
  otp: verifyOTP,
};
export default verify;
