import { Router } from "express";
import { postController } from "./post.Controller.js";

const router = Router()

router.post('/', postController.createPost)
export const postRoute = router;
