export const getCityInfo = async (cityName) => {
  const res = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${cityName}&format=json&addressdetails=1&limit=1`);
  const data = await res.json();
  console.log(data);
  return data;
}

export const getTodayDetails = async (lat, lon) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=ru`);
  const data = await res.json();
  console.log(data);
  return data;
}

export const getForecast = async (lat, lon) => {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric&lang=ru`);
  const data = await res.json();
  console.log(data);
  // console.log(data.list.map(item => ({
  //   description: item.weather[0].description,
  //   main: item.weather[0].main,
  //   icon: item.weather[0].icon,
  //   dt_txt: item.dt_txt,
  //   temp: item.main.temp
  // })));
  return data;
}
