import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReturnButton from "../FComponents/ReturnButton.jsx";
import { getWorkerEntries, workerEntry } from "../connectToDB.js";




export default function ToggleService(props) {
  //TO DO : 
  // Check if the current id is working or not 
  // Set the button according to the current status
  const location = useLocation();

  const workerId = location.state?.id || 'not found';
  const clickerId = location.state?.clickerId || workerId
  const [workerTimes, setWorkerTimes] = useState([])

  useEffect(() => {
    console.log(workerId);
    if (workerId) {
      const fetchWorkerTimes = async () => {
        console.log("Get workerTIme");
        
        const tempWorkerTimes = await getWorkerEntries(workerId)
        console.log(tempWorkerTimes);
        
        setWorkerTimes(tempWorkerTimes)
      }
      fetchWorkerTimes()
    }
  }, [workerId])

  const changeStatus = async () => {
    //change status of the worker in the database
    console.log("Change status clicked");
    if (checkIfWorking()) {
      const a = await workerEntry(workerId, clickerId)
    }


  }

  const checkIfWorking = async () => {
    if (workerTimes.length > 0) {
      if (workerTimes[workerTimes.length - 1].pauseTime) {
        return true;
      }
    }
    return false;
  };

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  const totalDay = () => {
    //if is working return a timer
    //if not return the total time worked today


    // Sum all time differences for today
    let totalMs = 0;
    const today = new Date().toDateString();

    workerTimes.forEach(time => {
      const start = new Date(time.startTime);
      const pause = new Date(time.pauseTime);

      // Only count entries from today and if both times exist
      if (
        time.startTime &&
        time.pauseTime &&
        start.toDateString() === today &&
        pause.toDateString() === today
      ) {
        totalMs += pause - start;
      }
    });

    const hours = Math.floor(totalMs / 3600000);
    const minutes = Math.floor((totalMs % 3600000) / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
  }

  const totalTime = (start, pause) => {
    if (start && pause) {
      const startTime = new Date(start);
      const pauseTime = new Date(pause);
      const diff = pauseTime - startTime;

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
    return "00:00:00";
  };


  const getNameById = (id) => {
    return "Temp Name";
  }

  return (
    <div className="managerTimer">
      <h2 className="welcome">Welcome {getNameById(workerId)}</h2>
      <h2>Time worked today :</h2>
      <h3 className="timer">{totalDay()}</h3>
      <button onClick={changeStatus}
        className={checkIfWorking ? "start" : "pause"}></button>
      <table>
        <thead>
          <tr>
            <th>Entry</th>
            <th>End</th>
            <th>Total</th>
          </tr>
        </thead>
        {workerTimes.map((time => (
          <tbody key={time.startTime}>
            <tr>
              <td>
                {timeToString(time.startTime)}<br />({getNameById(time.startId)})
              </td>
              <td>{timeToString(time.pauseTime)}<br />({getNameById(time.pauseId)})</td>
              <td>{totalTime(time.startTime, time.pauseTime)}</td>
            </tr>
          </tbody>
        )))}
      </table>
      <ReturnButton bottom={'3vh'} left={'3vh'} returnButton={() => props.goto('/workMain')}></ReturnButton>
    </div>
  );
}
