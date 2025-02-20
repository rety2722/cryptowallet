import express, { Request } from "express";
import expressWs from "express-ws";
import { validate } from "./middleware/validate";
import {
  createTagController,
  deleteTagController,
  findAllTagsController,
  findTagController,
  updateTagController,
} from "./controllers/tag.controller";
import { createTagSchema, updateTagSchema } from "./schemas/tag.schema";
import { getTransactions } from "./controllers/tx.controller";
import WebSocket from "ws";
import { handleDisconnect, handleMessage } from "./listener";
import { app } from "./app";

expressWs(app);

const router = express.Router();

router
  .route("/")
  .get(findAllTagsController)
  .post(validate(createTagSchema), createTagController)
  .delete(deleteTagController);
router
  .route("/tags/:ownerId/:walletId")
  .get(validate(updateTagSchema), findTagController)
  .patch(validate(updateTagSchema), updateTagController);
router.route("/transactions").get(getTransactions);

router.ws("/ws", (ws: WebSocket, req: express.Request) => {
  ws.on("message", (message) => handleMessage(ws, message));
  ws.on("close", () => handleDisconnect(ws));
});

export default router;
