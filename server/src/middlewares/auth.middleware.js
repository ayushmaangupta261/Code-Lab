import jwt, { decode } from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // console.log("req -> ",req.headers);
    // console.log("cookie -> ",req.cookies)
    const authHeader = req.headers["authorization"];
    // console.log("Token -> ",authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const accessToken = authHeader.split(" ")[1];

    console.log("Acess token -> ", accessToken);

    if (!accessToken) {
      return res
        .status(401)
        .json({
          message: "Not authenticated",
          isAuthenticated: false,
          success: false,
        });
    }

    // Verify the token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    console.log("Decoded -> ",decoded)

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid token", isAuthenticated: false });
    }

    req.user = {
      ...decoded,
      accessToken,
    };

    // console.log(req.user);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed", isAuthenticated: false });
  }
};

export default authMiddleware;
