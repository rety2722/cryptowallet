import express from "express";
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

export default router;
