import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@gautattva.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vedicghee2026';
const ADMIN_PIN = process.env.ADMIN_PIN || '7821';
const AUTH_COOKIE = 'gautattva_admin_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, pin } = body;

    const isEmailPassMatch =
      email &&
      password &&
      email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() &&
      password === ADMIN_PASSWORD;

    const isPinMatch = pin && String(pin).trim() === ADMIN_PIN;

    if (!isEmailPassMatch && !isPinMatch) {
      return NextResponse.json(
        { error: 'Invalid admin credentials. Please enter correct Email & Password or 4-digit Master PIN.' },
        { status: 401 }
      );
    }

    const token = `adm_token_${Date.now()}_${Buffer.from(ADMIN_EMAIL).toString('base64')}`;
    const response = NextResponse.json({
      success: true,
      message: 'Admin authorization granted',
      user: {
        email: ADMIN_EMAIL,
        name: 'GauTattva Administrator',
        role: 'admin',
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token || !token.startsWith('adm_token_')) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: ADMIN_EMAIL,
      name: 'GauTattva Administrator',
      role: 'admin',
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Admin logged out' });
  response.cookies.set({
    name: AUTH_COOKIE,
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}
