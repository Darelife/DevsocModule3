const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    // {userId:darelife, password:darelife} = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkYXJlbGlmZSIsInBhc3N3b3JkIjoiZGFyZWxpZmUiLCJpYXQiOjE3MTM0MjA5OTN9.-tipS418wK0sLtQKhvMqrHMRs0l6T2301UtI2XMI1OE
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.userId !== "darelife" && decoded.password !== "darelife") {
      return res.status(401).json({ error: "Access denied" });
      // message: jwt.sign( { userId: "darelife", password: "darelife" }, process.env.JWT_KEY)
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    // message: jwt.sign({ userId: "darelife" }, process.env.JWT_KEY),
  }
}

module.exports = verifyToken;
