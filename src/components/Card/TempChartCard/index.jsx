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
                    display: false
                },
                ticks: {
                    maxTicksLimit: 6,
                    font: {
                        size: 10
                    }
                }
            },
            y: {
                type: 'linear',
                display: true,
                beginAtZero: false,
                ticks: {
                    font: {
                        size: 10
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 11
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        }
    };

    return (
        <div className="sensor-dashboard">
            <div className="dashboard-header">
                <h3>Sensor Data History</h3>
                
                {/* Display current (most recent) values */}
                {currentData && (
                    <div className="current-values-grid">
                        <div className="current-value temp-value">
                            <span className="value-label">Temperature</span>
                            <span className="value-number">{currentData.temp.value}°{currentData.temp.unit}</span>
                        </div>
                        <div className="current-value humid-value">
                            <span className="value-label">Humidity</span>
                            <span className="value-number">{currentData.humid.value}{currentData.humid.unit}</span>
                        </div>
                        <div className="current-value light-value">
                            <span className="value-label">Light</span>
                            <span className="value-number">{currentData.light.value} {currentData.light.unit}</span>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Temperature Chart */}
                <div className="chart-container temperature-chart">
                    <div className="chart-header">
                        <h4>Temperature</h4>
                    </div>
                    <div className="chart-content">
                        <CChart
                            type="line"
                            data={tempChartData}
                            options={chartOptions}
                        />
                    </div>
                </div>

                {/* Humidity Chart */}
                <div className="chart-container humidity-chart">
                    <div className="chart-header">
                        <h4>Humidity</h4>
                    </div>
                    <div className="chart-content">
                        <CChart
                            type="line"
                            data={humidChartData}
                            options={chartOptions}
                        />
                    </div>
                </div>

                {/* Light Chart */}
                <div className="chart-container light-chart">
                    <div className="chart-header">
                        <h4>Light</h4>
                    </div>
                    <div className="chart-content">
                        <CChart
                            type="line"
                            data={lightChartData}
                            options={chartOptions}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TempChartCard;