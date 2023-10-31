export class CustomWebSocket extends WebSocket {
  constructor(
    url: string | globalThis.URL,
    protocols?: string | string[] | undefined,
  ) {
    super(url, protocols);
  }

  send(data: string | ArrayBuffer | ArrayBufferView | Blob) {
    // Send message only when websocket connection is open to prevent app from crashing
    if (this.readyState === this.OPEN) {
      try {
        super.send(data);
      } catch (err) {
        console.error(
          "An error occurred when sending a message to a websocket: ",
          err,
        );
      }
    } else {
      console.warn("WebSocket message not sent as connection is not open");
    }
  }
}
