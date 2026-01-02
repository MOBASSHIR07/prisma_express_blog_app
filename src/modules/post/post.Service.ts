import { Post } from "../../../generated/prisma/client.js"
import { prisma } from "../../lib/prisma.js"


const createPostDB = async (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'view' | 'authorId'>, user: any) => {

    const result = await prisma.post.create({
        data: {
            title: post.title,
            content: post.content,
            thumnail: post.thumnail,
            isFeatured: post.isFeatured,
            status: post.status,
            tags: post.tags,
            authorId: user.id,
        }
    })
    return result

}

const getAllPostDB = async (search:string) => {

    const result = await prisma.post.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    tags:{
                        has:search
                    }
                }
            ]
        }
    })
    return result
}

export const postService = {
    createPostDB,
    getAllPostDB
}