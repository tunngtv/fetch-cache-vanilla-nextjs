// File: app/api/random-number/route.ts

export async function GET() {
  const randomNumber = Math.random()

  return Response.json({ number: randomNumber })
}
