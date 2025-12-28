import { Request, Response } from "express";
import { postService } from "./post.Service.js";

const createPost = async (req: Request, res: Response) => {

    try {
        const result = await postService.createPostDB(req.body)
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

export const postController = {
    createPost
}