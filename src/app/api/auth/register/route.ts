import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Zod validation
        const { name, email, password } = registerSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
            }
        });

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
        }
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
