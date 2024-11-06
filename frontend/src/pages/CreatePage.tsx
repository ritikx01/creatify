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
  async function handleClick(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (isRandomSeed) {
      setSeed(Math.floor(Math.random() * 4294967295));
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            prompt: inputValue,
            num_inference_steps: numInferenceSteps,
            height: imageHeight,
            width: imageWidth,
            seed: seed,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        showNotification(data.msg || "Network error", "error");
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
      formatImageSource(data.image);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  }
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
