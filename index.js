const server = require("./app/server/server");
const port = 3002;

server.listen(port, () => { console.log('We are live on ' + port); });