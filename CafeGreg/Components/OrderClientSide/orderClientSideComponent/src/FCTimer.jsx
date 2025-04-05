import React, { useState, useEffect } from "react";

export default function FCTimer(props) {

    const time = props.time; // Expected format: "hh:mm:ss"

    const [secondsLeft, setSecondsLeft] = useState(convertToSeconds(props.time));


    useEffect(() => {
        if (secondsLeft <= 0) return;

        const interval = setInterval(() => {
            setSecondsLeft((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [secondsLeft]);

    function convertToSeconds(time) {
        const [hh, mm, ss] = time.split(":").map(Number);
        return hh * 3600 + mm * 60 + ss;
    }

    function formatTime(sec) {
        const hours = String(Math.floor(sec / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
        const seconds = String(sec % 60).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    return <p style={{margin:0,padding:0}}>{secondsLeft > 0 ? formatTime(secondsLeft) : "Terminé !"}</p>;
}
