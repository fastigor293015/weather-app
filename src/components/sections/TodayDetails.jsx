import useWeatherData from "../../hooks/useWeatherData";
import TodayDetailsCard from "../cards/TodayDetailsCard";

const TodayDetails = () => {
  const { todayDetailsData } = useWeatherData();

  return (
    <section className="today-details">
      <h1 className="title section-title today-details__title">
        Подробно на сегодня
      </h1>
      <ul className="list today-details__list">
        {Object.keys(todayDetailsData).map((key) => (
          <li key={todayDetailsData[key].title} className="today-details__item">
            <TodayDetailsCard title={todayDetailsData[key].title} value={todayDetailsData[key].value} unit={todayDetailsData[key].unit} additionalInfo={todayDetailsData[key].additionalInfo} withProgressBar={todayDetailsData[key].unit === "%"} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TodayDetails;
