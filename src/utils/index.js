import compass from "../assets/images/compass.svg";

export const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];

export const weekdays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
export const months = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

export const getFormattedSidebarData = (data) => {
  let date = new Date(new Date().toUTCString());
  date = new Date(date.getTime() + data.timezone);
  const { formattedDate } = getDateDetails(date);

  return {
    img: getWeatherIconURL(data.weather[0].icon, 4),
    description: data.weather[0].description.slice(0, 1).toUpperCase() + data.weather[0].description.slice(1),
    temp: Math.round(data.main.temp),
    tempFeelsLike: Math.round(data.main.feels_like),
    date: formattedDate,
  }
}

export const getFormattedForecastData = (data) => {
  const itemsList = data.list;
  const timezone = data.city.timezone * 1000;
  const formattedData = {
    tabBtns: [
      {
        value: "week",
        label: "на неделю",
      },
      {
        value: "hourly",
        label: "почасовой",
      }
    ],
    tabContent: {
      week: [],
      hourly: [],
    }
  };
  for (let i = 0; i < itemsList.length; i++) {
    if (i >= 8) break;
    let date = new Date(itemsList[i].dt_txt);
    date = new Date(date.getTime() + timezone);

    for (let j = 0; j < 3; j++) {
      const newDate = new Date(date.getTime() + 60 * 60 * 1000 * j);
      const { time } = getDateDetails(newDate);
      formattedData.tabContent.hourly.push({
        title: time,
        weather: itemsList[i].weather[0].description,
        img: getWeatherIconURL(itemsList[i].weather[0].icon),
        temp: Math.round(itemsList[i].main.temp) + "°C",
      })
    }
  }

  const addItem = (i, date) => {
    console.log(weatherList);
    const mostFrequentNum = weatherList.reduce((previous, current, i, arr) =>
      arr.filter((item) => item === previous).length >
      arr.filter((item) => item === current).length
        ? previous
        : current
    );
    console.log(mostFrequentNum);
    const { formattedDate } = getDateDetails(date);
    formattedData.tabContent.week.push({
      title: formattedDate,
      weather: itemsList[i].weather[0].description,
      img: getWeatherIconURL(`${mostFrequentNum < 10 ? 0 : ""}${mostFrequentNum}d`),
      temp: Math.round(dayTemp) + "°C",
      tempAtNight: Math.round(nightTemp) + "°C",
    });

    flag = false;
    weatherList = [];
    dayTemp = -200;
    nightTemp = 200;
  }

  let weatherList = [],
      dayTemp = -200,
      nightTemp = 200,
      flag = false;

  for (let i = 0; i < itemsList.length; i++) {
    let date = new Date(itemsList[i].dt_txt);
    date = new Date(date.getTime() + timezone);

    const hours = date.getHours(),
          temp = itemsList[i].main.temp,
          icon = itemsList[i].weather[0].icon;

    if (hours >= 0 && hours <= 2) flag = true;
    if (!flag) continue;
    weatherList.push(parseInt(icon.slice(0, icon.length)));

    if (hours >= 0 && hours <= 6 && temp < nightTemp) {
      nightTemp = temp;
    }

    if (hours >= 12 && hours <= 18 && temp > dayTemp) {
      dayTemp = temp;

      if (i === itemsList.length - 1) {
        addItem(i, date);
      }
    }

    if (hours >= 21 && hours <= 23) {
      addItem(i, date);
    }
  }

  return formattedData;
}

export const getWeatherIconURL = (name, size = 2) => {
  return `https://openweathermap.org/img/wn/${name}@${size}x.png`;
}

export const getDateDetails = (date) => {
  const curDate = new Date(),
        dayIndex = date.getDate(),
        weekDay = weekdays[date.getDay()],
        month = months[date.getMonth()];

  return {
    formattedDate: (dayIndex === curDate.getDate() + 1 && date.getMonth() === curDate.getMonth()) ? "Завтра" : `${weekDay}, ${dayIndex} ${month}`,
    time: `${date.getHours().length === 1 ? 0 : ""}${date.getHours()}:00`
  }
}

