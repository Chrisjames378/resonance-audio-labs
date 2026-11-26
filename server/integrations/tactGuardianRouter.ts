import { Router, Request, Response } from "express";

const router = Router();
const guardianBase = (process.env.TACT_GUARDIAN_URL || "").replace(/\/+$/, "");

function configured() {
  return Boolean(guardianBase && process.env.TACT_GUARDIAN_TOKEN && process.env.TACT_BRIDGE_TOKEN);
}
function authorized(req: Request, res: Response) {
  const expected = process.env.TACT_BRIDGE_TOKEN || "";
  const supplied = (req.header("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!expected || supplied.length !== expected.length ||
      !Buffer.from(supplied).equals(Buffer.from(expected))) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
async function guardian(path: string, method = "GET", body?: unknown) {
  const response = await fetch(`${guardianBase}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.TACT_GUARDIAN_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error("Guardian request failed"), { status: response.status });
  return data;
}

router.get("/status", async (req, res) => {
  if (!authorized(req, res)) return;
  if (!configured()) return res.status(503).json({ configured: false });
  try { return res.json({ configured: true, guardian: await guardian("/v1/status") }); }
  catch { return res.status(502).json({ error: "Guardian status unavailable" }); }
});
router.post("/chat", async (req, res) => {
  if (!authorized(req, res)) return;
  if (!configured()) return res.status(503).json({ configured: false });
  const message = req.body?.message;
  if (typeof message !== "string" || !message.trim() || message.length > 12000)
    return res.status(400).json({ error: "message must be 1–12000 characters" });
  try { return res.json(await guardian("/v1/chat", "POST", { message: message.trim() })); }
  catch { return res.status(502).json({ error: "Guardian chat unavailable" }); }
});
router.post("/actions/prepare", async (req, res) => {
  if (!authorized(req, res)) return;
  if (!configured()) return res.status(503).json({ configured: false });
  const { action, payload } = req.body || {};
  if (typeof action !== "string" || action.length > 100)
    return res.status(400).json({ error: "A valid action name is required" });
  try { return res.json(await guardian("/v1/actions/prepare", "POST", { action, payload })); }
  catch { return res.status(502).json({ error: "Guardian action preparation unavailable" }); }
});
export default router;
