import { NextFunction, Request, Response, Router } from "express";
import { commentController } from "./comment.Controller.js";
import authMiddleware from "../post/post.Route.js";


const router = Router()

router.post('/', authMiddleware("USER", "ADMIN"), commentController.createComment)
router.get('/:id', commentController.getCommentById)
router.get('/author/:id', commentController.getCommentByAuthorId)

export const commentRoute = router;