import useWeatherData from "../../hooks/useWeatherData";
import Loader from "../Loader";

const ForecastCard = ({ title, img, weather, temp, tempAtNight }) => {
  const { isLoading } = useWeatherData();

  return (
    <article className="card forecast-slider__card">
      {isLoading && <Loader />}
      <h3 className="title truncate forecast-slider-card__title">{title}</h3>
      <img className="forecast-slider-card__img" src={img} alt={weather} />
      <p className="descr forecast-slider-card__temp">
        {temp}
        {tempAtNight && (
          <span>{tempAtNight}</span>
        )}
      </p>
    </article>
  );
}

export default ForecastCard;
