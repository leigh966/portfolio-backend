const dotenv = require("dotenv");
const speakeasy = require("speakeasy");
dotenv.config();

const key = process.env.SECRET_KEY

// Including crypto module
const crypto = require('crypto');

function verifyOTP(otp) {
  const verified = speakeasy.totp.verify({
    secret: key,
    encoding: "base32",
    token: otp,
  });

  return verified;
}

function verifyPassword(password, storedSalt, storedHash) 
{
	const hash = crypto.pbkdf2Sync(password, storedSalt, 1000, 64, `sha512`).toString(`hex`);
    return storedHash === hash;
  }

function generateSessionId(res)
{
	
	// Calling randomBytes method with callback
crypto.randomBytes(127, (err, buf) => {
  if (err) {
    // Prints error
    console.log(err);
    return;
  }
 
  sessionId = buf.toString('hex');
  res.send(sessionId)
});
}

module.exports.otp = verifyOTP;
module.exports.password = verifyPassword;
module.exports.createSession = generateSessionId;
