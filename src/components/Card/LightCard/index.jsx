import React from "react";
import { useState, useEffect} from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../server/config";
import adafruitkey from "../../../service/adafruit/adafruitkey";
import './LightCard.css';
import MQTT from 'mqtt';


const auth = getAuth();

const LightCard = ({ light }) => {
    const [isOn, setIsOn] = useState(false);
    const [client, setClient] = useState(null);
    const topics = ["/feeds/button1"];

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
    const toggleLight = () => {
        setIsOn(!isOn);
        client && client.publish(`CSE_MultiProject/feeds/button1`, isOn ? '0' : '1');

        // Log light status
        const user = auth.currentUser; // assuming you have auth imported
        if (user) {
          addDoc(collection(db, "Logs"), {
            userId: user.uid,
            timestamp: serverTimestamp(),
            activity: isOn ? "Light turned off" : "Light turned on"
          });
        }
    };

    return (
        <div className="light-card">
            <h3>{light}</h3>
            <div className="light">
                <div>
                    <div className="light-condition">
                        <p>{isOn ? "On" : "Off"}</p>
                    </div>
                    <div className={`toggle-container ${isOn ? "" : "off"}`} onClick={toggleLight}>
                        <div className="toggle-switch" style={{ left: isOn ? "50%" : "0" }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LightCard;