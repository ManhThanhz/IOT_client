import axios from 'axios';
import adafruitkey from './adafruitkey';

const getLightData = async () => {
    const result = await axios.get('https://io.adafruit.com/api/v2/CSE_MultiProject/feeds/sensor3', {
        headers: {
            "X-AIO-Key": adafruitkey
        }
    }).then(res => {
        return (res.data)
    }).catch(e => {
        console.log(e)
    })
    return result;
};
export default getLightData;