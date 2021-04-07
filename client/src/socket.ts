import store from "./store/store";
import { emg_message, imu_message, ws_move_connect, ws_move_message, WS_NEXT_ACTUAL, ws_pos_message } from "./store/ws/actions";

class Socket {
    ws: WebSocket | undefined;
    endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

    connect() {
        if(this.ws === undefined) {
            this.ws = new WebSocket(this.endpoint)
        } else if (this.ws.readyState === WebSocket.CLOSED) {
            this.ws = new WebSocket(this.endpoint)
        }
        this.ws.onopen = () => {
            console.log("Socket open connection!")
        }
        this.ws.onmessage = msg => {
            console.log("Message Received!")
        }
        this.ws.onclose = event => {
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
            console.log("IMU Socket Successfully Connected!");
        }
        this.ws.onmessage = msg => {
            // dispatch action to update state whenever socket receives a message
            let obj = JSON.parse(msg.data)
            let data = JSON.parse(obj.body)
            store.dispatch(imu_message(data))
        }
        this.ws.onclose = event => {
            console.log("Socket closed connection: ", event);
        }
    
        this.ws.onerror = error => {
            console.log("Socket error: ", error);
        }  
    }
}

class FlagSocket extends Socket {
    stopMoveSound: HTMLAudioElement;
    stopPositionSound: HTMLAudioElement;
    startMoveSound: HTMLAudioElement;
    startPositionSound: HTMLAudioElement;
    danceSong: HTMLAudioElement;
    constructor(endpoint : string) {
        super(endpoint)
        this.stopMoveSound = new Audio("https://freesound.org/data/previews/344/344051_950925-lq.mp3")
        this.stopPositionSound = new Audio("https://freesound.org/data/previews/422/422724_4253642-lq.mp3")
        this.startMoveSound = new Audio("https://freesound.org/data/previews/457/457968_2841496-lq.mp3")
        this.startPositionSound = new Audio("https://freesound.org/data/previews/233/233036_66251-lq.mp3")
        this.danceSong = new Audio("../public/bts_dynamite_song.mp3")
    }

    connect() {
        if(this.ws === undefined) {
            this.ws = new WebSocket(this.endpoint)
        } else if (this.ws.readyState === WebSocket.CLOSED) {
            this.ws = new WebSocket(this.endpoint)
        }
        this.ws.onopen = () => {
            console.log("Flag Socket Successfully Connected!");
        }
        this.ws.onmessage = msg => {
            // dispatch action to update state whenever socket receives a message
            let obj = JSON.parse(msg.data)
            let data = JSON.parse(obj.body)
            console.log("Received Flag: ", data)
            if (data.message === "start_move") {
                this.startMoveSound.play()
            } else if (data.message === "stop_move") {
                this.stopMoveSound.play()
            } else if (data.message === "start_pos") {
                this.startPositionSound.play()
            } else if (data.message === "stop_pos") {
                this.stopPositionSound.play()
            }
        }
        this.ws.onclose = event => {
            console.log("Socket closed connection: ", event);
        }
    
        this.ws.onerror = error => {
            console.log("Socket error: ", error);
        }  
    }
}

class EmgSocket extends Socket {
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
            console.log("EMG Socket Successfully Connected!");
        }
        this.ws.onmessage = msg => {
            // dispatch action to update state whenever socket receives a message
            let obj = JSON.parse(msg.data)
            let data = JSON.parse(obj.body)
            store.dispatch(emg_message(data))
            console.log("Received EMG: ", data)
        }
        this.ws.onclose = event => {
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
let emgSocket = new EmgSocket("ws://localhost:8080/emg")

export { moveSocket, imuSocket, emgSocket }
