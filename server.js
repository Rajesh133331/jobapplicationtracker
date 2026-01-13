// server.js (full merged code)
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");

app.use(express.urlencoded());
app.use(express.json());
const {
  db,
  user,
  onboard1,
  onboard2,
  education,
  help,
  application,
  company,
  savedjob,
} = require("./backend/models");

//--middleware to check the jwt token
function authenticateToken(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "paruchurirajesh", (err, user) => {
    console.log(user);
    if (err) return res.sendStatus(403);
    req.user = user;
    console.log(req.user);
    next();
  });
}

app.post("/signup", async (req, res) => {
  try {
    const { name, mobilenumber, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const exist = await user.findOne({ where: { Email: email } });
    if (exist) {
      return res.json({ data: "exist" });
    }
    await user.create({
      Name: name,
      Email: email,
      Password: hash,
      Mobilenumber: mobilenumber,
    });
    console.log(await user.findAll());
    return res.json({ data: "success" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ data: "failed" });
  }
});

//login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userexist = await user.findOne({ where: { Email: email } });
    if (!userexist) {
      return res.json({ data: "notexist" });
    }
    const decrypt = await bcrypt.compare(password, userexist.Password);
    if (decrypt) {
      const token = jwt.sign(
        { email: userexist.Email },
        "paruchurirajesh",
        { expiresIn: "3h" }
      );
      res.status(200).json({
        data: "success",
        token,
        Name: userexist.Name,
        Onboarded: userexist.Onboard,
      });
    } else {
      return res.json({ data: "wrongpassword" });
    }
  } catch (err) {
    console.log(err, err.message);
    return res.json({ data: "error" });
  }
});

//on onboardof user
app.post("/onboard", authenticateToken, async (req, res) => {
  try {
    const { onboardvalue } = req.body;
    const userdata = await onboard1.findOne({
      where: { Email: req.user.email },
    });
    if (userdata) {
      await onboard1.destroy({ where: { Email: req.user.email } });
    }
    await onboard1.create({
      Email: req.user.email,
      Preferance: onboardvalue,
    });
    return res.json({ data: "success" });
  } catch (err) {
    console.log("error is", err.message);
    res.json({ data: "fail" });
  }
});
//onboard time
app.post("/onboard-time", authenticateToken, async (req, res) => {
  try {
    const { onboardvalue } = req.body;
    const userdata = await onboard2.findOne({
      where: { Email: req.user.email },
    });
    if (userdata) {
      await onboard2.destroy({ where: { Email: req.user.email } });
    }
    await onboard2.create({
      Email: req.user.email,
      Preferance: onboardvalue,
    });
    return res.json({ data: "success" });
  } catch (err) {
    console.log("error message", err.message);
    res.json({ data: "fail" });
  }
});

//entering education details
app.post("/education", authenticateToken, async (req, res) => {
  try {
    const { onboardvalue } = req.body;
    const userdata = await education.findOne({
      where: { Email: req.user.email },
    });
    if (userdata) {
      await education.destroy({ where: { Email: req.user.email } });
    }
    await education.create({
      Email: req.user.email,
      Education: onboardvalue,
    });
    await user.update({ Onboard: true }, { where: { Email: req.user.email } });
    return res.json({ data: "success" });
  } catch (err) {
    console.log("error message", err.message);
    res.json({ data: "fail" });
  }
});

//updating userdetails

app.post("/userdetailsupdate", authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;
    await user.update({ Name: username }, { where: { Email: req.user.email } });
    res.json({ data: "success" });
  } catch (err) {
    console.log("error is", err.message);
    res.json({ data: "fail" });
  }
});

app.post("/updatepassword", authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await user.update({ Password: hash }, { where: { Email: req.user.email } });
    res.json({ data: "success" });
  } catch (err) {
    console.log("error is", err.message);
    res.json({ data: "fail" });
  }
});

//deldeteing accpunt

app.post("/deleteaccount", authenticateToken, async (req, res) => {
  try {
    await user.destroy({ where: { Email: req.user.email } });
    res.json({ data: "success" });
  } catch (err) {
    res.json({ data: "fail" });
  }
});

//help route
app.post("/help", authenticateToken, async (req, res) => {
  const { complaint } = req.body;
  try {
    await help.create({
      Email: req.user.email,
      Complaintdetails: complaint,
    });
    const complaintlist = await help.findAll({
      where: { Email: req.user.email },
    });
    return res.json(complaintlist);
  } catch (err) {
    console.log("error is", err.message);
  }
});
//help route list of complaints

