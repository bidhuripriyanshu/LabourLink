import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

// GET /api/feedback — top 3 feedbacks by rating (desc), then newest
export async function GET() {
    try {
        const feedbacks = await prisma.feedback.findMany({
            orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
            take: 3,
        });

        // Compute average rating across ALL feedbacks (not just top 3)
        const agg = await prisma.feedback.aggregate({
            _avg: { rating: true },
            _count: true,
        });

        return NextResponse.json({
            feedbacks,
            average: agg._avg.rating ?? 0,
            total: agg._count,
        });
    } catch (err) {
        console.error("GET /api/feedback error:", err);
        return NextResponse.json({ feedbacks: [], average: 0, total: 0 });
    }
}

// POST /api/feedback — submit new feedback
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, role, rating, message } = body;

        // Validate
        if (
            !name?.trim() ||
            !role?.trim() ||
            !message?.trim() ||
            typeof rating !== "number" ||
            rating < 1 ||
            rating > 5
        ) {
            return NextResponse.json(
                { error: "All fields are required. Rating must be 1-5." },
                { status: 400 }
            );
        }

        const feedback = await prisma.feedback.create({
            data: {
                name: name.trim(),
                role: role.trim(),
                rating,
                message: message.trim(),
            },
        });

        return NextResponse.json({ feedback }, { status: 201 });
    } catch (err) {
        console.error("POST /api/feedback error:", err);
        return NextResponse.json(
            { error: "Failed to submit feedback." },
            { status: 500 }
        );
    }
}
