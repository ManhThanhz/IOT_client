import React from "react";
import CIcon from '@coreui/icons-react'
import { cilLocationPin } from "@coreui/icons";
import "./CurrentWeatherCard.css";

const CurrentWeatherCard = ({ weather }) => {
    return (
        <div className="current-weather-card">
            <h3>Current Weather</h3>
            <div className="weather">
                <div>
                    <div className="location-part">
                        <CIcon icon={cilLocationPin} size="xl" />
                        <p>{weather.location?.name}</p>
                    </div>
                    <div className="overall-weather">
                        <div className="weather-condition">
                            <img src={weather.current?.condition?.icon} alt="weather icon" />
                            <p style={{maxWidth: 170 + 'px', textAlign: 'center'}}>{weather.current?.condition?.text}</p>
                        </div>
                        {/* <img src={weather.current?.condition?.icon} alt="weather icon" />
                        <p>Condition: {weather.current?.condition?.text}</p> */}
                        <div className="temp">
                            <p>{weather.current?.temp_c}°C</p>
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CurrentWeatherCard;