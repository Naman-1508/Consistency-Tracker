import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { date } = await req.json();

        if (!date) {
            return NextResponse.json({ error: "Date is required" }, { status: 400 });
        }

        const habit = await prisma.habit.findUnique({
            where: { id: resolvedParams.id },
        });

        if (!habit || habit.userId !== session.user.id) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        // Toggle logic: if log exists for date, delete it (un-track). If not, create it.
        const existingLog = await prisma.habitLog.findUnique({
            where: {
                habitId_date: {
                    habitId: resolvedParams.id,
                    date: date,
                }
            }
        });

        if (existingLog) {
            await prisma.habitLog.delete({
                where: { id: existingLog.id }
            });
            return NextResponse.json({ tracked: false });
        } else {
            await prisma.habitLog.create({
                data: {
                    habitId: resolvedParams.id,
                    date: date,
                }
            });
            return NextResponse.json({ tracked: true }, { status: 201 });
        }
    } catch (error) {
        console.error("Error tracking habit:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
