require("dotenv").config();
const connectDB = require("./config/db");

const User = require("./models/User");
const AgencyType = require("./models/AgencyType");
const Product = require("./models/Product");
const SystemRegulation = require("./models/SystemRegulation");

const bcrypt = require("bcryptjs");

const seed = async () => {
  await connectDB();

  // Clear master data
  await User.deleteMany();
  await AgencyType.deleteMany();
  await Product.deleteMany();
  await SystemRegulation.deleteMany();

  // Admin
  await User.create([
    {   
        fullName: "Admin",
        email: "admin@gmail.com",
        passwordHash: await bcrypt.hash("123456", 10),
        role: "admin"
    },
    {
        fullName: "Staff",
        email: "staff@gmail.com",
        passwordHash: await bcrypt.hash("123456", 10),
        role: "staff"
    }]);

  // Agency types
  await AgencyType.create([
    { name: "Type 1", maxDebt: 10000000 },
    { name: "Type 2", maxDebt: 5000000 }
  ]);

  // Products
  await Product.create([
    { name: "Coca", unit: "Bottle", unitPrice: 10000 },
    { name: "Pepsi", unit: "Bottle", unitPrice: 9000 }
  ]);

  // System regulation (singleton)
  await SystemRegulation.create({
    maxDistrict: 20,
    maxAgencyPerDistrict: 5
  });

  console.log("Seed master data success");
  process.exit();
};

seed();
