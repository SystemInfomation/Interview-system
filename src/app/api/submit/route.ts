import { NextRequest, NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitize";
import { validateName, validateGrade } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, grade } = body;

    // Validate inputs
    const nameError = validateName(name ?? "");
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    const gradeError = validateGrade(grade ?? "");
    if (gradeError) {
      return NextResponse.json({ error: gradeError }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedGrade = sanitizeInput(grade);

    const supabase = getSupabase();

    // Check for duplicate by name (case-insensitive)
    const { data: existing } = await supabase
      .from("interview_signups")
      .select("id")
      .ilike("name", sanitizedName)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "A signup with this name already exists." },
        { status: 409 }
      );
    }

    // Insert into Supabase
    const { error: insertError } = await supabase
      .from("interview_signups")
      .insert({
        name: sanitizedName,
        grade: sanitizedGrade,
      });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save your signup. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
