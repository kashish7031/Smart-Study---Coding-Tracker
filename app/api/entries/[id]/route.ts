import dbConnect from "@/lib/mongodb";
import Entry from "@/models/Entry";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    try {
        const entry = await Entry.findById(id);
        if (!entry) {
            return NextResponse.json(
                { success: false, error: "Entry not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: entry });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error },
            { status: 400 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    try {
        const body = await request.json();
        const entry = await Entry.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!entry) {
            return NextResponse.json(
                { success: false, error: "Entry not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: entry });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error },
            { status: 400 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;
    try {
        const entry = await Entry.deleteOne({ _id: id });
        if (!entry.deletedCount) {
            return NextResponse.json(
                { success: false, error: "Entry not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error },
            { status: 400 }
        );
    }
}
