import React from "react";
import { useState, useEffect } from "react";
import getTempData from "../../../service/adafruit/getTempData";
import getHumidData from "../../../service/adafruit/getHumidData";
import getLightData from "../../../service/adafruit/getLightData";
import { CCard, CCardBody } from "@coreui/react";
import "./SensorsCard.css";

const SensorsCard = () => {
    const [temp, setTemp] = useState(0);
    const [humid, setHumid] = useState(0);
    const [light, setLight] = useState(0);
    
    useEffect(() => {
        const fetchData = async () => {
        const data = await getTempData();
        console.log(data);
        const tempValue = data.last_value;
        setTemp(tempValue);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
        const data = await getHumidData();
        console.log(data);
        const humidValue = data.last_value;
        setHumid(humidValue);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
        const data = await getLightData();
        console.log(data);
        const lightValue = data.last_value;
        setLight(lightValue);
        };
        fetchData();
    }, []);
    
    return (
        <CCard className="sensors-card">
        <CCardBody>
            <h3>Sensors</h3>
            <div className="sensors">
                <div className="flex">
                    <img src="src/assets/sensor/themo.png" alt="temperature" />
                    <div>
                        <h5>Temperature</h5>
                        <p>{temp} °C</p>
                    </div>
                </div>
                <div className="flex-align">
                    <div className="flex">
                        <img className="humid_img" src="src/assets/sensor/humid.png" alt="humidity" />
                        <div>
                            <h5>Humidity</h5>
                            <p>{humid} %</p>
                        </div>
                    </div>
                    <div className="flex light-sensor">
                        <img src="src/assets/sensor/light.png" alt="light" />
                        <div style={{marginLeft : 3}}>
                            <h5>Light</h5>
                            <p>{light} lux</p>
                        </div>
                    </div>
                </div>
            </div>
        </CCardBody>
        </CCard>
    );
};
export default SensorsCard;