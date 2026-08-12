import { NextResponse } from "next/server";
import { driver } from "@/lib/cognodb";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (developer:Developer)
      RETURN
        developer.id AS id,
        developer.name AS name,
        developer.experience AS experience,
        developer.location AS location
      ORDER BY developer.name
    `);

    const developers = result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      experience: record.get("experience"),
      location: record.get("location"),
    }));

    return NextResponse.json({
      success: true,
      developers,
    });
  } catch (error) {
    console.error("Developers API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load developers.",
      },
      {
        status: 503,
      }
    );
  } finally {
    await session.close();
  }
}