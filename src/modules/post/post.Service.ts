import { Post, PostStatus } from "../../../generated/prisma/client.js"
import { prisma } from "../../lib/prisma.js"
 export type PostFilter = {
  search?: string;
  status?: PostStatus;
  authorId?: string;
  isFeatured?: boolean;
  tag?: string;
};


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

const getAllPostDB = async (filter: PostFilter, skip:number, limit:number,sortBy:string,orderBy:string) => {
  const { search, status, authorId, isFeatured, tag } = filter;
  console.log(skip, limit);
  

  return prisma.post.findMany({
     skip: skip,
    take: limit,
    where: {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
                { tags: { has: search } },
              ],
            }
          : {},

        status ? { status } : {},
        authorId ? { authorId } : {},
        isFeatured !== undefined ? { isFeatured } : {},
        tag ? { tags: { has: tag } } : {},
      ],
    },
    orderBy: {
       [sortBy] : orderBy,
    },
  });
};

export const postService = {
    createPostDB,
    getAllPostDB
}