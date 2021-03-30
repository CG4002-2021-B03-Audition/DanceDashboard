import store from "./store/store";
import { imu_message, ws_move_connect, ws_move_message, WS_NEXT_ACTUAL, ws_pos_message } from "./store/ws/actions";

class Socket {
    ws: WebSocket | undefined;
    endpoint: string;

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

class MoveSocket extends Socket {
    constructor(endpoint : string) {
        super(endpoint)
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
            } 
        }
        this.ws.onclose = event => {
            store.dispatch(ws_move_connect(false))
            console.log("Socket closed connection: ", event);
        }
    
        this.ws.onerror = error => {
            console.log("Socket error: ", error);
        }  
    }
}

class IMUSocket extends Socket {
    constructor(endpoint : string) {
        super(endpoint)
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
            store.dispatch(imu_message(data))
        }
        this.ws.onclose = event => {
            store.dispatch(ws_move_connect(false))
            console.log("Socket closed connection: ", event);
        }
    
        this.ws.onerror = error => {
            console.log("Socket error: ", error);
        }  
    }
}

class FlagSocket extends Socket {
    stopSound: HTMLAudioElement;
    startSound: HTMLAudioElement;
    constructor(endpoint : string) {
        super(endpoint)
        this.stopSound = new Audio("https://freesound.org/data/previews/344/344051_950925-lq.mp3")
        this.startSound = new Audio("https://freesound.org/data/previews/457/457968_2841496-lq.mp3")
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
            console.log("Received Flag: ", data)
            if (data.message === "start") {
                this.startSound.play()
            } else if (data.message === "stop") {
                this.stopSound.play()
            }
        }
        this.ws.onclose = event => {
            store.dispatch(ws_move_connect(false))
            console.log("Socket closed connection: ", event);
        }
    
        this.ws.onerror = error => {
            console.log("Socket error: ", error);
        }  
    }
}

console.log(process.env)
let moveSocket = new MoveSocket("ws://localhost:8080/ws")
let imuSocket = new IMUSocket("ws://localhost:8080/imu")
let flagSocket = new FlagSocket("ws://localhost:8080/flags")

export { moveSocket, imuSocket, flagSocket }
