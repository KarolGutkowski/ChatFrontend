export class ChatMessage {
    public username: string;
    public content: string;

    constructor(_username: string, _content: string) {
        this.username = _username;
        this.content = _content;
    }
}