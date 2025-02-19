import { Request, Response } from "express";
import TagModel from "./model";
import {
  CreateTagInput,
  FilterQueryInput,
  ParamsInput,
  UpdateTagInput,
} from "./tag.schema";

export const createTagController = async (
  req: Request<{}, {}, CreateTagInput>,
  res: Response
) => {
  try {
    const { ownerId, walletId, tag } = req.body;

    const check = await TagModel.findAll({
      where: {
        walletId: walletId,
        ownerId: ownerId,
      },
    });

    if (check.length > 0) {
      return res.status(409).json({
        status: "fail",
        message: "Tag for this wallet already exists for this account",
      });
    }

    const tags = await TagModel.create({
      ownerId,
      walletId,
      tag,
    });

    res.status(201).json({
      status: "success",
      data: {
        tags,
      },
    });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        status: "failed",
        message: "Tag for this wallet already exists for this account",
      });
    }

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateTagController = async (
  req: Request<UpdateTagInput["params"], {}, UpdateTagInput["body"]>,
  res: Response
) => {
  try {
    const result = await TagModel.update(
      { ...req.body, updatedAt: Date.now() },
      {
        where: {
          walletId: req.params.walletId,
          ownerId: req.params.ownerId,
        },
      }
    );

    const tags = await TagModel.findAll({
      where: {
        walletId: req.params.walletId,
        ownerId: req.params.ownerId,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        tags,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const findTagController = async (
  req: Request<ParamsInput>,
  res: Response
) => {
  try {
    const tags = await TagModel.findOne({
      where: {
        walletId: req.params.walletId,
        ownerId: req.params.ownerId,
      },
    });

    if (!tags) {
      return res.status(404).json({
        status: "fail",
        message: "Tag with that ID not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tags,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const findAllTagsController = async (
  req: Request<{}, {}, {}, FilterQueryInput>,
  res: Response
) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const tags = await TagModel.findAll({ limit, offset: skip });

    res.status(200).json({
      status: "success",
      results: tags.length,
      tags,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteTagController = async (
  req: Request<ParamsInput>,
  res: Response
) => {
  try {
    const result = await TagModel.destroy({
      where: { ownerId: req.params.ownerId, walletId: req.params.walletId },
      force: true,
    });

    if (result === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Tag with that ID not found",
      });
    }

    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
