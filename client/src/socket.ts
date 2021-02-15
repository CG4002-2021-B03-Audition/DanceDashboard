import store from "./store/session/store";
import { ws_move_connect, ws_move_message } from "./store/session/actions";

class Socket {
    ws: WebSocket;
    endpoint: string

    constructor(endpoint: string) {
        this.ws = new WebSocket(endpoint)
        this.endpoint = endpoint
    }

    connect() {
        if(this.ws.readyState === WebSocket.CLOSED) {
            this.ws = new WebSocket(this.endpoint)
        }
        this.ws.onopen = () => {
            store.dispatch(ws_move_connect(true))
            console.log("Successfully Connected!");
        }
        this.ws.onmessage = msg => {
            // dispatch action to update state whenever socket receives a message
            let obj = JSON.parse(msg.data)
            store.dispatch(ws_move_message(obj))
            console.log(msg);
        }
        this.ws.onclose = event => {
            store.dispatch(ws_move_connect(false))
            console.log("Socket closed connection: ", event);
        }
    
        this.ws.onerror = error => {
            console.log("Socket error: ", error);
        }  
    }

    disconnect() {
        if(this.ws.readyState === WebSocket.OPEN) {
            this.ws.close()
            store.dispatch(ws_move_connect(false))
            console.log("Disconnected from ws server!")
        }
    }

}

console.log(process.env)
let moveSocket = new Socket("ws://localhost:8080/ws")

export { moveSocket }
