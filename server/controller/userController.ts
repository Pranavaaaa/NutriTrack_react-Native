import { Request, Response, NextFunction } from "express";

export const getUserCaloriesData = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query);
  
  console.log("req for calories data of user ");
  
  try {
    const userCalories = {
      breakfast: 300,
      lunch: 500,
      dinner: 400,
      snacks: 200,
      totalCalories: 1400,
      calorieBudget: 2000,
    };
    console.log("data sent");
    
    res.status(200).json({ success: true, data: userCalories });
  } catch (error) {
    console.error("Error fetching user calories data:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
