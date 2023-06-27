import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import PropTypes from "prop-types";
import "./styles/style.scss";

export const Carousel = React.memo(
  ({ slides, autoplay, interval, arrows, onSlideChange, currentSlide }) => {
    const [localSlides, setLocalSlides] = useState([]);
    const nextRef = useRef();

    const slideRight = useCallback(() => {
      let nextIndex = currentSlide + 1;

      if (nextIndex > localSlides.length - 1) nextIndex = 0;

      onSlideChange(nextIndex);
    }, [currentSlide, localSlides.length]);

    const slideLeft = useCallback(() => {
      let nextIndex = currentSlide - 1;

      if (nextIndex < 0) nextIndex = localSlides.length - 1;

      onSlideChange(nextIndex);
    }, [currentSlide, localSlides.length]);

    useEffect(() => {
      const locSlides = [];

      slides.forEach((slide, index) => {
        const slideobject = {
          element: slide,
        };

        locSlides.push(slideobject);
      });

      if (slides.length === 2) {
        slides.forEach((slide) => {
          const slideobject = {
            element: slide,
          };

          locSlides.push(slideobject);
        });
      }

      const lastSlideIndex = locSlides.length - 1;

      const processedSlides = locSlides.map((slide, i) => {
        let slideClass = "slider-single";

        if (
          currentSlide - 1 === i ||
          (i === lastSlideIndex && currentSlide === 0)
        ) {
          slideClass = "slider-single preactive";
        }

        if (
          currentSlide + 1 === i ||
          (i === 0 && currentSlide === lastSlideIndex)
        ) {
          slideClass = "slider-single proactive";
        }

        if (currentSlide === i) {
          slideClass = "slider-single active";
        }

        return {
          ...slide,
          class: slideClass,
        };
      });

      setLocalSlides(processedSlides);
    }, [slides, currentSlide]);

    const sliderClass = (direction) => {
      let sliderClass = `slider-${direction}`;
      if (!arrows) {
        sliderClass = "slider-disabled";
      } else {
        sliderClass = `slider-${direction}`;
      }

      return sliderClass;
    };

    useEffect(() => {
      if (autoplay) {
        const intervalId = setInterval(() => {
          slideLeft();
        }, interval);

        return () => clearInterval(intervalId);
      }
    }, [autoplay, interval]);

    const handlers = useSwipeable({
      onSwipedLeft: () => slideRight(),
      onSwipedRight: () => slideLeft(),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    });

    return (
      <div className="react-3d-carousel" {...handlers}>
        {localSlides && localSlides.length > 0 && (
          <div className="slider-container">
            <div className="slider-content">
              {localSlides.map((slider, index) => {
                return (
                  <div className={slider.class} key={index}>
                    <div className={sliderClass("left")} onClick={slideLeft} />
                    <div
                      className={sliderClass("right")}
                      onClick={slideRight}
                      ref={nextRef}
                    />

                    <div className="slider-single-content">
                      {slider.element}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Carousel.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.element),
  autoplay: PropTypes.bool,
  interval: PropTypes.number,
  arrows: PropTypes.bool,
  arrowBorders: PropTypes.bool,
  onSlideChange: PropTypes.func,
  defaultSlide: PropTypes.number,
  currentSlide: PropTypes.number,
};

Carousel.defaultProps = {
  autoplay: false,
  interval: 3000,
  arrows: true,
  arrowBorders: true,
  onSlideChange: function () {},
};
