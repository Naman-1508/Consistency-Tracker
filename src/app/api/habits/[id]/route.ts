import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title, description, category, reminderTime } = await req.json();

        const habit = await prisma.habit.findUnique({
            where: { id: resolvedParams.id },
        });

        if (!habit || habit.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        const updatedHabit = await prisma.habit.update({
            where: { id: resolvedParams.id },
            data: {
                title: title ?? habit.title,
                description: description !== undefined ? description : habit.description,
                category: category !== undefined ? category : habit.category,
                reminderTime: reminderTime !== undefined ? reminderTime : habit.reminderTime,
            },
        });

        return NextResponse.json(updatedHabit);
    } catch (error) {
        console.error("Error updating habit:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const habit = await prisma.habit.findUnique({
            where: { id: resolvedParams.id },
        });

        if (!habit || habit.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        await prisma.habit.delete({
            where: { id: resolvedParams.id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        // Suppress console error per user request
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
