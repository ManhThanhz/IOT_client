import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import CurrentWeatherCard from "../../components/Card/CurrentWeatherCard";
import getCurrentWeather from "../../service/weatherapi/getCurrentWeather";
import ForecastWeatherCard from "../../components/Card/ForecastWeatherCard";
import getForecastWeather from "../../service/weatherapi/getForecastWeather";
import LightCard from "../../components/Card/LightCard";
import FanCard from "../../components/Card/FanCard";
import SensorsCard from "../../components/Card/SensorsCard";
import TempChartCard from "../../components/Card/TempChartCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

const Dashboard = ({ users }) => {
    const [weather, setWeather] = useState({});
    const [forecast, setForecast] = useState({});
    const [light, setLight] = useState('Light');
    const [greeting, setGreeting] = useState("");

    const getWeather = async () => {
        const response = await getCurrentWeather();
        console.log(response);
        setWeather(response);
    }

    const getForecast = async () => {
        const response = await getForecastWeather();
        console.log(response);
        setForecast(response);
    }

    useEffect(() => {
        getWeather();
        getForecast();
    }, []);

    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
            const now = new Date();
            const currentHour = now.getHours();
            
            let greetingMessage = "";
            
            if (currentHour < 12) {
              greetingMessage = "Good morning!";
            } else if (currentHour < 18) {
              greetingMessage = "Good afternoon!";
            } else {
              greetingMessage = "Good evening!";
            }
        
            greetingMessage += ` ${user.displayName}`;
          
            setGreeting(greetingMessage);
        } else {
            const now = new Date();
            const currentHour = now.getHours();
            
            let greetingMessage = "";
            
            if (currentHour < 12) {
              greetingMessage = "Good morning!";
            } else if (currentHour < 18) {
              greetingMessage = "Good afternoon!";
            } else {
              greetingMessage = "Good evening!";
            }
            setGreeting(greetingMessage);
        }
      });


    return (
        <div className="dashboard">
            <div className="content-section">
                <h3>Dashboard</h3>
                <div className="header-cards">
                    <CurrentWeatherCard weather={weather} />
                    <div className="welcome-user">
                        <h2>{greeting}</h2>
                    </div>
                    <div className="viewImg">
                        <img src="src/assets/background.jpg" alt="background_image" />
                    </div>
                </div>
                <div className="main-ada-content0">
                  <div>
                    <div className="main-ada-content">
                        <div className="cards">
                            <LightCard light={light} />
                        </div>
                        <div className="cards">
                            <FanCard />
                        </div>
                    </div>
                    {/* <div className="cards">
                      <SensorsCard />
                    </div> */}
                  </div>
                  <div className="temp-cards">
                    <TempChartCard />
                  </div>
                  <div className="wea-cards">
                    <ForecastWeatherCard weather={forecast} />
                  </div>
                </div>
            </div>
        </div>
    );
}
export default Dashboard;