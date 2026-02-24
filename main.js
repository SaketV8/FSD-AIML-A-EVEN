import http from "http";

const PORT = 5050;

// In memory database for now :)
const users = [
  {
    id: 1,
    name: "Saket",
    email: "saket@myemail.com",
  },
  {
    id: 2,
    name: "Saket2",
    email: "saket2@myemail.com",
  },
];

// main server logic here -_-
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/users" && method === "GET") {
    res.statusCode = 200;
    // res.end("List of users");

    // printing data from the temp db(our array)
    // res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(users));
  } else if (url.startsWith("/users/") && method === "GET") {
    // we need index tow ==> BASE_URL/users/1
    const id = url.split("/")[2];

    const user = users.find((user) => user.id == id);

    // if not found
    if (!user) {
      res.statusCode = 404;
      console.log(`User with ID: ${id} not found`);
      res.end(`User with ID: ${id} not found`);
      return;
    }

    res.statusCode = 200;
    // res.end("Search Users");
    console.log(`User with ID: ${id} found`);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(user));
  } else if (url === "/createuser" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      // Currently the data is in string so we have to parse in json
      const data = JSON.parse(body);
      const newUser = {
        id: Date.now(),
        name: data.name,
        email: data.email,
      };

      // saving this data in our temp db(our array)
      users.push(newUser);

      res.statusCode = 201;
      console.log(`User with id: ${newUser.id} created sucessfully`);
      res.end(`User with id: ${newUser.id} created sucessfully`);
    });
  } else if (url.startsWith("/users/") && method === "PUT") {
    res.statusCode = 200;
    res.end("Edit User");
  } else if (url.startsWith("/users/") && method === "DELETE") {
    const id = url.split("/")[2];

    const userIndex = users.findIndex((user) => user.id == id);

    if (userIndex == -1) {
      res.statusCode = 400;
      console.log(`User id: ${id} not found`);
      res.end(`User id: ${id} not found`);
      return;
    }

    // deleting that data with userIndex in the users
    // splice move to give index then delete 1 element from there
    users.splice(userIndex, 1);

    res.statusCode = 200;
    // res.end("Delete User");
    console.log(`User id: ${id} deleted sucessfully`);
    res.end(`User id: ${id} deleted sucessfully`);
  } else {
    res.statusCode = 404;
    res.end("Error: API not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
