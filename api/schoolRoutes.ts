import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import haversine from "haversine-distance";

const router = express.Router();
const prisma = new PrismaClient();


router.post("/addSchool", async (req: any, res: any) => {
  const { name, address, latitude, longitude } = req.body;

 
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const isalready=await prisma.school.findFirst({
    where: {
        name: req.body.name
    }
  })
  if(isalready){
    return res.json({msg: "School already exist"})
  }

  try {
    const newSchool = await prisma.school.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });

    res.status(201).json({
      message: "School added successfully.",
      school: newSchool,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add school." });
  }
});


router.get("/listSchools", async (req: any, res: any) => {
  const { latitude, longitude } = req.query;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "User's latitude and longitude are required." });
  }

  try {
    const userLocation = {
      latitude: parseFloat(latitude as string),
      longitude: parseFloat(longitude as string),
    };

    const schools = await prisma.school.findMany();

    
    const sortedSchools = schools
      .map((school) => ({
        ...school,
        distance: haversine(userLocation, { latitude: school.latitude, longitude: school.longitude }),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedSchools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch schools." });
  }
});

export default router;
