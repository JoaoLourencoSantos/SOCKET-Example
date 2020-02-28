const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app); // define o protocolo http
const io = require("socket.io")(server); // wss, para o websocket

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let messages = [];

io.on("connection", socket => {
  console.log(`Usuário conectado ${socket.id}`);

  socket.emit("listMessages", messages);

  socket.on("sendMessage", data => {
    messages.push(data);
    socket.broadcast.emit("receivedMessage", data);

    //socket.emi -- enviar somente pra este socket
    //socket.broadcast.emi -- propagar a mensagem pra todos conectados
    //socket.on -- ouvir uma mensagem
  });
});

server.listen(3000);
