import { createContext, useCallback, useEffect, useState } from "react";
import { getCityInfo, getForecast, getTodayDetails } from "../api";
import { getFormattedForecastData, getFormattedSidebarData, getFormattedTodayDetailsData, mockForecastData, mockSidebarData, mockTodayDetailsData } from "../utils";

export const WeatherDataContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
  curCity: "Москва",
  sidebarData: mockSidebarData,
  forecastData: mockForecastData,
  todayDetailsData: mockTodayDetailsData,
  updateData: () => {},
});

export const WeatherDataProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarData, setSidebarData] = useState(mockSidebarData);
  const [forecastData, setForecastData] = useState(mockForecastData);
  const [todayDetailsData, setTodayDetailsData] = useState(mockTodayDetailsData);
  const [curCity, setCurCity] = useState("Москва");

  useEffect(() => {
    const city = localStorage.getItem("cur-city");

    if (city) {
      setCurCity(city);
      getData(city);
    } else {
      getData(curCity);
    }
  }, []);

  const updateData = useCallback((cityName, newForecastData, newTodayDetailsData) => {
    setCurCity(cityName);
    localStorage.setItem("cur-city", cityName);
    setSidebarData(getFormattedSidebarData(newTodayDetailsData));
    setForecastData(getFormattedForecastData(newForecastData));
    setTodayDetailsData(getFormattedTodayDetailsData(newTodayDetailsData));
  }, []);

  const getData = useCallback(async (cityName) => {
    try {
      setIsLoading(true);
      const cityInfo = await getCityInfo(cityName);
      const formattedCityName = cityInfo[0].address.city || cityInfo[0].address.town || cityInfo[0].address.state || cityInfo[0].address.province || cityInfo[0].display_name;
      setCurCity(formattedCityName);

      const newTodayDetailsData = await getTodayDetails(cityInfo[0].lat, cityInfo[0].lon);
      const newForecastData = await getForecast(cityInfo[0].lat, cityInfo[0].lon);
      updateData(cityName, newForecastData, newTodayDetailsData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [updateData]);

  return (
    <WeatherDataContext.Provider value={{
      isLoading,
      setIsLoading,
      curCity,
      sidebarData,
      forecastData,
      todayDetailsData,
      updateData
    }}>
      {children}
    </WeatherDataContext.Provider>
  )
}
