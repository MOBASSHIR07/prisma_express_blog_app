import { Request, Response } from "express";
import { commentService } from "./comment.Service.js";

const createComment = async (req: Request, res: Response) => {

    try {

      const payload = req.body;

      payload.authorId = req.user?.id


      const result = await commentService.createCommentDb(payload)


           res.status(201).json({
            success: true,
            message: "Comment created successfully!",
            data: result
        });


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }

}

const getCommentById = async(req:Request, res:Response)=>{
    try {
      
        
      
        const commentId = req.params.id;

        if(!commentId){
            throw new Error("NEED id")
        }
        const result = await commentService.getCommentByIdDB(commentId)


          res.status(201).json({
            success: true,
            message: "Comment get successfully!",
            data: result
        });
        
    } catch (error:any) {
          res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const getCommentByAuthorId = async(req:Request, res:Response)=>{
    try {
      
        
      
        const authorId = req.params.id;

        if(!authorId){
            throw new Error("NEED id")
        }
        const result = await commentService.getCommentByAuthorDB(authorId)


          res.status(201).json({
            success: true,
            message: "Comment get successfully!",
            data: result
        });
        
    } catch (error:any) {
          res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}



export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthorId
}