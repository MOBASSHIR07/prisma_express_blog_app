import { success } from "better-auth"
import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client.js"

function errorHandler (err:any, req:Request, res:Response, next:NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  let statusCode = 500
  let errorMessage = "Internal Server Error"
  let errorDetails = err

  // prisma client validation error

  if(err instanceof Prisma.PrismaClientValidationError){
    statusCode = 400
    errorMessage = "You provided incorrect field type or missing fields!"
  }

 else if (err instanceof Prisma.PrismaClientKnownRequestError) {
  if (err.code === "P2025") {
    statusCode = 404
    errorMessage = "The requested resource was not found or no matching record exists."
  }
}

else if (err instanceof Prisma.PrismaClientKnownRequestError) {
  switch (err.code) {

    case "P2002":
      statusCode = 409
      errorMessage = "Duplicate entry. This value already exists."
      break

    case "P2025":
      statusCode = 404
      errorMessage = "The requested resource was not found."
      break

    case "P2003":
      statusCode = 400
      errorMessage = "Invalid reference. Related record does not exist."
      break

    case "P2000":
      statusCode = 400
      errorMessage = "Input value is too long for the database column."
      break

    case "P2011":
      statusCode = 400
      errorMessage = "A required field is missing or null."
      break

    case "P2014":
      statusCode = 400
      errorMessage = "Relation constraint failed."
      break

    default:
      statusCode = 500
      errorMessage = "Database error occurred."
  }
}

else if (err instanceof Prisma.PrismaClientInitializationError) {
  statusCode = 500
  errorMessage = "Database connection failed. Please try again later."
}

else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
  statusCode = 500
  errorMessage = "An unexpected database error occurred."
}



  res.status(statusCode)
  res.json({
    success:false,
    message : errorMessage,
    error:errorDetails
  })
}


export default errorHandler