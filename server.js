const express = require("express");
const app = express();

// Middleware to parse JSON body
app.use(express.json());

// POST API
app.post("/mul", (req, res) => {

  console.log(req.body,'venkataratnam');
  
  const { num1, num2 } = req.body;

  // Validation

  const result = num1 * num2;

  res.json(
    {result}
  );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
