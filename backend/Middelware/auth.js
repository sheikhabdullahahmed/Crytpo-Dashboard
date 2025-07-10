const auth = (req, res, next) => {
  const token = req.cookies.token; // ✅ Get token from cookie
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};


module.exports = auth;