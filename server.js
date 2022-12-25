const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

function main() {
  var words;
  http
    .createServer((req, res) => {
      if (req.method.toLowerCase() === "get") {
        res.writeHead(200, { "Content-Type": "application/json" });
        let query = url.parse(req.url, true).query;
        let count = parseInt(query.count),
          size = parseInt(query.size);
        let data = words
          .filter((word) => word.length === size)
          .sort(() => 0.5 - Math.random());
        let index = Math.floor(Math.random() * data.length);
        index = index + count > data.length ? index - count : index;
        res.end(
          JSON.stringify(
            data.slice(index, index + count).map((w) => w.toUpperCase())
          )
        );
      }
    })
    .listen(5000, () => {
      words = JSON.parse(
        fs.readFileSync(path.join(__dirname, "randomWords.json"), "utf-8")
      );
      console.info("Server started at port 5000...");
    });
}

main();
