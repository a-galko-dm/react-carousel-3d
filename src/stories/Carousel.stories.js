import React, { useCallback, useState } from "react";
import { Carousel } from "..";

export default {
  component: Carousel,
};

const slides = [
  <div>hi 1</div>,
  <div>hi 2</div>,
  <div>hi 3</div>,
  <div>hi 4</div>,
  <div>hi 5</div>,
];

const ButtonWithHooks = () => {
  const [currentSlide, setCurrentSlide] = useState(1);

  return (
    <>
      <Carousel
        slides={slides}
        currentSlide={currentSlide}
        onSlideChange={setCurrentSlide}
      />
      {slides.map((slide, index) => (
        <button key={index} onClick={() => setCurrentSlide(index)}>
          {index}
        </button>
      ))}
    </>
  );
};

export const Main = {
  render: () => <ButtonWithHooks />,
};
