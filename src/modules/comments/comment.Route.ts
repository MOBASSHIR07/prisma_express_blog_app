import { NextFunction, Request, Response, Router } from "express";
import { commentController } from "./comment.Controller.js";
import authMiddleware from "../post/post.Route.js";



const router = Router()

router.post('/', authMiddleware("USER", "ADMIN"), commentController.createComment)
router.get('/:id', commentController.getCommentById)
router.get('/author/:id', commentController.getCommentByAuthorId)
router.delete('/comment/:id',authMiddleware("ADMIN", "USER"), commentController.deleteComment )
router.put('/comment/:id',authMiddleware("ADMIN", "USER"), commentController.updateComment )

export const commentRoute = router;