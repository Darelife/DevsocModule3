// // mongodb+srv://prakharb2k6:9tm3NQ87JesI1nMz@devsoc.nhq4icu.mongodb.net/?retryWrites=true&w=majority&appName=devsoc

// mongodb+srv://prakharb2k6:devsocbitsgoa@devsoc.giyetec.mongodb.net/
const http = require("http"); //to handle HTTP requests
const app = require("./app"); //imports the express application defined in app.js
const port = process.env.PORT || 3000; //either assign a port defined in the environment variables or if it isn't defined, assign 3000
const server = http.createServer(app); //requires a listener which sends a request to the server and recieves a response, here, the express app works as a listener
//start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
