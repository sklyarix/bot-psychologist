import { Router } from "express";

import {
  createAiGoal,
  getAllAiGoal,
  getIdAiGoal,
} from "../controllers/aiGoal.controller.js";
import {
  createAiQA,
  getAllAiQA,
  getIdAiQA,
} from "../controllers/aiQA.controller.js";
import { login } from "../controllers/login.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const index = Router();

index.route("/login").post(login);

// goals
index.route("/ai/goals").post(auth, createAiGoal);
index.route("/ai/goals").get(auth, getAllAiGoal);
index.route("/ai/goals/:id").get(auth, getIdAiGoal);
// qa
index.route("/ai/qa").post(auth, createAiQA);
index.route("/ai/qa").get(auth, getAllAiQA);
index.route("/ai/qa/:id").get(auth, getIdAiQA);

export default index;
