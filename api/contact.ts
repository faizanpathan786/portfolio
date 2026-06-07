import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sendContactEmail } from "./_email";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = await sendContactEmail((req.body ?? {}) as Record<string, string>);
  return res.status(result.status).json(result.body);
}
