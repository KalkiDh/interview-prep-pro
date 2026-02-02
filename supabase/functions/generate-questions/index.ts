import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { industry, interviewType, questionCount = 6 } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert interview coach who creates realistic, challenging interview questions. Generate questions that are commonly asked in real interviews.

For behavioral questions, focus on STAR method scenarios (Situation, Task, Action, Result).
For technical questions, focus on domain-specific knowledge and problem-solving.

Always return a JSON array with this exact structure:
[
  {
    "id": "unique_id",
    "question": "The interview question",
    "category": "Category like 'Leadership' or 'Problem Solving'",
    "tips": ["Tip 1 for answering", "Tip 2 for answering"]
  }
]`;

    const userPrompt = `Generate ${questionCount} ${interviewType} interview questions for a ${industry} industry position.

Industry context:
- Tech: Software engineering, product management, data science roles
- Finance: Investment banking, financial analysis, accounting roles  
- Marketing: Digital marketing, brand management, growth roles
- Healthcare: Clinical, administrative, research roles

Interview type:
- Behavioral: Past experiences, teamwork, conflict resolution, leadership
- Technical: Domain knowledge, problem-solving, case studies
- Mixed: Combination of both types

Return ONLY the JSON array, no additional text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse questions from AI response");
    }
    
    const questions = JSON.parse(jsonMatch[0]);
    
    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating questions:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
