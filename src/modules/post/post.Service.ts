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

// const getAllPostDB = async (filter: PostFilter, skip:number, page:number, limit:number,sortBy:string,orderBy:string) => {
//   const { search, status, authorId, isFeatured, tag } = filter;
//   console.log(skip, limit);
  

//   const data =   prisma.post.findMany({
//      skip: skip,
//     take: limit,
//     where: {
//       AND: [
//         search
//           ? {
//               OR: [
//                 { title: { contains: search, mode: "insensitive" } },
//                 { content: { contains: search, mode: "insensitive" } },
//                 { tags: { has: search } },
//               ],
//             }
//           : {},

//         status ? { status } : {},
//         authorId ? { authorId } : {},
//         isFeatured !== undefined ? { isFeatured } : {},
//         tag ? { tags: { has: tag } } : {},
//       ],
//     },
//     orderBy: {
//        [sortBy] : orderBy,
//     },
//   });


//   const metadata = await prisma.post.count({
//     where: data
//   })

//   return{
//       data,
//       metaData :{

//       }
//   }


// };

const getAllPostDB = async (filter: PostFilter, skip: number, page:number, limit: number, sortBy: string, orderBy: string) => {
  const { search, status, authorId, isFeatured, tag } = filter;

  // 1. Move the filters into a constant so you can use it twice
  const whereConditions: any = {
    AND: [
      search ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          { tags: { has: search } },
        ],
      } : {},
      status ? { status } : {},
      authorId ? { authorId } : {},
      isFeatured !== undefined ? { isFeatured } : {},
      tag ? { tags: { has: tag } } : {},
    ],
  };

  // 2. Fetch the data (Remember to await!)
  const data = await prisma.post.findMany({
    skip: skip,
    take: limit,
    where: whereConditions, // Use the condition here
    orderBy: {
      [sortBy]: orderBy,
    },
    include:{
      _count:{
        select: {
          comments : true
        }
      }
    }
  });

  // 3. Count using the SAME conditions
  const total = await prisma.post.count({
    where: whereConditions, // Use the SAME condition here
  });

  return {
    data,
    total, // Return total so controller can calculate totalPages
    page,
    limit,
    totalPage : Math.ceil(total / limit)
  };
};

const getSinglePostDB = async (id: string) => {

  const result = await prisma.$transaction(async (tx)=>{

    const updateView = await tx.post.update({
     where:{
    id:id
  },
  data:{
    view: {
      increment: 1
    }
  }
})

  const result = await tx.post.findUnique({
    where: {
      id: id,
    },
    include: {   
      comments: {
        where: {
          parentId:null,
          status:"APPROVED"
        },
        orderBy:{createdAt:"desc"},
        include :{ 
          replies:{
            orderBy:{createdAt:'asc'},
            include :{
              replies:{
                include:{
                  replies:true
                }
              }
            }
          }
        }
      },
      _count:{
        select:{
          comments: true
        }
      }
    },
  });


 return result

  })

  return result;
};
export const postService = {
    createPostDB,
    getAllPostDB,
    getSinglePostDB
}