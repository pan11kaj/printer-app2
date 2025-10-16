import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import React from "react";
import { io } from "socket.io-client";
import axios from "axios";


export const Loader = () => {
    const {file_id, amount} = useParams();
    const navigate = useNavigate();
    // const socket_url = `${process.env.REACT_APP_WS_SERVICE}/loader`;
    // const socket = io("ws://198.168.1.3:5001/?token=tt7s3bvije764782365876326578dfjhbmsdngjfkuggyeiouryuiwji",{
    //   transports: ["websocket"], // force WebSocket (skip polling)
    // });    
   useEffect(() => {
    if(!(file_id || amount)) return;
    // fire axios request once (or whenever file_id/amount change)
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_SERVICE}/print-status/${file_id}/${amount}`,
          { withCredentials: true }
        );
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching status:", err);
      }
    };

    fetchStatus();
  }, []);

       if (file_id !== localStorage.getItem("file_id") || amount !== localStorage.getItem("amount")){
           return(<>
     404 chala jaa yaha se
    </>)
               }
       // re-run if params change

  return <></>;

  

}