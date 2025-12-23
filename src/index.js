require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const agencyRoutes = require("./routes/agency.routes");
const exportReceiptRoutes = require("./routes/exportReceipt.routes");
const paymentReceiptRoutes = require("./routes/paymentReceipt.routes");
const reportRoutes = require("./routes/report.routes");
const productRoutes = require("./routes/product.routes");
const agencyTypeRoutes = require("./routes/agencyType.routes");
const systemRegulationRoutes = require("./routes/systemRegulation.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/agencies", agencyRoutes);
app.use("/api/export-receipts", exportReceiptRoutes);
app.use("/api/payment-receipts", paymentReceiptRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/products", productRoutes);
app.use("/api/agency-types", agencyTypeRoutes);
app.use("/api/system-regulation", systemRegulationRoutes);


app.get("/", (req, res) => {
  res.send("Agency System API running");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
