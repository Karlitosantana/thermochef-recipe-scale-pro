import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await request.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleUserCreated(userData: any) {
  const email = userData.email_addresses?.[0]?.email_address;
  const name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();

  if (!email) {
    console.error('No email found for user:', userData.id);
    return;
  }

  await prisma.user.create({
    data: {
      clerkId: userData.id,
      email,
      name: name || null,
      subscription: {
        create: {
          tier: 'FREE',
          status: 'ACTIVE',
        },
      },
    },
  });
}

async function handleUserUpdated(userData: any) {
  const email = userData.email_addresses?.[0]?.email_address;
  const name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();

  if (!email) {
    console.error('No email found for user:', userData.id);
    return;
  }

  await prisma.user.update({
    where: { clerkId: userData.id },
    data: {
      email,
      name: name || null,
    },
  });
}

async function handleUserDeleted(userData: any) {
  // Delete user and all related data
  await prisma.user.delete({
    where: { clerkId: userData.id },
  });
}