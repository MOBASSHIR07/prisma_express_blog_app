import { NextFunction, Request, Response } from "express";
import { PostFilter, postService } from "./post.Service.js";
import { PostStatus } from "../../../generated/prisma/enums.js";
import paginationSortingHelpers from "../../helper/paginationSortingHelper.js";

const createPost = async (req: Request, res: Response, next:NextFunction) => {

    try {
        console.log(req.user);
        const result = await postService.createPostDB(req.body, req.user)
        res.status(201).json({
            success: true,
            message: "Post created successfully!",
            data: result
        });

    } catch (err: any) {
        
      next(err)

    }

}

const getAllPost = async (req: Request, res: Response, next:NextFunction) => {
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
     next(error)
  }
};


const getSinglePost = async (req: Request, res: Response, next:NextFunction) => {
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
    next(error)
  }
};


const getMyPosts = async (req: Request, res: Response, next:NextFunction) => {
  try {
  
    const authorId = req.user?.id
  console.log(authorId);
    if(!authorId){
      throw new Error("Please Login first")
    }

    const result = await postService.getMyPostsDB(authorId);

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: result,
    });
  } catch (error: any) {
   next(error)
  }
};


const updateMyPosts = async (req: Request, res: Response) => {
  try {
  

    const data = req.body
    const postId = req.params.postId!
    const authorId = req.user?.id
    const isAdmin = req.user?.role === "ADMIN";
    if(!authorId){
      throw new Error("Please Login first")
    }

    const result = await postService.updateMyPostDB(postId,authorId, data, isAdmin);

    res.status(200).json({
      success: true,
      message: "Posts updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const deleteMyPosts = async (req: Request, res: Response) => {
  try {
  
    const postId = req.params.postId!
    const authorId = req.user?.id
    const isAdmin = req.user?.role === "ADMIN";
    if(!authorId){
      throw new Error("Please Login first")
    }

    const result = await postService.deleteMyPostDB(postId,authorId,  isAdmin);

    res.status(200).json({
      success: true,
      message: "Posts deleted successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStas = async (req:Request, res:Response)=>{

try {

  const result = await postService.getStatsDB()
    res.status(200).json({
      success: true,
      message: "Posts updated successfully",
      data: result,
    });
  
} catch (error:any) {
     console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
}

}



export const postController = {
    createPost,
    getAllPost,
    getSinglePost,
    getMyPosts,
    updateMyPosts, deleteMyPosts, getStas
}