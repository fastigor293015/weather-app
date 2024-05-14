import { useCallback, useEffect, useRef, useState } from "react";
import OutlinedButton from "../buttons/OutlinedButton";
import useWeatherData from "../../hooks/useWeatherData";
import { getCityInfo, getForecast, getTodayDetails } from "../../api";

const SearchPanel = ({ isOpen, onClose }) => {
  const [cityValue, setCityValue] = useState("");
  const [errorText, setErrorText] = useState("");
  const [lastQueries, setLastQueries] = useState([]);
  const { isLoading, setIsLoading, curCity, updateData } = useWeatherData();
  const inputRef = useRef(null);

  useEffect(() => {
    const queries = localStorage.getItem("last-queries");
    const parsedQueries = JSON.parse(queries);

    if (parsedQueries) setLastQueries(parsedQueries);
  }, []);

  const onChange = useCallback((e) => {
    setErrorText("");
    if (e.target.value.match(/[A-Za-z]/g)) {
      setCityValue(cityValue);
      setErrorText("Ввод только на русском языке!");
    } else {
      setCityValue(e.target.value);
    }
  }, [cityValue]);

  const getWeatherData = useCallback(async (query) => {
    try {
      setIsLoading(true);
      const data = await getCityInfo(query);

      if (data.length > 0) {
        const formattedCityName = data[0].address.city || data[0].address.town || data[0].address.state || data[0].address.province || data[0].display_name;
        const newQueriesList = [formattedCityName, ...lastQueries.filter((cityName) => cityName !== formattedCityName).slice(0, 4)];
        setLastQueries([...newQueriesList]);
        localStorage.setItem("last-queries", JSON.stringify(newQueriesList));
        setCityValue("");
        onClose();
        setErrorText("");

        const forecastData = await getForecast(data[0].lat, data[0].lon);
        const todayDetailsData = await getTodayDetails(data[0].lat, data[0].lon);
        updateData(formattedCityName, forecastData, todayDetailsData);
      } else {
        setErrorText("Упс! Город не найден, попробуйте другой");
        setIsLoading(false);
        setTimeout(() => inputRef.current.focus());
        return;
      }
    } catch (error) {
      console.log(error);
      setErrorText("Что-то пошло не так...");
    } finally {
      setIsLoading(false);
    }
  }, [lastQueries, onClose, setIsLoading, updateData]);

  const handleClick = useCallback((query) => {
    getWeatherData(query);
  }, [getWeatherData]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    getWeatherData(cityValue);
  }, [cityValue, getWeatherData]);

  return (
    <div className={["search-panel", isOpen ? "active" : ""].join(" ")}>
      <button className="btn search-panel__close-btn" onClick={onClose}>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path id="Vector" d="M26 2.61857L23.3814 0L13 10.3814L2.61857 0L0 2.61857L10.3814 13L0 23.3814L2.61857 26L13 15.6186L23.3814 26L26 23.3814L15.6186 13L26 2.61857Z" fill="currentColor" />
        </svg>
      </button>
      <form className="search-panel__search-form" onSubmit={onSubmit}>
        <input ref={inputRef} className="search-panel__search-input" type="text" value={cityValue} onChange={onChange} placeholder="Город или район" autoComplete="off" required disabled={isLoading} />
        <OutlinedButton className="search-panel__search-btn" type="submit" disabled={isLoading || cityValue === ""}>
          Найти
        </OutlinedButton>
      </form>
      {errorText && (
        <p className="descr search-panel__search-error">{errorText}</p>
      )}
      {lastQueries.length > 0 && (
        <ul className="list search-panel__queries-list">
          {lastQueries.map((query, i) => (
            <li key={`${i}-${query}`} className="search-panel__queries-item">
              <button className={["btn search-panel__queries-btn", query === curCity ? "active" : ""].join(" ")} onClick={() => handleClick(query)} disabled={isLoading}>
                {query}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchPanel;
