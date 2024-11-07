import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Images } from "lucide-react";
import { useNotification } from "@/components/NotificationProvider";

interface InputNumberInterface {
  id: string;
  min: number;
  max: number;
  value: number;
  label?: string;
  onChange: (value: number) => void;
}

interface CreateRequestBody {
  prompt: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  seed?: number;
  randomize_seed?: boolean;
}

function InputNumber({
  id,
  min,
  max,
  value,
  label,
  onChange,
}: InputNumberInterface) {
  return (
    <div className="flex justify-center gap-6 items-center">
      {label !== undefined ? (
        <label htmlFor={id} className="w-full">
          {label}:
        </label>
      ) : (
        ""
      )}
      <input
        id={id}
        name={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="rounded border-primaryBorder dark:border-primaryBorderDark border-[1px] bg-transparent p-1 focus:outline focus:border-transparent outline-[#0071e3] w-full"
      />
    </div>
  );
}
function Loading() {
  return (
    <div className="flex gap-4 ">
      <Loader2 className="animate-spin dark:stroke-primaryBorder stroke-primaryBorder" />
      <span className="font-medium text-lg dark:text:primaryBorder text:primaryBorder">
        Loading...
      </span>
    </div>
  );
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

function CreatePage() {
  const [inputValue, setInputValue] = useState<string>("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageHeight, setImageHeight] = useState<number>(1024);
  const [imageWidth, setImageWidth] = useState<number>(1024);
  const [numInferenceSteps, setNumInferenceSteps] = useState<number>(4);
  const [seed, setSeed] = useState<number>(
    Math.floor(Math.random() * 4294967295),
  );
  const [isRandomSeed, setIsRandomSeed] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);

  const { showNotification } = useNotification();
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
      const imageURL = events[0][0]?.url || "";

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
  }

  async function handleClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (isRandomSeed) {
      setSeed(Math.floor(Math.random() * 4294967295));
    }
    try {
      const processedParams = {
        prompt: inputValue,
        num_inference_steps: numInferenceSteps,
        height: imageHeight,
        width: imageWidth,
        seed: seed,
      };
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/create`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(processedParams),
          },
        );

        const data = await response.json();
        formatImageSource(data.image);
      } catch (e) {
        try {
          const image = await createGradio(processedParams);
          const data = { image: image };
          formatImageSource(data.image || "");
        } catch (error) {
          console.log("Gradio error:", error);
          showNotification("Network error", "error");
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Network error", "error");
    }
    setLoading(false);
  }
  const formatImageSource = (responseData: string) => {
    try {
      new URL(responseData);
      setImageData(responseData);
    } catch {
      setImageData(`data:image/png;base64,${responseData}`);
      return false;
    }
  };
  return (
    <div className="grow flex">
      <div className="w-[650px] p-14 border-r-primaryBorder dark:border-r-primaryBorderDark border-r-2">
        <form
          className="flex flex-col gap-3 border-[1px] border-primaryBorder p-4 rounded-md"
          onSubmit={handleClick}
        >
          <div className="flex gap-6 items-center">
            <label htmlFor="prompt">Prompt:</label>
            <input
              type="text"
              name="prompt"
              id="prompt"
              className="rounded border-primaryBorder border-[1px] bg-transparent p-1 focus:outline focus:border-transparent outline-[#0071e3] w-full"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <InputNumber
            id="width"
            min={256}
            max={2048}
            value={1024}
            label="Width"
            onChange={setImageWidth}
          />
          <InputNumber
            id="height"
            min={256}
            max={2048}
            value={1024}
            label="Height"
            onChange={setImageHeight}
          />
          <InputNumber
            id="num_inference_steps"
            min={1}
            max={50}
            value={4}
            label="Inference Steps"
            onChange={setNumInferenceSteps}
          />
          <InputNumber
            id="seed"
            min={0}
            max={4294967295}
            value={seed}
            label="Seed"
            onChange={setSeed}
          />
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="randomSeed"
              checked={isRandomSeed}
              onChange={(e) => {
                setIsRandomSeed(e.target.checked);
                if (!isRandomSeed) {
                  setSeed(Math.floor(Math.random() * 4294967295));
                }
              }}
              className="mr-2"
            />
            <label htmlFor="randomSeed">Randomize Seed</label>
          </div>
          <button
            type="submit"
            className="dark:bg-primaryDark bg-primaryLight dark:hover:bg-primaryDarkHover hover:bg-primaryLightHover rounded-md px-3 py-1 font-semibold"
          >
            Generate
          </button>
        </form>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="flex w-[768px] h-[768px] relative overflow-hidden rounded-lg shadow-lg border-primaryBorder border-[1px] justify-center items-center">
          {loading ? (
            <Loading />
          ) : (
            <Images className="dark:stroke-primaryBorder stroke-primaryBorder" />
          )}
          {imageData && (
            <img
              src={imageData || ""}
              alt=""
              className="absolute w-full h-full object-cover rounded shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
