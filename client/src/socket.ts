import store from "./store/store";
import { imu_message, ws_move_connect, ws_move_message, WS_NEXT_ACTUAL, ws_pos_message } from "./store/ws/actions";

class Socket {
    ws: WebSocket | undefined;
    endpoint: string

    constructor(endpoint: string) {
        // this.ws = new WebSocket(endpoint)
        this.endpoint = endpoint
    }

    connect() {
        if(this.ws === undefined) {
            this.ws = new WebSocket(this.endpoint)
        } else if (this.ws.readyState === WebSocket.CLOSED) {
            this.ws = new WebSocket(this.endpoint)
        }
        this.ws.onopen = () => {
            store.dispatch(ws_move_connect(true))
            console.log("Successfully Connected!");
        }
        this.ws.onmessage = msg => {
            // dispatch action to update state whenever socket receives a message
            let obj = JSON.parse(msg.data)
            let data = JSON.parse(obj.body)
            let type = data.type 
            if (type === "move") {
                store.dispatch(ws_move_message(data))
            } else if (type === "position") {
                store.dispatch(ws_pos_message(data))
            } else if (type === "imu") {
                // console.log(data)
                store.dispatch(imu_message(data))
            }
            // store.dispatch({ type: WS_NEXT_ACTUAL, payload: 1}) // for week 7
            
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
        if(this.ws !== undefined) {
            if(this.ws.readyState === WebSocket.OPEN) {
                this.ws.close()
                store.dispatch(ws_move_connect(false))
                console.log("Disconnected from ws server!")
            }
        }
    }

}

console.log(process.env)
let moveSocket = new Socket("ws://localhost:8080/ws")

export { moveSocket }
