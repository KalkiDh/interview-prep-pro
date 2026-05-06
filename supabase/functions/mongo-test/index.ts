import { MongoClient } from "npm:mongodb@6.10.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

let cachedClient: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;
  const uri = Deno.env.get("MONGODB_URI");
  if (!uri) throw new Error("MONGODB_URI is not configured");
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const client = await getClient();
    const db = client.db("interviewiq");
    const collection = db.collection("test_data");

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const doc = {
        message: typeof body.message === "string" ? body.message : "hello from InterviewIQ",
        createdAt: new Date(),
      };
      const result = await collection.insertOne(doc);
      return new Response(
        JSON.stringify({ success: true, insertedId: result.insertedId, doc }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // GET: return last 10 docs
    const docs = await collection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
    return new Response(
      JSON.stringify({ success: true, count: docs.length, docs }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("mongo-test error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
