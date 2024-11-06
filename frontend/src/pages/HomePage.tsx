import ImageSlider from "@/components/ImageSlider";

function HomePage(): JSX.Element {
  return (
    <div>
      <header className="py-12 text-center text-6xl font-semibold">
        Get&nbsp;
        <span className="text-transparent bg-highlight bg-clip-text">
          creative
        </span>
      </header>
      <p className="text-center text-lg">
        Just write the description and our AI tool will generate the images for
        you.
      </p>
      <ImageSlider />
    </div>
  );
}

export default HomePage;
