import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Email from '@/models/Email';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const newEmail = await Email.create({ email });

        return NextResponse.json(
            { message: 'Email subscribed successfully', data: newEmail },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("SIGNUP API ERROR:", error); // Log the full error
        if (error.code === 11000) {
            return NextResponse.json(
                { error: 'Email already subscribed' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message }, // Send details to client for now
            { status: 500 }
        );
    }
}