app.get("/help", authenticateToken, async (req, res) => {
  const complaints = await help.findAll({ where: { Email: req.user.email } });
  res.json(complaints);
});

//filling the application
app.post("/applicationfill", authenticateToken, async (req, res) => {
  try {
    const {
      Companyname,
      Jobtitle,
      Date,
      Status,
      Location,
      Joburl,
      Driveurl,
      Note,
    } = req.body;
    application.create({
      CompanyName: Companyname,
      JobTitle: Jobtitle,
      ApplicationDate: Date,
      ApplicationStatus: Status,
      JobLocation: Location,
      JobUrl: Joburl,
      ResumeUrl: Driveurl,
      Notes: Note,
      Email: req.user.email,
    });

    res.json({ data: "success" });
  } catch (err) {
    console.log(err.message);
    res.json({ data: "fail" });
  }
});

//get all applications
app.get("/applications", authenticateToken, async (req, res) => {
  try {
    const apps = await application.findAll({
      where: { Email: req.user.email },
    });
    res.json(apps);
  } catch (err) {
    res.json({ data: "fail" });
  }
});

//update application
app.put("/applications/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      CompanyName,
      JobTitle,
      ApplicationDate,
      ApplicationStatus,
      JobLocation,
      JobUrl,
      ResumeUrl,
      Notes,
    } = req.body;
    const appToUpdate = await application.findOne({
      where: { id: id, Email: req.user.email },
    });
    if (!appToUpdate) {
      return res.json({ data: "notfound" });
    }
    await application.update(
      {
        CompanyName,
        JobTitle,
        ApplicationDate,
        ApplicationStatus,
        JobLocation,
        JobUrl,
        ResumeUrl,
        Notes,
      },
      { where: { id: id } }
    );
    res.json({ data: "success" });
  } catch (err) {
    console.log(err.message);
    res.json({ data: "fail" });
  }
});

//delete application
app.delete("/applications/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const appToDelete = await application.findOne({
      where: { id: id, Email: req.user.email },
    });
    if (!appToDelete) {
      return res.json({ data: "notfound" });
    }
    await application.destroy({ where: { id: id } });
    res.json({ data: "success" });
  } catch (err) {
    res.json({ data: "fail" });
  }
});

//search and filter applications
app.get("/applications/search", authenticateToken, async (req, res) => {
  try {
    const { keyword, status, startDate, endDate } = req.query;
    let whereClause = { Email: req.user.email };
    if (keyword) {
      whereClause = {
        ...whereClause,
        [Sequelize.Op.or]: [
          { CompanyName: { [Sequelize.Op.like]: `%${keyword}%` } },
          { JobTitle: { [Sequelize.Op.like]: `%${keyword}%` } },
        ],
      };
    }
    if (status) {
      whereClause.ApplicationStatus = status;
    }
    if (startDate || endDate) {
      whereClause.ApplicationDate = {};
      if (startDate) whereClause.ApplicationDate[Sequelize.Op.gte] = startDate;
      if (endDate) whereClause.ApplicationDate[Sequelize.Op.lte] = endDate;
    }
    const apps = await application.findAll({ where: whereClause });
    res.json(apps);
  } catch (err) {
    res.json({ data: "fail" });
  }
});

//get stats
app.get("/applications/stats", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(400).json({ error: "User email not found in token" });
    }

    const total = await application.count({
      where: { Email: req.user.email },
    });

    const byStatusRaw = await application.findAll({
      attributes: [
        "ApplicationStatus",
        [Sequelize.fn("COUNT", Sequelize.col("ApplicationStatus")), "count"],
      ],
      where: { Email: req.user.email },
      group: ["ApplicationStatus"],
      raw: true,
    });

    const byStatus = byStatusRaw.map((row) => ({
      ApplicationStatus: row.ApplicationStatus,
      count: row.count,
    }));

    res.json({ total, byStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

//company routes
app.post("/companies", authenticateToken, async (req, res) => {
  try {
    const { CompanyName, ContactDetails, CompanySize, Industry, Notes } =
      req.body;
    company.create({
      CompanyName,
      ContactDetails,
      CompanySize,
      Industry,
      Notes,
      Email: req.user.email,
    });
    res.json({ data: "success" });
  } catch (err) {
    res.json({ data: "fail" });
  }
});

app.get("/companies", authenticateToken, async (req, res) => {
  try {
    const comps = await company.findAll({ where: { Email: req.user.email } });
    res.json(comps);
  } catch (err) {
    res.json({ data: "fail" });
  }
});

app.put("/companies/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { CompanyName, ContactDetails, CompanySize, Industry, Notes } =
      req.body;
    const compToUpdate = await company.findOne({
      where: { id: id, Email: req.user.email },
    });
    if (!compToUpdate) {
      return res.json({ data: "notfound" });
    }
    await company.update(
      {
        CompanyName,
        ContactDetails,
        CompanySize,
        Industry,
        Notes,
      },
      { where: { id: id } }
    );
    res.json({ data: "success" });
  } catch (err) {
    res.json({ data: "fail" });
  }
});

