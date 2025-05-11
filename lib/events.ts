import { db } from "@/lib/db"

import { getAccessToken } from "@/lib/auth"
async function fetchEventDetails(id: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${process.env.API_BASE_URL}/v2/campus/39/events`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event details");
  }

  const event = await response.json();
  return event;
}
