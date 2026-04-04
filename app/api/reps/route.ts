import { NextResponse } from "next/server";

interface APIMember {
  name: string;
  partyName?: string;
  bioguideId?: string;
  terms?: {
    item?: {
      endYear?: number;
      startYear?: number;
    }[];
  };
}

interface CongressAPIResponse {
  members?: APIMember[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = (searchParams.get("state") || "").trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(state)) {
    return NextResponse.json(
      { error: "A valid 2-letter state is required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.CONGRESS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Congress API key is missing on the server." },
      { status: 500 },
    );
  }

  const url = `https://api.congress.gov/v3/member/${state}?api_key=${apiKey}&format=json`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    const rawBody = await response.text();

    let payload: CongressAPIResponse | null = null;
    try {
      payload = JSON.parse(rawBody) as CongressAPIResponse;
    } catch {
      // Some Congress API failures come back as XML.
    }

    if (!response.ok) {
      if (rawBody.trim().startsWith("<")) {
        return NextResponse.json(
          {
            error:
              "Congress API returned XML instead of JSON. Verify the API key configured on the server.",
          },
          { status: 502 },
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch representatives from Congress API." },
        { status: response.status },
      );
    }

    if (!payload) {
      return NextResponse.json(
        {
          error:
            "Congress API returned a non-JSON response. Verify API key and response format.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "Unable to reach Congress API. Try again shortly." },
      { status: 502 },
    );
  }
}
