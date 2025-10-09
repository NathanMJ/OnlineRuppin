import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReturnButton from "../FComponents/ReturnButton.jsx";
import { getWorkerEntries, workerEntry, workerPause } from "../connectToDB.js";
import { socket } from "../App.jsx";




export default function ToggleService(props) {

  //TODO: if is worker set the time to a timer and the total to timer
  const location = useLocation();
  //workerId
  const worker = location.state?.worker || 'not found';
  const clickerId = location.state?.clickerId || worker._id
  const [workerTimes, setWorkerTimes] = useState([])

  useEffect(() => {
    if (worker._id) {
      const fetchWorkerTimes = async () => {
        const data = await getWorkerEntries(worker._id)
        console.log(data.entries);
        setWorkerTimes(data.entries)
      }
      fetchWorkerTimes()

      socket.emit(`subscribe:worker-entries`, worker._id)

      const handleEntriesUpdate = (data) => {
        console.log(data);
        
        if(data.workerId == worker._id){
          setWorkerTimes(data.entries)
        }
      }

        socket.on(`get-entries:updated`, handleEntriesUpdate)

      return () => {
        socket.emit('unsubscribe:worker-entries', worker._id)
        socket.off(`get-entries:updated`, handleEntriesUpdate)
      }
    }
  }, [worker._id])

  const changeStatus = async () => {
    //change status of the worker in the database
    console.log("Change status clicked");

    if (!isWorking()) {
      console.log("Starting work");

      const a = await workerEntry(worker._id, clickerId)
    }
    else {
      const a = await workerPause(worker._id, clickerId)
    }
  }

  const isWorking = () => {
    if (workerTimes.length > 0) {
      if (workerTimes[workerTimes.length - 1].pauseTime) {
        return false;
      }
      else { return true; }
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


  const whoClicked = (clicker) => {
    if (clicker.id === worker.id) {
      return "Me"
    }
    return clicker.name
  }
  return (
    <div className="managerTimer">
      <h2 className="welcome">Welcome {worker.name}</h2>
      <h2>Time worked today :</h2>
      <h3 className="timer">{totalDay()}</h3>
      <button
        onClick={changeStatus}
        className={isWorking() ? "pause" : "start"}
      >
      </button>
      <table>
        <thead>
          <tr>
            <th>Entry</th>
            <th>End</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {workerTimes.map((time, index) => (
            <tr key={index}>
              <td>
                {timeToString(time.startTime)}
                <br />
                ({whoClicked(time.starter)})
              </td>
              <td>
                {time.pauseTime
                  ? <>
                    {timeToString(time.pauseTime)}
                    <br />
                    ({whoClicked(time.pauser)})
                  </>
                  : "Currently working"}
              </td>
              <td>{totalTime(time.startTime, time.pauseTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReturnButton
        bottom={"3vh"}
        left={"3vh"}
        returnButton={() => props.goto("/workMain")}
      />
    </div>
  );
}
