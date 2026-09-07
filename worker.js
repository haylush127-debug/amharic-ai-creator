export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Amharic AI Creator API is ready!");
    }

    try {
      const { topic, duration, style, platform } = await request.json();

      const prompt = `
Create a ${duration || 60}-second ${style || "Education"} video script
for ${platform || "TikTok"}.

Topic: ${topic}

Write the script in natural, clear Amharic.
Make it engaging and suitable for Ethiopian audiences.
Include:
1. Hook
2. Main content
3. Call to action
`;

      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct-fast",
        { prompt }
      );

      return new Response(JSON.stringify({
        success: true,
        topic,
        script: result.response
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};
