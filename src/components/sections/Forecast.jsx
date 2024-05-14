import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TabButton from "../buttons/TabButton";
import ForecastCard from "../cards/ForecastCard";
import useWeatherData from "../../hooks/useWeatherData";

const Forecast = () => {
  const { forecastData, isLoading } = useWeatherData();
  const [sliderInit, setSliderInit] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [tabsList, setTabsList] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slidesCount, setSlidesCount] = useState(6);
  const [direction, setDirection] = useState(0);
  const [lastDirection, setLastDirection] = useState(0);
  const timeoutRef = useRef(null);

  const getCardStyles = useCallback((card, i, arr) => ({
    width: card.active && sliderInit && `calc((100% - 24px * ${slidesCount - 1}) / ${slidesCount})`,
    marginRight: i < arr.length - 2 && card.active && sliderInit && "24px",
    marginLeft: i === arr.length - 1 && card.active && sliderInit && "24px"
  }), [sliderInit, slidesCount]);
  const getTabData = useCallback((tab) => (forecastData.tabContent[tab] || []).map((item, index) => ({ ...item, index, active: false })), [forecastData]);
  const getOutputData = useCallback((tab) => {
    const startIndex = direction > 0 ? slideIndex - direction : slideIndex;
    return getTabData(tab)
      .slice(startIndex, slidesCount && startIndex + slidesCount + Math.abs(direction))
      .map((item) => ({
        ...item,
        active: item.index >= slideIndex && item.index < (slideIndex + slidesCount)
      }));
  }, [getTabData, slideIndex, slidesCount, direction]);

  useEffect(() => {
    setTimeout(() => {
      onSwitchTab(forecastData.tabBtns[0].value);
    });

    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    setSlideIndex(0);
  }, [isLoading]);

  const resizeHandler = () => {
    setSlideIndex(0);
    const screenWidth = document.documentElement.clientWidth;

    if (screenWidth >= 1440) {
      setSliderInit(true);
      setSlidesCount(6);
    } else if (screenWidth >= 1231 && screenWidth < 1440) {
      setSliderInit(true);
      setSlidesCount(4);
    } else if (screenWidth >= 831 && screenWidth < 1231) {
      setSliderInit(true);
      setSlidesCount(3);
    } else if (screenWidth >= 681 && screenWidth < 831) {
      setSliderInit(true);
      setSlidesCount(2);
    } else {
      setSliderInit(false);
      setSlidesCount(undefined);
    }
  };

  const onSwitchTab = useCallback((value) => {
    setLastDirection(0);
    setTabsList([value, activeTab]);
    if (sliderInit) setActiveTab(null);
    clearTimeout(timeoutRef.current);
    setTimeout(() => {
      setActiveTab(value);
      setSlideIndex(0);
    });
    timeoutRef.current = setTimeout(() => {
      setTabsList([value]);
    }, 300);
  }, [sliderInit, activeTab]);

  const prevBtnDisabled = useMemo(() => isLoading || slideIndex === 0, [isLoading, slideIndex]);
  const nextBtnDisabled = useMemo(() => isLoading || slideIndex + slidesCount >= getTabData(activeTab).length, [isLoading, slideIndex, slidesCount, activeTab, getTabData]);

  const onPrev = useCallback(() => {
    if (prevBtnDisabled) return;
    setSlideIndex(prev => prev - 1);
    setDirection(-1);
    setLastDirection(-1);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDirection(0);
    }, 200);
  }, [prevBtnDisabled]);

  const onNext = useCallback(() => {
    if (nextBtnDisabled) return;
    setSlideIndex(prev => prev + 1);
    setDirection(1);
    setLastDirection(1);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDirection(0);
    }, 200);
  }, [nextBtnDisabled]);

  const keyDownHandler = useCallback((e) => {
    switch (e.key) {
      case "ArrowLeft":
        onPrev();
        break;
      case "ArrowRight":
        onNext();
        break;
      default:
        break;
    }
  }, [onPrev, onNext]);

  return (
    <section className="forecast" tabIndex={0} onKeyDown={keyDownHandler}>
      <header className="forecast__header">
        <h2 className="title section-title forecast__title">
          Прогноз
        </h2>
        <nav className="forecast__nav">
          <ul className="list forecast-nav__list">
            {forecastData.tabBtns.map((btn) => (
              <li key={btn.value} className="forecast-nav__item">
                <TabButton className="forecast-nav__switch-btn" active={btn.value === activeTab} onClick={() => onSwitchTab(btn.value)}>
                  {btn.label}
                </TabButton>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="forecast__slider">
        <div className="forecast-slider__navigation">
          <button className="btn forecast-slider-navigation__btn" onClick={onPrev} disabled={prevBtnDisabled}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 24.5L13.8735 18.8503C13.242 18.4593 13.242 17.5407 13.8735 17.1497L23 11.5" stroke="#ACACAC" strokeWidth="3"/>
            </svg>
          </button>
          <button className="btn forecast-slider-navigation__btn" onClick={onNext} disabled={nextBtnDisabled}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 13.5L24.1265 19.1497C24.758 19.5407 24.758 20.4593 24.1265 20.8503L15 26.5" stroke="#ACACAC" strokeWidth="3" />
            </svg>
          </button>
        </div>

        {tabsList.map((tab) => (
          <ul key={tab} className={["list forecast-slider__wrapper", tab !== activeTab ? "hidden" : ""].join(" ")} style={{ justifyContent: lastDirection === -1 && sliderInit && "flex-end" }} onChange={(e) => e.target.offsetWidth}>
            {getOutputData(tab).map((card, i, arr) => (
              <li
                key={`${card.index}-${card.title}`}
                className={["forecast-slider__item", (!card.active && sliderInit) || (i === 0 && direction === -1) || (i === arr.length - 1 && direction === 1) ? "hidden" : ""].join(" ")}
                style={getCardStyles(card, i, arr)}
              >
                <ForecastCard
                  title={card.title}
                  img={card.img}
                  weather={card.weather}
                  temp={card.temp}
                  tempAtNight={card.tempAtNight}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

export default Forecast;
