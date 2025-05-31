import axios from 'axios';

const getRecentTempData = async () => {
    try {
        const result = await axios.get('http://localhost:5000/telemetry/history');
        return result.data;
    } catch (e) {
        console.log('Error fetching telemetry data:', e);
        return null;
    }
};

export default getRecentTempData;