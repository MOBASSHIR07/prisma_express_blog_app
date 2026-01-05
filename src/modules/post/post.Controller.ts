import { Request, Response } from "express";
import { PostFilter, postService } from "./post.Service.js";
import { PostStatus } from "../../../generated/prisma/enums.js";
import paginationSortingHelpers from "../../helper/paginationSortingHelper.js";
import { error } from "node:console";

const createPost = async (req: Request, res: Response) => {

    try {
        console.log(req.user);
        const result = await postService.createPostDB(req.body, req.user)
        res.status(201).json({
            success: true,
            message: "Post created successfully!",
            data: result
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })

    }

}

const getAllPost = async (req: Request, res: Response) => {
  try {
    const filter: PostFilter = {};

    if (typeof req.query.search === "string") {
      filter.search = req.query.search;
      console.log();
    }

    if (typeof req.query.status === "string") {
      filter.status = req.query.status as PostStatus;
    }

    if (typeof req.query.authorId === "string") {
      filter.authorId = req.query.authorId;
    }

    if (typeof req.query.isFeatured === "string") {
      filter.isFeatured = req.query.isFeatured === "true";
      console.log(filter.isFeatured);
    }

    if (typeof req.query.tag === "string") {
      filter.tag = req.query.tag;
    }
    


    const {limit, skip,  orderBy,sortBy, page} = paginationSortingHelpers(req.query)
    

    const result = await postService.getAllPostDB(filter,skip, page,  limit, sortBy,orderBy);

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getSinglePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id){
      throw new Error("Id required")
    }
    const result = await postService.getSinglePostDB(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





export const postController = {
    createPost,
    getAllPost,
    getSinglePost
}