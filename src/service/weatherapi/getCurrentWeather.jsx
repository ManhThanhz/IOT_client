import axios from 'axios';

const getCurrentWeather = async () => {
    const city = 'Ho Chi Minh City';
    const apiKey = '2638ed469a624cd6bb5160220240605';
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
    const response = await axios.get(url)
    .then((response) => {
        return response.data;
    }).catch((error) => {
        console.error('Error:', error);
    });
    return response;
}
export default getCurrentWeather;