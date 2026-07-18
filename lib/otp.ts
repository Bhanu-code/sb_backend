import { PutCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo } from './dynamodb';
import { prisma } from './prisma';

const TABLE = 'otp_tokens';
const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

// save OTP to DynamoDB
export async function saveOtp(email: string, otp: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + OTP_EXPIRY_SECONDS;

  await dynamo.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        email,        // partition key
        otp,
        expiresAt,    // TTL — DynamoDB auto-deletes after this
        createdAt: new Date().toISOString(),
      },
    })
  );

  // find or create user in PostgreSQL
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        referralCode: generateReferralCode(),
      },
    });
  }

  return user;
}

// verify OTP from DynamoDB
export async function verifyOtp(
  email: string,
  otp: string
): Promise<{ valid: boolean; userId?: string; isNewUser?: boolean }> {
  const result = await dynamo.send(
    new GetCommand({
      TableName: TABLE,
      Key: { email },
    })
  );

  const record = result.Item;

  if (!record) {
    return { valid: false };
  }

  // check OTP matches
  if (record.otp !== otp) {
    return { valid: false };
  }

  // check not expired (belt and suspenders — DynamoDB TTL
  // can take up to 48hrs to actually delete)
  const now = Math.floor(Date.now() / 1000);
  if (record.expiresAt < now) {
    return { valid: false };
  }

  // delete OTP immediately after successful verification
  await dynamo.send(
    new DeleteCommand({
      TableName: TABLE,
      Key: { email },
    })
  );

  // get user from PostgreSQL
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { valid: false };

  return {
    valid: true,
    userId: user.id,
    isNewUser: !user.profileComplete,
  };
}

export async function saveOtpForReset(email: string, otp: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + OTP_EXPIRY_SECONDS

  await dynamo.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        email,
        otp,
        expiresAt,
        createdAt: new Date().toISOString(),
      },
    })
  )
}