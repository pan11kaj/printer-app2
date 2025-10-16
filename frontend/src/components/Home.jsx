import { useEffect, useState } from 'react';
import { } from './Icons.component';
import '../styles/home.css';
import { PNGFileCard } from './Icons.component';
import { JPGFileCard } from './Icons.component';
import { PDFFileCard } from './Icons.component';
import { DOCFileCard } from './Icons.component';
import axios from 'axios';
import { data, useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;
export function Home() {
    const [file, setFile] = useState(null)
    const [file_mode, set_file_mode] = useState(0);
    // const [file_type,set_file_type]  = useState(null);
    const [progressOfUpload, setProgressOfUpload] = useState(0);
    const navigate = useNavigate();
    // const [file_id,set_file_id] = useState(null);
    const cancelUpload = ()=>{
        // setFile(null)
        // set_file_type("");
        set_file_mode(0);
        setProgressOfUpload(0);
    }
    const selectFile = (event) => {
        const selected_file = event.target.files[0];
        setFile(selected_file);
        if(selected_file === undefined) return;
        const fileURL = URL.createObjectURL(selected_file);
        set_file_mode(1)
        const fileLink = document.getElementById("file_url")
        fileLink.href = fileURL;
        fileLink.textContent = "view file";
    }
    useEffect(() => {
        if (document.getElementById("file_url").textContent === "view file" && file_mode == 0) {
            document.getElementById("file_url").textContent = "";
        }
        else {

        }
    }, [file_mode]);

    const select_file_fs = (attr)=>{
        document.getElementById("fileInput").setAttribute("accept",attr)
        document.getElementById("fileInput").click()
    }
    const handlePayment = async () => {
        try {
            // Step 1: Create order on backen
            // d
            const response = await handleUpload();
            const no_of_pages = response.no_of_pages
            const file_id = response.id;
            const { data } = await axios.post(`${process.env.REACT_APP_API_SERVICE}/create-order/${response.amount}`, {
                amount: response.amount, // INR 500
                
            }, {params:{
                printer_name:`${process.env.REACT_APP_PRINTER_NAME}`
            },
                onUploadProgress: (progressEvent) => {
                    console.log(progressEvent)
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(percent);
                    setProgressOfUpload(percent);
                },withCredentials:true
            });
            const amount_payed = response.amount;
            console.log(data);
            // Step 2: Open Razorpay checkout
            const options = {
                key: process.env.REACT_APP_RAZORPAY_ID, // from Razorpay dashboard
                amount: data.amount,
                currency: "INR",
                name: "Pay to printer service",
                description: "pay for the print",
                order_id: data.order_id,

                handler: async function (response) {
                    console.log(response);
                    const formData = new FormData();
                    formData.append("razorpay_order_id", response.razorpay_order_id);
                    formData.append("razorpay_payment_id", response.razorpay_payment_id);
                    formData.append("razorpay_signature", response.razorpay_signature);
                    const data = await axios.post(`${process.env.REACT_APP_API_SERVICE}/verify/${file_id}/${amount_payed}`, formData,{withCredentials:true,params:{
                printer_name:`${process.env.REACT_APP_PRINTER_NAME}`
            }});
                    if (data.data === null) {
                        console.log("failed");
                    }
                    else {
                        if (data.status === 200) {
                            const recieved_data = data.data;
                            console.log(data);
                            const file_id = recieved_data[0];
                            const amount = recieved_data[1];
                            // const no_of_pages = recieved_data[];
                            window.location.href = `${process.env.REACT_APP_API_SERVICE}/print-status/${file_id}/${parseInt(amount)}/${parseInt(no_of_pages)}`
                        }
                    }
                },

                theme: {
                    color: "#ff7b00ff",
                },
                config: {
                    display: {
                        hide: [
                            { method: "netbanking" },
                            { method: "paylater" },
                            { method: "emi" }
                        ],
                        preferences: {
                            show_default_blocks: true
                        }
                    }
                },

            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error(error);

        }
    }

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append("file", file); // "file" must match Flask request.files["file"]

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_SERVICE}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                params:{
                    "printer_name":`${process.env.REACT_APP_PRINTER_NAME}`
                }
            });
            console.log("Server response:", res.data);
            return res.data;
        } catch (err) {
            console.error("Upload failed:", err);
            return null;
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
            <input type="file" onChange={selectFile} id="fileInput" multiple style={{ display: "none" }} />

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Welcome to Automated printer Services
                    </h1>
                    <p className="text-gray-600 text-lg">
                        choose a file
                    </p>
                </div>
                <div className='flex justify-center'>  <a id='file_url' className='text-xl text-400 text-cyan-300 m-10 block underline font-mono'></a></div>
                {
                    file_mode === 0 ?
                        <><div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 " id='main-grid'>
                            <PDFFileCard
                                onClick={() => { select_file_fs(".pdf");
 }}
                            />

                            <DOCFileCard

                                onClick={() => {select_file_fs(".docx,.doc")}}
                            />

                            <PNGFileCard

                                onClick={() => {select_file_fs(".png") }}
                            />

                            <JPGFileCard

                                onClick={() => {select_file_fs(".jpg,.jpeg")}}
                            />
                        </div>


                        </> :
                        <>

                            <div className="w-full bg-gray-200  rounded-full dark:bg-gray-700 mb-8" style={{ display: `${progressOfUpload === 0 ? 'block' : 'block'}` }}>
                                <div className="bg-blue-600 text-xs animate-pulse font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `${progressOfUpload}%` }}>{`${progressOfUpload}%`}</div>
                            </div>


                            <div className='flex justify-center'>

                                <button type="button" onClick={() => handlePayment()} class="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Upload</button>
                                <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={cancelUpload}>Cancel</button>
                            </div>

                        </>
                }
            </div>
        </div>
    )
}