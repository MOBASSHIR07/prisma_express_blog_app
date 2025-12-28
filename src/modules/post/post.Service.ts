import { Post } from "../../../generated/prisma/client.js"
import { prisma } from "../../lib/prisma.js"


const createPostDB = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'view'>) => {

    const result = await prisma.post.create({
        data: {
            title: post.title,
            content: post.content,
            thumnail: post.thumnail,    
            isFeatured: post.isFeatured,
            status: post.status,         
            tags: post.tags,
            authorId: post.authorId,      
        }
    })
    return result

}

export const postService = {
    createPostDB
}