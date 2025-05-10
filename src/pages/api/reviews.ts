import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { eventId, eventName, answers, comment } = req.body;

    // Validate required fields
    if (!eventId || !eventName || !answers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create review in database
    const review = await prisma.review.create({
      data: {
        eventId,
        eventName,
        answers: {
          ...answers,
          comment: comment || null
        },
        isAnonymous: true,
        createdAt: new Date(),
      },
    });

    return res.status(200).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
} 