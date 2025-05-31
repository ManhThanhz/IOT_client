import "./History.css";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from "../../../server/config"

const auth = getAuth();

const History = () => {
    const [logs, setLogs] = useState([]);
  
    useEffect(() => {
      const user = auth.currentUser; // assuming you have auth imported
      if (user) {
        const q = query(
          collection(db, "Logs"), 
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const unsub = onSnapshot(q, (querySnapshot) => {
          const logs = querySnapshot.docs.map(doc => doc.data());
          setLogs(logs);
        });
        // Cleanup subscription on unmount
        return () => unsub();
      }
    }, []);
  
    return (
        <div className="history">
        <div className="MainContent">
            <div className="historyTittle">
                <h1>History</h1>
            </div>
          <ul className="log-list">
            <li className="log-item log-header">
                <span className="log-time">Time</span>
                <span className="log-activity">Activity</span>
            </li>
            {logs.map((log, index) => (
              <li key={index} className="log-item">
                <span className="log-time">{new Date(log.timestamp?.toDate()).toLocaleString()}</span>
                <span className="log-activity">{log.activity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default History;