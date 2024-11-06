import { Request, Response } from "express";

interface CreateRequestBody {
  prompt: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  seed?: number;
  randomize_seed?: boolean;
}

interface PredictionResult {
  data: Array<{
    url?: string;
  }>;
}

async function createGradio(
  params: CreateRequestBody,
): Promise<string | undefined> {
  try {
    const client = await fetch(
      "https://black-forest-labs-flux-1-schnell.hf.space/call/infer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            params.prompt,
            params.seed,
            false,
            params.width,
            params.height,
            params.num_inference_steps,
          ],
        }),
      },
    );

    const { event_id } = await client.json();

    const response2 = await fetch(
      `https://black-forest-labs-flux-1-schnell.hf.space/call/infer/${event_id}`,
    );
    if (!response2.body) {
      throw new Error("Response body is null");
    }

    const events = await readableStreamToJSON(response2.body);
    const imageURL = events[0][0]?.url || ""; // Incase GPU limit exceeds

    // const client = await Client.connect("black-forest-labs/FLUX.1-schnell");
    // const predictParams = {
    //   prompt: params.prompt,
    //   seed: params.seed ?? 0,
    //   randomize_seed: params.randomize_seed ?? true,
    //   width: params.width ?? 256,
    //   height: params.height ?? 256,
    //   num_inference_steps: params.num_inference_steps ?? 1,
    // };
    //
    // const result = (await client.predict(
    //   "/infer",
    //   predictParams,
    // )) as PredictionResult;

    if (!imageURL) {
      return undefined;
    }

    try {
      new URL(imageURL);
      return imageURL;
    } catch (error) {
      console.error("Gradio result error:", error);
      throw error;
    }
  } catch (error) {
    console.error("Gradio error:", error);
    throw error;
  }
  async function readableStreamToJSON(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader();
    let buffer = "";
    const events = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += new TextDecoder().decode(value);
      const lines = buffer.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const jsonStr = line.slice(6);
            const jsonData = JSON.parse(jsonStr);
            events.push(jsonData);
          } catch (e) {
            console.error("Failed to parse JSON:", e);
          }
        }
      }
    }

    return events;
  }
}

async function createCF(params: CreateRequestBody) {
  try {
    const CF_ACCOUND_ID = process.env.CF_ACCOUND_ID;
    const CF_WORKERS_AI_API_KEY = process.env.CF_WORKERS_AI_API_KEY;
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUND_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_WORKERS_AI_API_KEY}`,
        },
        body: JSON.stringify(params),
      },
    );
    const data = await response.json();
    try {
      const image: string = data.result.image;
      return image;
    } catch (error) {
      console.error("CF result error: ", error);
      throw error;
    }
  } catch (error) {
    console.error("CF image create error:", error);
    throw error;
  }
}

export async function createImage(
  req: Request<{}, {}, CreateRequestBody>,
  res: Response,
) {
  const {
    prompt,
    width = 1024,
    height = 1024,
    num_inference_steps = 4,
    seed = Math.floor(Math.random() * 4294967295),
  } = req.body;

  const processedParams = {
    prompt,
    width,
    height,
    num_inference_steps,
    seed: seed,
    // randomize_seed: true,
  };

  if (prompt === undefined) {
    res.status(400).json({ status: "Error", msg: "'prompt' is required." });
    return;
  }
  try {
    const image = await createGradio(processedParams);
    res.json({ image: image });
    return;
  } catch (error) {
    console.log("Gradio not working, trying cloudflare");
    try {
      const image = await createCF(processedParams);
      res.json({ image: image });
      return;
    } catch (error) {
      console.log("Gradio and Cloudflare not wroking");
      res.status(500).json({ msg: "Internal server error" });
      return;
    }
  }
}
