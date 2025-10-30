import { env } from "../../config/env.js";

import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const auth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";

    if (!auth.startsWith("Bearer")) {
      return res.status(401).json({ error: `missing token ${auth}` });
    }
    const token = auth.split(" ")[1];
    // верифицируем токен
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "user_not_found" });
    }
    req.user = user;
    //console.log(req.user);
    return next();
  } catch (e) {
    console.error("[protect] unexpected error:", e);
    return res.status(500).json({ error: "internal_error" });
  }
};
