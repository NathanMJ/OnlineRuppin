import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { getEveryEntriesWithWorkers, workerEntry, workerPause } from "../connectToDB"
import ReturnButton from "../FComponents/ReturnButton"
import { socket } from "../App"
import FCTimer from "../FComponents/FCTimer"
import { useMessageContext } from "../Contexts/messageContext"

export default function ManagerWorkerPage() {

    const location = useLocation()
    const { manager } = location.state
    const [selectedWorkerId, setSelectedWorkerId] = useState(-1)
    const [workersAndEntries, setworkersAndEntries] = useState([])
      const { addMessage } = useMessageContext();



    useEffect(() => {
        const fetchData = async () => {
            const tempData = await getEveryEntriesWithWorkers()
            console.log(tempData);
            
            setworkersAndEntries(sortTheWorkers(tempData))
        }

        fetchData()

        const handleWorkersUpdate = (data) => {
            console.log('data', data)
            setworkersAndEntries(sortTheWorkers(data.data))
        }
        socket.emit('subscribe:manager:worker');

        socket.on('manager:worker:updated', handleWorkersUpdate);

        return () => {
            socket.emit('unsubscribe:manager:worker');
            socket.off('manager:worker:updated', handleWorkersUpdate);
        };


    }, [])


    const sortTheWorkers = (workers) => {
        //sort with their time and if they are working here is the sort 
        /*
            working 10:00
            working 02:00
            not working 08:00
            not working 00:00
        */
        return workers.sort((a, b) => {
            if (isWorking(a.entries) && !isWorking(b.entries)) {
                return -1
            }
            if (!isWorking(a.entries) && isWorking(b.entries)) {
                return 1
            }
            if(totalDayInMS(a.entries) < totalDayInMS(b.entries)){
                return 1
            }
            if(totalDayInMS(a.entries) > totalDayInMS(b.entries)){
                return -1
            }
            return 0
        })
    }

    const isWorking = (workerTimes) => {
        if (workerTimes.length > 0) {
            if (workerTimes[workerTimes.length - 1].pauseTime) {
                return false;
            }
            else { return true; }
        }
        return false;
    };


    const totalDay = (workerTimes) => {
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

        if (isWorking(workerTimes)) {
            const timerDate = new Date(new Date(workerTimes[workerTimes.length - 1].startTime) - (hours * 3600 + minutes * 60 + seconds) * 1000)
            return <FCTimer start={timerDate}></FCTimer>
        }

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds
                .toString()
                .padStart(2, '0')}`;
    }

    const totalDayInMS = (workerTimes) => {
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
        return totalMs;
    }

  const changeStatusOfWorker = async (workerAndEntries) => {
    //change status of the worker in the database
   
    let res;
    if (!isWorking(workerAndEntries.entries)) {
      res = await workerEntry(workerAndEntries.worker._id, manager._id)
    }
    else {
      res = await workerPause(workerAndEntries.worker._id, manager._id)
    }

    if(res.ok){
      addMessage(res.message, 'success', 5000)
    }
    else {
      addMessage(res.message, 'error', 5000)
    }
  }


    return (
        <div className="managerWorkerPage">
            <h1>Workers :</h1>
            <div className="workers">
                {workersAndEntries.map(w => {
                    return <div key={w.worker._id} className="worker">
                        <h1>{w.worker.name}</h1>
                        <button className={`${isWorking(w.entries) ? 'working' : 'notWorking'}`}
                        onClick={() => changeStatusOfWorker(w)}>
                            {isWorking(w.entries) ? 'Is working' : 'Is not working'}
                        </button>
                        <h2 className="totalTimeWorker">{totalDay(w.entries)}</h2>
                    </div>
                })}
            </div>
            <ReturnButton position={'fixed'} bottom={'10px'} left={'10px'}></ReturnButton>
        </div>
    )
}
