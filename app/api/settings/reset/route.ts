import dbConnect from "@/lib/mongodb";
import Entry from "@/models/Entry";
import { NextResponse } from "next/server";

export async function DELETE() {
    await dbConnect();
    try {
        await Entry.deleteMany({});
        return NextResponse.json({ success: true, message: "All data reset" });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to reset data" },
            { status: 500 }
        );
    }
}
