import dotenv from "dotenv";
import speakeasy from "speakeasy";
dotenv.config();

const key = process.env.SECRET_KEY;
const SESSION_LIVE_TIME = 3600000; //ms = 1h
var session = {
  id: null,
  time: null,
};

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
  const good =
    givenSessionId == session.id &&
    session.id != null &&
    Number(session.time) + Number(SESSION_LIVE_TIME) > Number(Date.now());
  if (good) {
    session.time = Date.now(); // extend the time on successful verification of this session
  }
  return good;
}

export function generateSessionId(res) {
  // Calling randomBytes method with callback
  crypto.randomBytes(127, (err, buf) => {
    if (err) {
      // Prints error
      console.log(err);
      return;
    }

    session.id = buf.toString("hex");
    session.time = Date.now();
    res.send(session.id);
  });
}
const verify = {
  createSession: generateSessionId,
  sessionId: verifySessionId,
  password: verifyPassword,
  otp: verifyOTP,
};
export default verify;

export function verifyEndpoint(req, res, endpoint) {
  if (!verify.sessionId(req.headers.session_id)) {
    res.status(401);
    res.send("Authentication Failed");
    return;
  }
  endpoint();
}
