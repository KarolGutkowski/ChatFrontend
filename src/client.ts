import {Client, IFrame, Message} from '@stomp/stompjs'
import SockJS from "sockjs-client"
import { ChatMessage } from './ChatMessage';

const wsServerEndpoint: string = 'http://localhost:8080/gs-guide-websocket';

export default class WebSocketService {

    private client: Client;
    private messageCallback?: (message: ChatMessage) => void;

    constructor() {
        console.log("TEST");
        this.client = new Client({
            webSocketFactory: () => new SockJS(wsServerEndpoint),
            reconnectDelay: 5000,
        })

        this.client.onConnect = this.onConnect;
        this.client.onDisconnect = this.onDisconnect;
        this.client.onStompError = this.onError;
    }

    private onConnect = () => {
        console.log('Connected to WebSocket');
        this.client.subscribe('/topic/chat', this.onMessageReceived);
    };

    private onDisconnect = () => {
        console.log('Disconnected from WebSocket');
    };

    private onError = (frame: IFrame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };

    public connect() {
        this.client.activate();
    }

    public disconnect() {
        this.client.deactivate();
    }

    private onMessageReceived = (message: Message) => {
        console.log('Message received:', message.body);

        const chatMessage: ChatMessage = JSON.parse(message.body);
        if(this.messageCallback)
            this.messageCallback(chatMessage);
    };

    public sendMessage(message: ChatMessage) {
        this.client.publish({
            destination: "/app/chat",
            body: JSON.stringify(message)
        })
    }


    public setOnMessageCallback(callback: (message: ChatMessage) => void) {
        this.messageCallback = callback;
    }
}