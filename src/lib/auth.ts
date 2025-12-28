import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import nodemailer from 'nodemailer'
// If your Prisma file is located elsewhere, you can change the path

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.TRUSTED_AUTH_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }

        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp:true,
        autoSignInAfterVerification:true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            // Create the verification link
            const verificationURL = `${process.env.TRUSTED_AUTH_URL}/verify-email?token=${token}`;

            // Send email
            const info = await transporter.sendMail({
                from: '"My App" <no-reply@myapp.com>', // sender
                to: user.email, // send to the user
                subject: "Verify Your Email Address ✅",
                text: `Hello ${user.name || ""},

Please verify your email by clicking the link below:

${verificationURL}

If you did not request this, please ignore this email.

Thanks,
My App Team
        `, // plain text fallback
                html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Hello ${user.name || ""},</h2>
            <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
            <a href="${verificationURL}" 
               style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 6px;">
               Verify Email
            </a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${verificationURL}">${verificationURL}</a></p>
            <p style="margin-top: 30px;">Thanks,<br/>The My App Team</p>
        </div>
        `,
            });

            console.log("Verification email sent:", info.messageId);
        }

    },
     baseURL: process.env.BETTER_AUTH_URL, 
    socialProviders: {
        google: { 
            prompt:"select_account consent",
            accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});