import { useContext } from "react"
import { WeatherDataContext } from "../providers/WeatherData";

const useWeatherData = () => {
  return useContext(WeatherDataContext);
}

export default useWeatherData;
