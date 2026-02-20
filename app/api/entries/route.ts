import dbConnect from "@/lib/mongodb";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const entries = await Entry.find({}).sort({ date: -1 });
        return NextResponse.json({ success: true, data: entries });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const entry = await Entry.create(body);
        return NextResponse.json({ success: true, data: entry }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
