import React from "react";
import { useState, useEffect } from "react";
import { CFormRange } from '@coreui/react';
import { CCollapse, CButton, CCard, CCardBody } from '@coreui/react';
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../server/config";
import adafruitkey from "../../../service/adafruit/adafruitkey";
import './FanCard.css';
import MQTT from 'mqtt';

const auth = getAuth();

const FanCard = () => {
    const [isOn, setIsOn] = useState(false);
    const [speed, setSpeed] = useState(40);
    const [visible, setVisible] = useState(false);
    const [client, setClient] = useState(null);
    const topics = ["/feeds/button2"];

    useEffect(() => {
        const connectMQTT = () => {
            const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
            const connectUrl = `wss://io.adafruit.com:443/mqtt}`;
            const client = MQTT.connect(connectUrl, {
                clientId,
                clean: true,
                connectTimeout: 8000,
                username: 'CSE_MultiProject',
                password: adafruitkey,
                reconnectPeriod: 1000,
            });

            client.on('connect', () => {
                console.log('Connected to Adafruit IO');
                topics.forEach(topic => {
                    client.subscribe(`CSE_MultiProject${topic}`, () => {
                        console.log(`Subscribed to ${topic}`);
                    });
                });
            });

            client.on('message', (topic, message) => {
                console.log(`Received message: ${message.toString()}`);
            });

            client.on('error', (err) => {
                console.error('Connection error: ', err);
                client.end();
            });

            setClient(client);
        };

        connectMQTT();

        return () => {
            client && client.end();
        };
    }, []);



    const toggleFan = () => {
        setIsOn(!isOn);
        setVisible(false);
        client && client.publish(`CSE_MultiProject/feeds/button2`, isOn ? '0' : '40');
        // Log fan status
        const user = auth.currentUser; // assuming you have auth imported
        if (user) {
          addDoc(collection(db, "Logs"), {
            userId: user.uid,
            timestamp: serverTimestamp(),
            activity: isOn ? "Fan turned off" : "Fan turned on"
          });
        }
    };

    const handleSpeedChange = (event) => {
        setSpeed(parseInt(event.target.value)); // Parse speed value as integer
        client && client.publish(`CSE_MultiProject/feeds/button2`, event.target.value.toString());
      };

    return (
        <div className="fan-card-content">
        <div className="fan-card">
            <h3>Fan</h3>
            <div className="fan">
                <div>
                    <div className="fan-condition">
                        <p>{isOn ? "On" : "Off"}</p>
                    </div>
                    <div className="inline">
                    <div className={`toggle-container ${isOn ? "" : "off"}`} onClick={toggleFan}>
                        <div className="toggle-switch" style={{ left: isOn ? "50%" : "0" }}></div>
                    </div>
                    {/* <button className="dropdown-icon" >▼</button> */}
                    {isOn ? <CButton className="collapse-btn" color="primary" onClick={() => setVisible(!visible)}>▼</CButton> : null}
                    {/* <CButton color="primary" onClick={() => setVisible(!visible)}>
                        ▼
                    </CButton> */}
                    {/* Dropdown content */}
                    </div>
                    
                </div>
            </div>
        </div>
        <CCollapse className="collapse-speed" visible={visible && isOn}>
            <CCard className="mt-2">
                <CCardBody>
                    <div className="speed-drag-bar">
                        <CFormRange
                          min="0"
                          max="100"
                          step="4"
                          value={speed}
                          onChange={handleSpeedChange}/>
                        <p>Speed: {speed}</p>
                    </div>
                </CCardBody>
            </CCard>
        </CCollapse>
        </div>
    );
}
export default FanCard;