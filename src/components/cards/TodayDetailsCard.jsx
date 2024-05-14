import useWeatherData from "../../hooks/useWeatherData";
import { directions } from "../../utils";
import Loader from "../Loader";
import ProgressBar from "../ProgressBar";

const TodayDetailsCard = ({ title, value, unit, additionalInfo, withProgressBar }) => {
  const { isLoading } = useWeatherData();
  const windDirectionIndex = Math.round(additionalInfo?.angle / 45);
  const windDirectionLabel = directions[windDirectionIndex >= directions.length
    ? 0
    : windDirectionIndex];

  return (
    <article className="card today-details__card">
      {isLoading && <Loader />}
      <h3 className="title today-details-card__title">
        {title}
      </h3>
      <p className={["descr truncate today-details-card__value", unit.length > 4 ? "unit-size-sm" : ""].join(" ")}>
        {value} <span>{unit}</span>
      </p>
      {withProgressBar && (
        <ProgressBar value={isLoading ? 0 : value} />
      )}
      {additionalInfo && (
        <div className="today-details-card__extra-info">
          <img src={additionalInfo.icon} alt="Иконка" style={{ transform: isLoading ? "none" : `rotate(${windDirectionIndex * 45}deg)` }} />
          <span>{windDirectionLabel}</span>
        </div>
      )}
    </article>
  );
}

export default TodayDetailsCard;
