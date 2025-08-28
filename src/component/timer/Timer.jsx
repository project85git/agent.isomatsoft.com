import { Select } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Timer = () => {
    const { bg, color } = useSelector((state) => state.theme);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [utcOffset, setUtcOffset] = useState(0);

    useEffect(() => {
        const timerID = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timerID);
    }, []);

    const utcTime = new Date(currentTime.getTime() + currentTime.getTimezoneOffset() * 60000 + utcOffset * 3600000);
    const timeString = utcTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const dateString = utcTime.toLocaleDateString();

    return (
        <div style={{ color: "white", backgroundColor:bg }} className="flex items-center p-2 rounded-md bg-gray-800 text-white gap-3 justify-center">
            <Select 
                className="text-white rounded-md font-semibold border focus:outline-none focus:ring-1 focus:ring-white text-sm"
                value={utcOffset} 
                onChange={(e) => setUtcOffset(Number(e.target.value))}
            >
                {[...Array(25).keys()].map((i) => (
                    <option className='text-black' key={i - 12} value={i - 12}>UTC {i - 12 >= 0 ? `+${i - 12}` : i - 12}</option>
                ))}
            </Select>
            <div className='flex flex-col justify-center items-center p-2 h-12 rounded-md' style={{backgroundColor:"white", color:"black"}}>
            <div className="text-md font-bold">{timeString}</div>
            <div className="text-sm font-semibold">{`${dateString.split("/")[1]}/${dateString.split("/")[0]}/${dateString.split("/")[2]}`}</div>
            </div>
        </div>
    );
};

export default Timer;
