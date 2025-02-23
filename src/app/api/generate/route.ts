export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const messages: Message[] = data.messages;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat:free",
          messages: [
            {
              role: "system",
              content:
                "You are PixelPal, a friendly AI buddy that turns ideas into websites!. You write web content, css, script all in an HTML. You must exclude unnecessary metadata in HTML and focus on the page content to keep your code simple and short. Use https://placehold.co/ to represent images.",
            },
            ...messages,
          ],
        }),
      }
    );

    const responseData = await response.json();
    const assistantMessage: Message = {
      role: responseData.choices?.[0]?.message?.role,
      content:
        responseData.choices?.[0]?.message?.content || "No response received.",
    };

    const updatedMessages = [...messages, assistantMessage];

    return Response.json({ messages: updatedMessages });
  } catch (error) {
    console.error("Error fetching assistant response:", error);
    return Response.json(
      { error: "Failed to fetch assistant response" },
      { status: 500 }
    );
  }
}
