from fastapi import APIRouter,HTTPException,UploadFile,File,Form,WebSocket,WebSocketException
from typing import Annotated
from fastapi.responses import HTMLResponse
import os

from sqlmodel import Session,select
from dotenv import load_dotenv
from ..db import engine,redis
from ..utils import isValidPrinter,generate_unique_file_id,get_no_of_pages
import aiofiles
import razorpay
import json

from ..models import Uploaded_Files,Users
router = APIRouter(prefix="/printers",tags=["printers"])

# all the payloads must contains a key called event
load_dotenv(dotenv_path="../.env")
RAZORPAY_ID = os.environ.get("RAZORPAY_ID")
RAZORPAY_SECRET = os.environ.get("RAZORPAY_SECRET")
razorpay_client = razorpay.Client(auth=(RAZORPAY_ID, RAZORPAY_SECRET))


# connection manager for the printer clients

class ConnectedPrintersManager:
    def __init__(self):
        self.active_connections: dict = {}

    async def connect(self, license_id,websocket: WebSocket):
        await websocket.accept()
        self.active_connections[license_id] = websocket

    async def disconnect(self, license_id,websocket: WebSocket):
        await websocket.close()
        self.active_connections.pop(license_id)

    async def send_personal_message(self, data, printer_name:str):
        await self.active_connections[printer_name].send_json(data)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

data = {
    "queues":str([{
        "file_id":"jobID"
    }]),
    "current_user":""
}
class QueueManager:
    def __init__(self):
        pass
    async def get_all_print_queues(self, printer_name:str):
        return await redis.hget(printer_name, "queues")
    async def get_current_user(self, printer_name:str):
        return await redis.hget(printer_name,"current_user")
    async def push_print_queue(self, printer_name:str,file_id:str, job_id:str):
        list_of_data =  await redis.hget(printer_name, "queues")
        old_queue = list(list_of_data)
        updated_queue = old_queue.append({file_id:job_id})
        await redis.hset(printer_name,"queues",str(updated_queue))
    async def pop_print_queue(self, printer_name:str,file_id:str):
        list_of_data =  await redis.hget(printer_name, "queues")
        old_queue = list(list_of_data)
        # updated_queue = old_queue.remove()


printers = ConnectedPrintersManager()
queue_manager = QueueManager()



###########################Connection of different printers client:
@router.websocket("/connection/{client_license}/{client_password}")
async def connect_to_server(websocket:WebSocket, client_license:str, client_password:str):
    await printers.connect(client_license, websocket)
    if (not isValidPrinter(client_license)):
        print("printer is not valid")
        await printers.disconnect(client_license,websocket)
        raise  WebSocketException(1008,"license is not valid")
    with Session(engine) as session:
        query = select(Users).where(Users.url_endpoint == client_license)
        user = session.exec(query).one_or_none()
        if(user == None):
            print("User is none")
            await printers.disconnect(client_license,websocket)
            raise  WebSocketException(1008,"license is not valid")
        else:
            if(user.license_password != client_password):
                await printers.disconnect(client_license,websocket)

                raise  WebSocketException(1008,"license is not valid")
    try:
        print(printers.active_connections)
        socket:WebSocket = printers.active_connections[client_license]
        while True:
            msg = await socket.receive()
            if( msg!= None):
                print(msg)
    except:
        print("HELLO THIS IS SOME ERROR OCUREKJHDGJKHJSKDKG")
        await printers.disconnect(client_license,websocket)

@router.get("/")
def Index(printer_name:str):
    if(not isValidPrinter(printer_name)):
        raise HTTPException(status_code=404, detail="Printer not found with these address")
    return printer_name

@router.post("/upload")
async def upload_file_handler(printer_name:str,file:UploadFile):
    if(not isValidPrinter(printer_name)):
        raise HTTPException(status_code=404, detail="Printer not found with these address")
    # ext,no_of_pages = 

    upload_folder_path = os.environ.get("FILES_PATH")
    file_id   = generate_unique_file_id()
    extension = file.filename.rsplit(".")[len(file.filename.rsplit("."))-1]
    file_name = f"{upload_folder_path}/{file_id}.{extension}"
    print("hello world")

    async with aiofiles.open(file_name,"wb") as f:
        content = await file.read()
        await f.write(content)
    no_of_pages = get_no_of_pages(file_name)
    

    with Session(engine) as session:
        amount_for_user = session.exec(select(Users).where(Users.url_endpoint==printer_name)).one_or_none().amount_per_page
        print(amount_for_user)
        amount = amount_for_user*no_of_pages
        new_file = Uploaded_Files(file_id=file_id,amount=amount,status="FILE UPLOADED BUT NOT PRINTED",printer_name=printer_name,no_of_pages=no_of_pages)
        session.add(new_file)
        session.commit()
    try:
        payload = {
            "file_id":file_id,
            "event":"file_send",
            "extension":extension
        }
        await printers.send_personal_message(payload,printer_name)
        return {
                    "message": "File uploaded!!",
                    "no_of_pages":no_of_pages,
                    "amount":amount,
                    "id":file_id
                }
    except Exception as e:
        print(e)
        print("ksjdhgkjnsdfjkngkjsdnfkjgnjkdsfkjgjkdfskjgjdfkgjk")
        raise HTTPException(403, "Something went unexpected")
    

@router.post("/create-order/{amount}")
def create_order_for_razorpay(amount:int,printer_name:str):
    if(not isValidPrinter(printer_name)):
        raise HTTPException(409, "Unautorized Access")
    currency = "INR"
    order_data = {
        "amount": amount,
        "currency": currency
    }
    razorpay_order = razorpay_client.order.create(data=order_data)
    return {"order_id": razorpay_order['id'], "amount": amount}


@router.post('/verify/{file_id}/{amount}')
async def verify_signature(printer_name:str,file_id: str, amount: int, razorpay_payment_id: Annotated[str,Form()], razorpay_order_id:  Annotated[str,Form()], razorpay_signature:  Annotated[str,Form()]):
    if(not isValidPrinter(printer_name)):
        raise HTTPException(409, "Unautorized Access")
    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })
        with Session(engine) as session:
            query = select(Uploaded_Files).where(Uploaded_Files.file_id == int(file_id))
            file_uploaded = session.exec(query).one_or_none()

            file_uploaded.payment_id = razorpay_payment_id
            file_uploaded.status = "Payment done xerox is left"
            session.add(file_uploaded)
            session.commit()
            session.refresh(file_uploaded)

            payload = {
            "file_id":file_id,
            "event":"print_file",
        }
            await printers.send_personal_message(payload,printer_name)
       
        return {
            "data": [file_id, amount]
        }, 200
    except razorpay.errors.SignatureVerificationError:
        return {
            "data": None,
            "error": "Signature verification failed"
        }, 400


######################websocket connection related task here
html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <h2>Your ID: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var client_id = Date.now()
            document.querySelector("#ws-id").textContent = client_id;
            var ws = new WebSocket(`ws://localhost:8000/printers/connection/emp8g5t125giy6r3/sadfsdgf`);
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""





@router.get("/test")
async def get():
    return HTMLResponse(html)


@router.get("/test-2")
async def get2():
    return ""

