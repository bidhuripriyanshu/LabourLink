
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

const ROLES = ["LABOUR", "CONTRACTOR"];

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, password, role, city } = body;

    if (!name?.trim() || !phone?.trim() || !password || !role || !city?.trim()) {
      return NextResponse.json(
        { error: "Name, phone, password, role, and city are required." },
        { status: 400 }
      );
    }

    if (!ROLES.includes(role)) {
      return NextResponse.json(
        { error: "Role must be LABOUR or CONTRACTOR." },
        { status: 400 }
      );
    }

     if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    
    if ( phone.length === 10) {
      return NextResponse.json(
        { error: "Phone number must be at 10 Digits." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { phone: phone.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A user with this phone number already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        password: hashedPassword,
        role,
        city: city.trim(),
      },
      select: { id: true, name: true, phone: true, role: true, city: true },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role, city: user.city },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
