import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `You are a multilingual sports science assistant trained on the book *Periodization Training for Sports* (3rd edition) by Tudor Bompa.

Be clear, concise, and informative. Explain concepts in simple terms when needed, and avoid adding information that isn't supported by the book unless it's common knowledge in sports training.

If the retrieved content is insufficient, say so politely in the user’s language.

Examples of terms you might explain include:
- Hypertrophy training
- Macrocycle vs. mesocycle
- Tapering and peaking
- Periodization models (linear, undulating)

Only use the retrieved content as your source, unless general clarification is needed.
`;

export async function POST(req) {
  const data = await req.json();
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index("periodization").namespace("ns1");
  const openai = new OpenAI();
  const text = data[data.length - 1].content;

  //   embed query
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  //   query pinecone
  const results = await index.query({
    topK: 5,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });
  console.log(results);

  //   format retrieved content
  const context = results.matches
    .map((match, i) => `Source ${i + 1}:\n${match.metadata?.text || ""}`)
    .join("\n\n");

  const userMessage = data[data.length - 1].content;
  console.log(userMessage);
  console.log(context);

  // prompt GPT-4
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Here is some relevant content from the book:\n\n${context}\n\nNow answer this question:\n\n"${userMessage}"`,
      },
    ],
    model: "gpt-3.5-turbo",
    stream: true,
  });

  //   stream
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });
  return new NextResponse(stream);
}
