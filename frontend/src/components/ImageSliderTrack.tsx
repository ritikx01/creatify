interface Image {
  src: string;
  description: string;
}

interface ImageSliderTrackProps {
  images: Image[];
}

interface ImageItemProps {
  image: Image;
}

const ImageItem = ({ image }: ImageItemProps) => (
  <div className="w-72 h-72 justify-center items-center mx-10">
    <img
      src={image.src}
      className="object-cover object-center rounded-md"
      alt={image.description}
    />
    <p className="font-normal text-sm m-1 text-center">{image.description}</p>
  </div>
);

const ImageSlide = ({ images }: ImageSliderTrackProps) => (
  <div className="flex select-none justify-center w-max animate-slide">
    {images.map((image, index) => (
      <ImageItem key={index} image={image} />
    ))}
  </div>
);

function ImageSliderTrack({ images }: ImageSliderTrackProps) {
  return (
    <div className="py-16 relative">
      <div className="pause-on-hover flex w-max relative">
        <ImageSlide images={images} />
        <ImageSlide images={images} />
      </div>
    </div>
  );
}

export default ImageSliderTrack;
