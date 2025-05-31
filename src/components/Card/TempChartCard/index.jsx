import React from "react";
import { useState, useEffect } from "react";
import getRecentTempData from "../../../service/adafruit/getRecentTempData";
import { CChart } from "@coreui/react-chartjs";
import "./TempChartCard.css";

const TempChartCard = () => {
    const [tempChartData, setTempChartData] = useState({ labels: [], datasets: [] });
    const [humidChartData, setHumidChartData] = useState({ labels: [], datasets: [] });
    const [lightChartData, setLightChartData] = useState({ labels: [], datasets: [] });
    const [currentData, setCurrentData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getRecentTempData();
            console.log("Telemetry History Data", response);
            
            if (response && response.status === "success" && response.data) {
                // Reverse the data to show oldest to newest (time series order)
                const reversedData = [...response.data].reverse();
                
                // Extract data for chart
                const labels = reversedData.map(item => 
                    new Date(item.timestamp).toLocaleTimeString("en-GB", { 
                        hour: '2-digit', 
                        minute: '2-digit'
                    })
                );
                
                const tempData = reversedData.map(item => item.temp.value);
                const humidData = reversedData.map(item => item.humid.value);
                const lightData = reversedData.map(item => item.light.value);
                
                // Set current data to the most recent entry (last in reversed array)
                setCurrentData(reversedData[reversedData.length - 1]);
                
                // Set temperature chart data
                setTempChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Temperature (°C)',
                            data: tempData,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.1)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                });

                // Set humidity chart data
                setHumidChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Humidity (%)',
                            data: humidData,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.1)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                });

                // Set light chart data
                setLightChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Light (lux)',
                            data: lightData,
                            borderColor: 'rgba(255, 206, 86, 1)',
                            backgroundColor: 'rgba(255, 206, 86, 0.1)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                });
            }
        };

        fetchData(); // Call only once
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                type: 'linear',
                display: true,
                beginAtZero: false
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        }
    };

    return (
        <div className="TempChart">
            <h3>Sensor Data History</h3>
            
            {/* Display current (most recent) values */}
            {currentData && (
                <div className="current-values" style={{ marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <div style={{ padding: '10px', backgroundColor: 'rgba(255, 99, 132, 0.1)', borderRadius: '5px' }}>
                            <strong>Temperature:</strong> {currentData.temp.value}°{currentData.temp.unit}
                        </div>
                        <div style={{ padding: '10px', backgroundColor: 'rgba(54, 162, 235, 0.1)', borderRadius: '5px' }}>
                            <strong>Humidity:</strong> {currentData.humid.value}{currentData.humid.unit}
                        </div>
                        <div style={{ padding: '10px', backgroundColor: 'rgba(255, 206, 86, 0.1)', borderRadius: '5px' }}>
                            <strong>Light:</strong> {currentData.light.value} {currentData.light.unit}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Temperature Chart */}
            <div className="Chart-Section" style={{ marginBottom: '30px' }}>
                <h4 style={{ color: 'rgba(255, 99, 132, 1)', marginBottom: '10px' }}>Temperature</h4>
                <div className="Chart-Content" style={{ height: '400px', width: '100%' }}>
                    <CChart
                        type="line"
                        data={tempChartData}
                        options={chartOptions}
                        style={{ height: '400px', width: '100%' }}
                    />
                </div>
            </div>

            {/* Humidity Chart */}
            <div className="Chart-Section" style={{ marginBottom: '30px' }}>
                <h4 style={{ color: 'rgba(54, 162, 235, 1)', marginBottom: '10px' }}>Humidity</h4>
                <div className="Chart-Content" style={{ height: '400px', width: '100%' }}>
                    <CChart
                        type="line"
                        data={humidChartData}
                        options={chartOptions}
                        style={{ height: '400px', width: '100%' }}
                    />
                </div>
            </div>

            {/* Light Chart */}
            <div className="Chart-Section" style={{ marginBottom: '30px' }}>
                <h4 style={{ color: 'rgba(255, 206, 86, 1)', marginBottom: '10px' }}>Light</h4>
                <div className="Chart-Content" style={{ height: '400px', width: '100%' }}>
                    <CChart
                        type="line"
                        data={lightChartData}
                        options={chartOptions}
                        style={{ height: '400px', width: '100%' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TempChartCard;