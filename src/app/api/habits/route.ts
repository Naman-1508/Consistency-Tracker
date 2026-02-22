import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { habitSchema } from "@/lib/validations";
import { z } from "zod";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const habits = await prisma.habit.findMany({
            where: { userId: session.user.id },
            include: {
                logs: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(habits);
    } catch (error) {
        console.error("Error fetching habits:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedData = habitSchema.parse(body);

        const habit = await prisma.habit.create({
            data: {
                ...validatedData,
                userId: session.user.id,
            },
        });

        return NextResponse.json(habit, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
        }
        console.error("Error creating habit:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
