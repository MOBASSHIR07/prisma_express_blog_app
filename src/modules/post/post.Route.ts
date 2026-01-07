import { Router } from "express";
import { postController } from "./post.Controller.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";


const router = Router()



router.get('/', postController.getAllPost )

router.post('/', authMiddleware("USER"), postController.createPost)
router.get('/my/post', authMiddleware("ADMIN", "USER"), postController.getMyPosts)
router.get('/:id', postController.getSinglePost);
router.patch('/:postId', authMiddleware("ADMIN", "USER"), postController.updateMyPosts)
router.delete('/:postId', authMiddleware("ADMIN", "USER"), postController.deleteMyPosts)
router.get("/stats/dashboard", authMiddleware('ADMIN'), postController.getStas)


export const postRoute = router;
export default authMiddleware