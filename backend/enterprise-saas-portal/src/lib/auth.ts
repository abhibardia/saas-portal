import { jwtVerify, SignJWT } from 'jose';

interface SessionPayload {
  userId: string;
  role: string;
  tenantId?: string | null;
  [key: string]: unknown;
}

const secretKey = process.env.JWT_SECRET || 'super-secret-key-replace-in-production';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionPayload;
}
