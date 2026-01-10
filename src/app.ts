import express from 'express'
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { postRoute } from './modules/post/post.Route.js';
import { auth } from './lib/auth.js';
import { commentRoute } from './modules/comments/comment.Route.js';
import errorHandler from './middleware/globalErrorHandler.js';
import notFound from './middleware/notFound.js';
const app = express()

app.all('/api/auth/{*any}', toNodeHandler(auth));
app.use(express.json()); 
app.use(cors({
    origin:process.env.TRUSTED_AUTH_URL || "http://localhost:4000 ",
    credentials:true
}));         
app.get('/' , (req,res)=>{
    res.send("Server is running")
})

app.use('/posts',postRoute)
app.use('/comments',commentRoute)

app.use(notFound)

app.use(errorHandler)
export default app;