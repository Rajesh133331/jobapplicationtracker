const express = require("express");
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// POST API
app.post("/mul", (req, res) => {
  const { num1, num2 } = req.body;

  // Validation
  if (typeof num1 !== "number" || typeof num2 !== "number") {
    return res.status(400).json({
      error: "num1 and num2 must be numbers"
    });
  }

  const result = num1 * num2;

  res.send(
    result
  );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