export const getFormattedTodayDetailsData = (data) => ({
  wind: {
    title: "Скорость ветра",
    // округляем до десятых
    value: Math.round(data.wind.speed * 10) / 10,
    unit: "м/с",
    additionalInfo: {
      icon: compass,
      angle: data.wind.deg,
    },
  },
  humidity: {
    title: "Влажность",
    value: data.main.humidity,
    unit: "%",
  },
  visibility: {
    title: "Видимость",
    // переводим из м. в км и округляем до десятых
    value: Math.round((data.visibility / 1000) * 10) / 10,
    unit: "км",
  },
  pressure: {
    title: "Давление",
    // переводим из гектопаскалей в мм рт. ст.
    value: Math.round(data.main.pressure * 0.750064),
    unit: "мм рт. ст.",
  },
})

export const mockSidebarData = {
  img: getWeatherIconURL("13d", 4),
  description: "Снег",
  temp: "1",
  tempFeelsLike: "-3",
  date: "Вс, 13 мар",
}

export const mockForecastData = {
  tabBtns: [
    {
      value: "week",
      label: "на неделю",
    },
    {
      value: "hourly",
      label: "почасовой",
    }
  ],
  tabContent: {
    week: [
      {
        title: "Завтра",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
        tempAtNight: "4°C",
      },
      {
        title: "Пн, 15 мар",
        weather: "Дождь",
        img: getWeatherIconURL("10d"),
        temp: "10°C",
        tempAtNight: "4°C",
      },
      {
        title: "Вт, 16 мар",
        weather: "Дождь",
        img: getWeatherIconURL("10d"),
        temp: "10°C",
        tempAtNight: "4°C",
      },
      {
        title: "Ср, 17 мар",
        weather: "Гроза",
        img: getWeatherIconURL("11d"),
        temp: "10°C",
        tempAtNight: "4°C",
      },
      {
        title: "Чт, 18 мар",
        weather: "Гроза",
        img: getWeatherIconURL("11d"),
        temp: "10°C",
        tempAtNight: "4°C",
      },
      {
        title: "Пт, 19 мар",
        weather: "Гроза",
        img: getWeatherIconURL("11d"),
        temp: "10°C",
        tempAtNight: "4°C",
      },
      {
        title: "Сб, 20 мар",
        weather: "Гроза",
        img: getWeatherIconURL("11d"),
        temp: "10°C",
        tempAtNight: "4°C",
      },
    ],
    hourly: [
      {
        title: "15:00",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
      },
      {
        title: "16:00",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
      },
      {
        title: "17:00",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
      },
      {
        title: "18:00",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
      },
      {
        title: "19:00",
        weather: "Гроза",
        img: getWeatherIconURL("11d"),
        temp: "10°C",
      },
      {
        title: "20:00",
        weather: "Гроза",
        img: getWeatherIconURL("11d"),
        temp: "10°C",
      },
      {
        title: "21:00",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
      },
      {
        title: "22:00",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
      },
      {
        title: "23:00",
        weather: "Гроза",
        img: getWeatherIconURL("11d"),
        temp: "10°C",
      },
      {
        title: "00:00",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
      },
      {
        title: "01:00",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
      },
      {
        title: "02:00",
        weather: "Ветер",
        img: getWeatherIconURL("50d"),
        temp: "10°C",
      },
    ]
  }
};

export const mockTodayDetailsData = {
  wind: {
    title: "Скорость ветра",
    value: 7,
    unit: "м/с",
    additionalInfo: {
      icon: compass,
      angle: 315,
    },
  },
  humidity: {
    title: "Влажность",
    value: 84,
    unit: "%",
  },
  visibility: {
    title: "Видимость",
    value: 6.2,
    unit: "км",
  },
  pressure: {
    title: "Давление",
    value: 742,
    unit: "мм рт. ст.",
  },
};