app.delete("/companies/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const compToDelete = await company.findOne({
      where: { id: id, Email: req.user.email },
    });
    if (!compToDelete) {
      return res.json({ data: "notfound" });
    }
    await company.destroy({ where: { id: id } });
    res.json({ data: "success" });
  } catch (err) {
    res.json({ data: "fail" });
  }
});

//saved jobs routes
app.post("/savedjobs", authenticateToken, async (req, res) => {
  try {
    const { JobTitle, CompanyName, JobUrl, Notes } = req.body;
    savedjob.create({
      JobTitle,
      CompanyName,
      JobUrl,
      Notes,
      Email: req.user.email,
    });
    res.json({ data: "success" });
  } catch (err) {
    res.json({ data: "fail" });
  }
});

app.get("/savedjobs", authenticateToken, async (req, res) => {
  try {
    const jobs = await savedjob.findAll({ where: { Email: req.user.email } });
    res.json(jobs);
  } catch (err) {
    res.json({ data: "fail" });
  }
});

app.put("/savedjobs/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { JobTitle, CompanyName, JobUrl, Notes } = req.body;
    const jobToUpdate = await savedjob.findOne({
      where: { id: id, Email: req.user.email },
    });
    if (!jobToUpdate) {
      return res.json({ data: "notfound" });
    }
    await savedjob.update(
      {
        JobTitle,
        CompanyName,
        JobUrl,
        Notes,
      },
      { where: { id: id } }
    );
    res.json({ data: "success" });
  } catch (err) {
    res.json({ data: "fail" });
  }
});

app.delete("/savedjobs/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const jobToDelete = await savedjob.findOne({
      where: { id: id, Email: req.user.email },
    });
    if (!jobToDelete) {
      return res.json({ data: "notfound" });
    }
    await savedjob.destroy({ where: { id: id } });
    res.json({ data: "success" });
  } catch (err) {
    res.json({ data: "fail" });
  }
});

app.get("/savedjobs/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const content = await savedjob.findOne({
      where: { id: id },
      attributes: ["JobTitle", "CompanyName", "JobUrl", "Notes"],
    });
    res.json({ data: content });
  } catch (err) {
    console.log("error is", err.message);
    res.json({ data: "fail" });
  }
});

//analysis
app.get("/analytics", authenticateToken, async (req, res) => {
  try {
    // Totals
    const totalUsers = await user.count();
    const onboarded = await user.count({ where: { Onboard: true } });

    // Helpers
    const toKV = (rows, keyField) =>
      rows.reduce((acc, r) => {
        const plain = r.get({ plain: true });
        acc[plain[keyField] || "Unknown"] = Number(plain.count || 0);
        return acc;
      }, {});

    // Reasons from Onboards1data.Preferance
    const reasons = await onboard1.findAll({
      attributes: [
        "Preferance",
        [Sequelize.fn("COUNT", Sequelize.col("Preferance")), "count"],
      ],
      group: ["Preferance"],
    });

    // Target date prefs from Onboards2data.Preferance
    const startPrefs = await onboard2.findAll({
      attributes: [
        "Preferance",
        [Sequelize.fn("COUNT", Sequelize.col("Preferance")), "count"],
      ],
      group: ["Preferance"],
    });

    // Education breakdown
    const edu = await education.findAll({
      attributes: [
        "Education",
        [Sequelize.fn("COUNT", Sequelize.col("Education")), "count"],
      ],
      group: ["Education"],
    });

    res.json({
      totals: { users: totalUsers, onboarded },
      reasons: toKV(reasons, "Preferance"),
      start: toKV(startPrefs, "Preferance"),
      education: toKV(edu, "Education"),
    });
  } catch (err) {
    console.error("analytics error:", err);
    res.status(500).json({ error: "analytics_failed" });
  }
});

app.post("/transfermoney", async (req, res) => {
  const t = await db.transaction();
});

app.listen(8080, (err) => {
  if (err) {
    console.log("error is", err.message);
  } else {
    console.log("server is running......");
  }
});
