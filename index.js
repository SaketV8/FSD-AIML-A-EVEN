import http from "http";
import os, { platform } from "os";

const PORT = 8089;

const toGB = (byte) => {
  return (byte / 1024 / 1024 / 1024).toFixed(2);
};

let data = []
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    res.end("Home Page");
  } else if (url == "/contact" && method == "GET") {
    res.write("Contact Info");
  } else if (url == "/system" && method == "GET") {
    const systemInfo = {
      platform: os.platform(),
      Architecture: os.arch(),
      CPU_Length: os.cpus().length,
      TotalMemory: `${toGB(os.totalmem())} GB`,
      FreeMemory: `${toGB(os.freemem())} GB`,
    };
    res.end(JSON.stringify(systemInfo));
  } else if (url == "/senddata" && method == "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      console.log("Received body:", body);

      try {
        const parsedData = JSON.parse(body);
        console.log("Parsed JSON:", parsedData);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(parsedData))
      } catch (err) {
        console.log("Not JSON data");

        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid JSON");
      }
    });
  } else if (url == "/viewdata" && method == "GET") {
    res.end(JSON.stringify(data))
    res.write("Data View Sucessfully");
  } else {
    res.end("Error Page");
  }
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
