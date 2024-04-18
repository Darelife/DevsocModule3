const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    // darelife = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkYXJlbGlmZSIsImlhdCI6MTcxMzM0NjA2Mn0.1RkQWqkqj3e_SOTlxSciXzvcMXJSgYpbrccBSpiPhpo
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.userId !== "darelife") {
      return res.status(401).json({ error: "Access denied" });
      // message: jwt.sign({ userId: "darelife" }, process.env.JWT_KEY),
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    // message: jwt.sign({ userId: "darelife" }, process.env.JWT_KEY),
  }
}

module.exports = verifyToken;
