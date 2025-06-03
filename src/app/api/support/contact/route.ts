import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, message, priority } = await request.json();

    if (!subject || !message) {
      return NextResponse.json({ 
        error: 'Subject and message are required' 
      }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject: subject.trim(),
        message: message.trim(),
        priority: priority || 'normal',
        status: 'OPEN',
      },
    });

    // In a real application, you would:
    // 1. Send email notification to support team
    // 2. Send confirmation email to user
    // 3. Integrate with help desk system (Zendesk, Intercom, etc.)

    console.log(`Support ticket created: ${ticket.id} for user ${user.email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Priority: ${priority}`);
    console.log(`Message: ${message.substring(0, 100)}...`);

    return NextResponse.json({ 
      success: true, 
      ticketId: ticket.id 
    });
  } catch (error) {
    console.error('Support contact error:', error);
    return NextResponse.json({ 
      error: 'Failed to send support message' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}