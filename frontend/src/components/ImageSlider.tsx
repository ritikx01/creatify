import butterflies from "@/assets/flux-images/butterflies-mythical-creature.webp"
import crystalCave from "@/assets/flux-images/crystal-cave.webp"
import cyberpunkMarket from "@/assets/flux-images/cyberpunk-market.webp"
import digitalOrganicWorld from "@/assets/flux-images/digital-organic-worlds.webp"
import flowers from "@/assets/flux-images/flowers.webp"
import flyingShip from "@/assets/flux-images/flying-ship.webp"
import hourglass from "@/assets/flux-images/hourglass-galaxies.webp"
import pheonix from "@/assets/flux-images/pheonix.webp"
import blackPanther from "@/assets/flux-images/panther.webp"
import bikerMan from "@/assets/flux-images/biker-man.webp"
import asianWoman from "@/assets/flux-images/asian-women.webp"
import oldMan from "@/assets/flux-images/old-man.webp"
import kidsSoccer from "@/assets/flux-images/kids-soccer.webp"
import noodles from "@/assets/flux-images/noodles.webp"

import ImageSliderTrack from "./ImageSliderTrack"

const images = [
  { src: kidsSoccer, description: "Young college kids playing soccer in a rainy day"},
  { src: butterflies, description: "Swarming butterflies coalescing to form a giant mythical creature" },
  { src: crystalCave, description: "A crystal cave illuminated by swirling aurora borealis" },
  { src: cyberpunkMarket, description: "Cyberpunk street market at night, holographic ads reflecting in rain puddles" },
  { src: asianWoman, description: "A smiling asian woman cycling through a forest"},
  { src: noodles, description: "A bowl of noodles with chopsticks resting  on a table, on a mountain, open sky"},
  { src: digitalOrganicWorld, description: "Dissolving reality glitching between digital and organic worlds" },
  { src: flowers, description: "Blooming flowers bursting with swirling paint instead of petals" },
  { src: flyingShip, description: "Steampunk-inspired flying ship soaring through clouds at golden hour" },
  { src: oldMan, description: "Old Middle eastern man in a market in evening"},
  { src: hourglass, description: "Shattering hourglass spilling galaxies and nebulae across a cosmic void" },
  { src: pheonix, description: "Mythical phoenix rising from ashes in a volcanic landscape" },
  { src: blackPanther, description: "A black panther in a mystical dense and dark forest with violet tint"},
  { src: bikerMan, description: "A selfie of a Man in biking gear on the road that goes through a grassland with a bike in background"},
];


function ImageSlider(): JSX.Element {
  return (
    <ImageSliderTrack images={images} />
  );
}

export default ImageSlider;

