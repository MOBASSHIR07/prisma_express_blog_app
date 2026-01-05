import { tuple } from "better-auth";
import { prisma } from "../../lib/prisma.js";


const createCommentDb = async(payload:{content:string, postId:string, authorId:string, parentId?:string})=>{

console.log(payload);

 if(payload.parentId){
     await prisma.comment.findUniqueOrThrow({
    where : {
        id : payload.parentId
    }
 })
}

await prisma.post.findUniqueOrThrow({
    where:{
        id:payload.postId
    }
})


return await prisma.comment.create({
     data : payload
})


}

const getCommentByIdDB = async(commentId:string)=>{
  return await prisma.comment.findUnique({
    where:{
        id:commentId
    },
    include:{
        post: {
            select:{
                id:true,
                 title:true,
                 view:true
            }
        }
    }
  })
}

const getCommentByAuthorDB = async(authorId:string)=>{


    return await prisma.comment.findMany({
        where:{
            authorId:authorId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })
}


export const commentService = {
    createCommentDb,
    getCommentByIdDB,
    getCommentByAuthorDB
}