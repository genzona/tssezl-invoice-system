import fs from "fs";

const users = [
  { uid: "CFO123", password: "yourpassword", role: "CFO" },
  { uid: "MD456", password: "yourpassword", role: "MD" },
  { uid: "ACC789", password: "yourpassword", role: "Accounts" }
];

fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));
console.log("✅ Users seeded successfully");
