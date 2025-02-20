import jwt, { decode } from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try { 
    // console.log("req -> ",req.body); 
    const authHeader = req.headers["authorization"];
    console.log("Token -> ",authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const accessToken = authHeader.split(" ")[1];
    
    console.log("Acess token -> ", accessToken);

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Not authenticated", isAuthenticated: false });
    }

    // Verify the token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    console.log("Decoded -> ",decoded)

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid token", isAuthenticated: false });
    }

    // Attach user details to `req.user` for further processing
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed", isAuthenticated: false });
  }
};


export default authMiddleware;
