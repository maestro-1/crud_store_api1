const http =require("http");
const app= require('./app')

const port=process.env.PORT || 3000
server=http.createServer(app);

server.listen(port,()=> console.log(`app is running ${port}`))


// https://www.youtube.com/watch?v=Zbow21FKJS4
// https://www.youtube.com/watch?v=OOG65rSM5fA