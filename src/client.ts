import {Client, IFrame, Message} from '@stomp/stompjs'
import SockJS from "sockjs-client"
import { ChatMessage } from './ChatMessage';
import {MessageSentStatus} from './MessageSentStatus'
const wsServerEndpoint: string = 'http://localhost:8080/ws';

export default class WebSocketService {

    private client: Client;
    private messageCallback?: (message: ChatMessage) => void;

    constructor() {
        console.log("creating WebSocket connection");
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

    public connect(){
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

    public sendMessage(message: ChatMessage): MessageSentStatus {
        if(this.client.connected) {
            this.client.publish({
                destination: "/app/chat",
                body: JSON.stringify(message)
            })
            return MessageSentStatus.Success;
        } 

        return MessageSentStatus.Failure;
    }


    public setOnMessageCallback(callback: (message: ChatMessage) => void) {
        this.messageCallback = callback;
    }
}