import { WebSocketServer } from "ws";

const PORT = 3000;

const wsServer = new WebSocketServer({ port: PORT });

wsServer.on("connection", (socket) => {
  socket.on("message", (message) => {
    wsServer.clients.forEach((client) => {
      setTimeout(() => {
        client.send(
          JSON.stringify({
            source: "server",
            content: "response from server",
          })
        );
      }, 1000);
    });

    console.log(message.toString());
  });
});
