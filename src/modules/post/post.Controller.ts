import { Request, Response } from "express";
import { postService } from "./post.Service.js";

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

const getAllPost = async(req:Request, res:Response)=>{
    try {

        const search = req.query.search as string;
      
       
        
        const result = await postService.getAllPostDB(search)

         res.status(201).json({
            success: true,
            message: "Post gettingh successfully!",
            data: result
        });
       

    } catch (error:any) {
         res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const postController = {
    createPost,
    getAllPost
}