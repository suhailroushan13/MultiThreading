import express from "express";
import os from "os";
import cluster from "node:cluster";

const app = express();
const port = 9000;

const numCpu = os.cpus().length;
// console.log(numCpu);

app.use(express.json());
app.get("/", (req, res) => {
  console.log(req.body.data, ` Is Coming from ${process.pid}`);
  res.send("<h1> I am Suhail From Static IP </h1>");
  cluster.worker.kill();
});

if (cluster.isPrimary) {
  for (let i = 0; i < numCpu; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.listen(port, () => {
    console.log(`Server Running At ${port} and Process ID ${process.pid}`);
  });
}
