import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db';
import Email from '@/models/Email';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token');

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(token.value, secret);
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        await dbConnect();
        const emails = await Email.find({}).sort({ createdAt: -1 });

        return NextResponse.json({ data: emails }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
