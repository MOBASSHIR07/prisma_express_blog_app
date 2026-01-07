import { tuple } from "better-auth";
import { prisma } from "../../lib/prisma.js";
import { CommentStatus } from "../../../generated/prisma/enums.js";


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

const deleteCommentDB = async(commentId:string , authorId:string)=>{

const commentData = await prisma.comment.findFirst({
    where:{
        id:commentId,
        authorId:authorId
    },
    select:{
        id:true
    }
})

if(!commentData){
    throw new Error("Invalid")
}

const result = await prisma.comment.delete({
    where:{
        id:commentId
    }

})
return result



}

const updateCommentDB = async(commentId:string , authorId:string, data:string)=>{

const commentData = await prisma.comment.findFirst({
    where:{
        id:commentId,
        authorId:authorId
    },
    select:{
        id:true
    }
})

if(!commentData){
    throw new Error("Invalid")
}

const result = await prisma.comment.update({
    where:{
        id:commentId
    },
    data:{
        content:data
    }

})
return result



}

const moderateCommentDB = async(commentId:string, status:CommentStatus)=>{

   const statusData = await prisma.comment.findUniqueOrThrow({
        where:{
            id:commentId
        }
    })

    if(statusData.status === status){
        throw new Error(`You have already status (${status})`)
    }
    const result = await prisma.comment.update({
        where:{
            id : commentId
        },
        data: {
            status
        }
    })
       return result
}


export const commentService = {
    createCommentDb,
    getCommentByIdDB,
    getCommentByAuthorDB,
    deleteCommentDB,
    updateCommentDB,
    moderateCommentDB
}