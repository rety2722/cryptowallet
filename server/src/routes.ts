import express from "express";
import { validate } from "./middleware/validate";
import {
  createTagController,
  deleteTagController,
  findAllTagsController,
  findTagController,
  updateTagController,
} from "./tag.controller";
import { createTagSchema, updateTagSchema } from "./tag.schema";
import { getTransactions } from "./tx.controller";

const router = express.Router();

router
  .route("/")
  .get(findAllTagsController)
  .post(validate(createTagSchema), createTagController);
router
  .route("/tags/:ownerId/:walletId")
  .get(validate(updateTagSchema), findTagController)
  .patch(validate(updateTagSchema), updateTagController)
  .delete(deleteTagController);
router.route("/transactions").get(getTransactions);

export default router;
