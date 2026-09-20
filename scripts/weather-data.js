export const weatherMap = {
  0: {
    icon: "wi-day-sunny",
    nightIcon: "wi-night-clear",
    description: { ru: "Ясно", en: "Clear sky" }
  },
  1: {
    icon: "wi-day-cloudy",
    nightIcon: "wi-night-alt-cloudy",
    description: { ru: "Преимущественно ясно", en: "Mainly clear" }
  },
  2: {
    icon: "wi-day-cloudy",
    nightIcon: "wi-night-alt-cloudy",
    description: { ru: "Переменная облачность", en: "Partly cloudy" }
  },
  3: {
    icon: "wi-cloudy",
    nightIcon: "wi-cloudy",
    description: { ru: "Пасмурно", en: "Overcast" }
  },
  45: {
    icon: "wi-day-fog",
    nightIcon: "wi-night-fog",
    description: { ru: "Туман", en: "Fog" }
  },
  48: {
    icon: "wi-day-fog",
    nightIcon: "wi-night-fog",
    description: { ru: "Изморозь (туман с образованием инея)", en: "Depositing rime fog" }
  },
  51: {
    icon: "wi-day-sprinkle",
    nightIcon: "wi-night-alt-sprinkle",
    description: { ru: "Легкая морось", en: "Light drizzle" }
  },
  53: {
    icon: "wi-day-sprinkle",
    nightIcon: "wi-night-alt-sprinkle",
    description: { ru: "Умеренная морось", en: "Moderate drizzle" }
  },
  55: {
    icon: "wi-day-sprinkle",
    nightIcon: "wi-night-alt-sprinkle",
    description: { ru: "Плотная морось", en: "Dense drizzle" }
  },
  56: {
    icon: "wi-day-rain-mix",
    nightIcon: "wi-night-alt-rain-mix",
    description: { ru: "Слабая ледяная морось", en: "Light freezing drizzle" }
  },
  57: {
    icon: "wi-day-rain-mix",
    nightIcon: "wi-night-alt-rain-mix",
    description: { ru: "Плотная ледяная морось", en: "Dense freezing drizzle" }
  },
  61: {
    icon: "wi-day-rain",
    nightIcon: "wi-night-alt-rain",
    description: { ru: "Слабый дождь", en: "Slight rain" }
  },
  63: {
    icon: "wi-day-rain",
    nightIcon: "wi-night-alt-rain",
    description: { ru: "Умеренный дождь", en: "Moderate rain" }
  },
  65: {
    icon: "wi-day-rain",
    nightIcon: "wi-night-alt-rain",
    description: { ru: "Сильный дождь", en: "Heavy intensity rain" }
  },
  66: {
    icon: "wi-day-rain-mix",
    nightIcon: "wi-night-alt-rain-mix",
    description: { ru: "Слабый ледяной дождь", en: "Light freezing rain" }
  },
  67: {
    icon: "wi-day-rain-mix",
    nightIcon: "wi-night-alt-rain-mix",
    description: { ru: "Сильный ледяной дождь", en: "Heavy freezing rain" }
  },
  71: {
    icon: "wi-day-snow",
    nightIcon: "wi-night-alt-snow",
    description: { ru: "Слабый снегопад", en: "Slight snow fall" }
  },
  73: {
    icon: "wi-day-snow",
    nightIcon: "wi-night-alt-snow",
    description: { ru: "Умеренный снегопад", en: "Moderate snow fall" }
  },
  75: {
    icon: "wi-day-snow",
    nightIcon: "wi-night-alt-snow",
    description: { ru: "Сильный снегопад", en: "Heavy snow fall" }
  },
  77: {
    icon: "wi-day-snow",
    nightIcon: "wi-night-alt-snow",
    description: { ru: "Снежные зерна", en: "Snow grains" }
  },
  80: {
    icon: "wi-day-showers",
    nightIcon: "wi-night-alt-showers",
    description: { ru: "Слабый ливневый дождь", en: "Slight rain showers" }
  },
  81: {
    icon: "wi-day-showers",
    nightIcon: "wi-night-alt-showers",
    description: { ru: "Умеренный ливневый дождь", en: "Moderate rain showers" }
  },
  82: {
    icon: "wi-day-showers",
    nightIcon: "wi-night-alt-showers",
    description: { ru: "Сильный ливневый дождь", en: "Violent rain showers" }
  },
  85: {
    icon: "wi-day-snow-wind",
    nightIcon: "wi-night-alt-snow-wind",
    description: { ru: "Слабый ливневый снегопад", en: "Slight snow showers" }
  },
  86: {
    icon: "wi-day-snow-wind",
    nightIcon: "wi-night-alt-snow-wind",
    description: { ru: "Сильный ливневый снегопад", en: "Heavy snow showers" }
  },
  95: {
    icon: "wi-day-thunderstorm",
    nightIcon: "wi-night-alt-thunderstorm",
    description: { ru: "Гроза", en: "Thunderstorm: Slight or moderate" }
  },
  96: {
    icon: "wi-day-storm-showers",
    nightIcon: "wi-night-alt-storm-showers",
    description: { ru: "Гроза со слабым градом", en: "Thunderstorm with slight hail" }
  },
  99: {
    icon: "wi-day-storm-showers",
    nightIcon: "wi-night-alt-storm-showers",
    description: { ru: "Гроза с сильным градом", en: "Thunderstorm with heavy hail" }
  }
};

/*
Code	Description
0	Clear sky
1, 2, 3	Mainly clear, partly cloudy, and overcast
45, 48	Fog and depositing rime fog
51, 53, 55	Drizzle: Light, moderate, and dense intensity
56, 57	Freezing Drizzle: Light and dense intensity
61, 63, 65	Rain: Slight, moderate and heavy intensity
66, 67	Freezing Rain: Light and heavy intensity
71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
77	Snow grains
80, 81, 82	Rain showers: Slight, moderate, and violent
85, 86	Snow showers slight and heavy
95 *	Thunderstorm: Slight or moderate
96, 99 *	Thunderstorm with slight and heavy hail
*/