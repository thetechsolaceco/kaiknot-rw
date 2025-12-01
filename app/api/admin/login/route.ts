import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        console.log("Login Attempt:");
        console.log("Received Username:", username);
        console.log("Expected Username:", ADMIN_USERNAME);
        console.log("Received Password:", password);
        console.log("Expected Password:", ADMIN_PASSWORD);
        console.log("Passwords Match?", password === ADMIN_PASSWORD);

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }

            const secret = new TextEncoder().encode(JWT_SECRET);
            const token = await new SignJWT({ role: 'admin' })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('2h')
                .sign(secret);

            const response = NextResponse.json(
                { message: 'Login successful' },
                { status: 200 }
            );

            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7200, // 2 hours
                path: '/',
            });

            return response;
        } else {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
