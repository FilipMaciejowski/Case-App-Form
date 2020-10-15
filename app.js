import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import compression from "compression";
import cors from "cors";
import path from "path";
import ValidationChain from "express-validator";

import validateAreaCode from "./utils/validateAreaCode.js";
import sendEmailConfirmation from "./utils/sendEmailConfirmation.js";

const app = express();

app.use(cors());

app.use(compression());

app.enable("trust proxy");

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 250,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests",
});
app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(xss());

app.use(
  hpp({
    whitelist: [],
  })
);

// routes
const { body, validationResult } = ValidationChain;

app.post(
  "/api/message",
  [
    body("name").not().isEmpty().trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("phone").not().isEmpty().trim().escape().isLength({ min: 8, max: 8 }),
    body("postCode").not().isEmpty().trim().escape().custom(validateAreaCode),
    body("message").trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    await sendEmailConfirmation(req.body);

    await res.sendStatus(200);
  }
);

// serving react
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

export default app;
