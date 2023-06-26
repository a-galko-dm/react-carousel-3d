import React, { useCallback, useState } from "react";
import { Carousel } from "..";

export default {
  component: Carousel,
};

const slides = [<div>hi 1</div>, <div>hi 2</div>, <div>hi 3</div>];

const ButtonWithHooks = () => {
  const [currentSlide, setCurrentSlide] = useState(1);

  const onSlideChange = useCallback((slide) => {
    setCurrentSlide(slide);
  }, []);

  return (
    <Carousel
      currentSlide={currentSlide}
      slides={slides}
      onSlideChange={onSlideChange}
    />
  );
};

export const Main = {
  render: () => <ButtonWithHooks />,
};
