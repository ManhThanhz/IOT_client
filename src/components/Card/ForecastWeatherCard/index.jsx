import React from "react";
import CIcon from '@coreui/icons-react'
import { cilLocationPin } from "@coreui/icons";
import "./ForecastWeatherCard.css";

const ForecastWeatherCard = ({ weather }) => {
    // const [forecast] = weather.forecast?.forecastday[1] || [];
    return (
        <div className="forecast-weather-card">
            <h3>Tomorrow</h3>
            <p>{weather.forecast?.forecastday[1].date} </p>
            <div className="weather">
                <div>
                    <div className="location-part">
                        <CIcon icon={cilLocationPin} size="xl" />
                        <p>{weather.location?.name}</p>
                    </div>
                    <div className="overall-weather">
                        <div className="forecast-weather-condition">
                            <img src={
                                weather.forecast?.forecastday[1].day.condition.icon
                            } alt="weather icon" />
                            <p style={{maxWidth: 170 + 'px', textAlign: 'center'}}>{weather.forecast?.forecastday[1].day.condition.text}</p>
                        </div>
                        {/* <img src={weather.current?.condition?.icon} alt="weather icon" />
                        <p>Condition: {weather.current?.condition?.text}</p> */}
                        <div className="forecast-temp">
                            <p>{weather.forecast?.forecastday[1].day.avgtemp_c}°C</p>
                        </div>
                        
                    </div>
                    <p> 
                        <strong>Chance of Rain: </strong> {weather.forecast?.forecastday[1].day.daily_chance_of_rain}%
                    </p>
                </div>
            </div>
        </div>
    );
}
export default ForecastWeatherCard;