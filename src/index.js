import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import PropTypes from "prop-types";
import "./styles/style.scss";

export const Carousel = React.memo(
  ({
    slides,
    autoplay,
    interval,
    arrows,
    onSlideChange,
    defaultSlide = -1,
    currentSlide,
  }) => {
    const [slideTotal, setSlideTotal] = useState(0);
    const [slideCurrent, setSlideCurrent] = useState(defaultSlide);
    const [localSlides, setLocalSlides] = useState([]);
    const [height, setHeight] = useState("0px");
    const intervalRef = useRef(null);
    const nextRef = useRef();

    useEffect(() => {
      if (currentSlide) {
        setSlideCurrent(currentSlide);
      }
    }, [currentSlide]);

    const handlers = useSwipeable({
      onSwipedLeft: () => slideRight(),
      onSwipedRight: () => slideLeft(),
      preventDefaultTouchmoveEvent: true,
      trackMouse: true,
    });

    useEffect(() => {
      const locSlides = [];
      slides.forEach((slide) => {
        const slideobject = {
          class: "slider-single proactivede",
          element: slide,
        };

        locSlides.push(slideobject);
      });

      if (slides.length === 2) {
        slides.forEach((slide) => {
          const slideobject = {
            class: "slider-single proactivede",
            element: slide,
          };

          locSlides.push(slideobject);
        });
      }

      setLocalSlides(locSlides);
      setSlideTotal(locSlides.length - 1);
      setSlideCurrent(-1);

      if (slideCurrent === -1) {
        setTimeout(() => {
          nextRef.current.click();
          if (autoplay) {
            intervalRef.current = setTimeout(() => {
              nextRef.current.click();
            }, interval);
          }
        }, 500);
      }
    }, [slides]);

    const slideRight = () => {
      let preactiveSlide;
      let proactiveSlide;
      let slideCurrentLoc = slideCurrent;

      const activeClass = "slider-single active";
      const slide = [...localSlides];
      if (slideTotal > 1) {
        if (slideCurrentLoc < slideTotal) {
          slideCurrentLoc++;
        } else {
          slideCurrentLoc = 0;
        }
        if (slideCurrentLoc > 0) {
          preactiveSlide = slide[slideCurrentLoc - 1];
        } else {
          preactiveSlide = slide[slideTotal];
        }
        const activeSlide = slide[slideCurrentLoc];
        if (slideCurrentLoc < slideTotal) {
          proactiveSlide = slide[slideCurrentLoc + 1];
        } else {
          proactiveSlide = slide[0];
        }

        slide.forEach((slid, index) => {
          if (slid.class.includes("preactivede")) {
            slid.class = "slider-single proactivede";
          }
          if (slid.class.includes("preactive")) {
            slid.class = "slider-single preactivede";
          }
        });

        preactiveSlide.class = "slider-single preactive";
        activeSlide.class = activeClass;
        proactiveSlide.class = "slider-single proactive";
        setLocalSlides(slide);
        setSlideCurrent(slideCurrentLoc);

        if (
          document.getElementsByClassName("slider-single active").length > 0
        ) {
          setTimeout(() => {
            if (
              document.getElementsByClassName("slider-single active").length > 0
            ) {
              const height = document.getElementsByClassName(
                "slider-single active"
              )[0].clientHeight;
              setHeight(`${height}px`);
            }
          }, 500);
        }
        onSlideChange(slideCurrentLoc);
        if (autoplay) {
          clearTimeout(intervalRef.current);
          intervalRef.current = setTimeout(() => {
            nextRef.current.click();
          }, interval);
        }
      } else if (slide[0] && slide[0].class !== activeClass) {
        slide[0].class = activeClass;
        setLocalSlides(slide);
        setSlideCurrent(0);
      }
    };
    const slideLeft = () => {
      if (slideTotal > 1) {
        let preactiveSlide;
        let proactiveSlide;
        let slideCurrentLoc = slideCurrent;
        const slide = [...localSlides];

        if (slideCurrentLoc > 0) {
          slideCurrentLoc--;
        } else {
          slideCurrentLoc = slideTotal;
        }

        if (slideCurrentLoc < slideTotal) {
          proactiveSlide = slide[slideCurrentLoc + 1];
        } else {
          proactiveSlide = slide[0];
        }
        let activeSlide = slide[slideCurrentLoc];
        if (slideCurrentLoc > 0) {
          preactiveSlide = slide[slideCurrentLoc - 1];
        } else {
          preactiveSlide = slide[slideTotal];
        }
        slide.forEach((slid, index) => {
          if (slid.class.includes("proactivede")) {
            slid.class = "slider-single preactivede";
          }
          if (slid.class.includes("proactive")) {
            slid.class = "slider-single proactivede";
          }
        });
        preactiveSlide.class = "slider-single preactive";
        activeSlide.class = "slider-single active";
        proactiveSlide.class = "slider-single proactive";

        setLocalSlides(slide);
        onSlideChange(slideCurrentLoc);
        setSlideCurrent(slideCurrentLoc);

        if (
          document.getElementsByClassName("slider-single active").length > 0
        ) {
          setTimeout(() => {
            if (
              document.getElementsByClassName("slider-single active").length > 0
            ) {
              const height = document.getElementsByClassName(
                "slider-single active"
              )[0].clientHeight;
              setHeight(`${height}px`);
            }
          }, 500);
        }
      }
    };

    const sliderClass = (direction) => {
      let sliderClass = `slider-${direction}`;
      if (!arrows) {
        sliderClass = "slider-disabled";
      } else {
        sliderClass = `slider-${direction}`;
      }
      return sliderClass;
    };

    return (
      <div className="react-3d-carousel" style={{ height }} {...handlers}>
        {localSlides && localSlides.length > 0 && (
          <div className="slider-container">
            <div className="slider-content">
              {localSlides.map((slider, index) => {
                const isPrev = slider.class.includes("preactive");
                const isNext = slider.class.includes("proactive");

                return (
                  <div className={slider.class} key={index}>
                    <div className={sliderClass("left")} onClick={slideLeft} />
                    <div
                      className={sliderClass("right")}
                      onClick={slideRight}
                      ref={nextRef}
                    />

                    <div
                      className="slider-single-content"
                      onClick={() => {
                        if (isPrev) slideLeft();
                        if (isNext) slideRight();
                      }}
                    >
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
