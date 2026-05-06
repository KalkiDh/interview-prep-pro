import { MongoClient } from "https://deno.land/x/mongo@v0.34.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const uri = Deno.env.get("MONGODB_URI");
    if (!uri) throw new Error("MONGODB_URI is not configured");

    const client = new MongoClient();
    await client.connect(uri);
    const db = client.database("interviewiq");
    const collection = db.collection("test_data");

    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      const doc = {
        message: typeof body.message === "string" ? body.message : "hello from InterviewIQ",
        createdAt: new Date(),
      };
      const insertedId = await collection.insertOne(doc);
      client.close();
      return new Response(
        JSON.stringify({ success: true, insertedId, doc }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const docs = await collection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
    client.close();
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
