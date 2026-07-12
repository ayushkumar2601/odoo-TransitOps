import { NextResponse } from 'next/server'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function POST(req: Request) {
  try {
    const { prompt, context } = await req.json()
    const apiKey = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Groq API Key not configured in environment.' },
        { status: 500 }
      )
    }

    const systemPrompt = `You are the TransitOps AI Fleet Copilot, a senior enterprise fleet operations advisor powered by Groq Llama 3.3 70B.
You have live access to the centralized TransitOps Eastern India logistics dataset:
- Total Fleet Assets: ${context?.totalVehicles || 25} (${context?.vehiclesOnTrip || 6} On Trip, ${context?.vehiclesInShop || 3} In Shop, ${context?.vehiclesAvailable || 16} Available)
- Total Drivers: ${context?.totalDrivers || 35} (${context?.expiredLicenses || 2} Expired Licenses under BR-004 Lock)
- Fleet Utilization Rate: ${context?.utilizationRate || 24}%
- Top ROI Asset: ${context?.topRoiAsset || 'WB-04-E-1042'}
- Bottom ROI Asset: ${context?.bottomRoiAsset || 'OD-02-Q-1198'}

Provide clear, professional, structured markdown answers to the user's fleet operations questions. Mention relevant Business Rules (BR-001 through BR-013) when applicable.`

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 650
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Groq API Error:', errText)
      return NextResponse.json(
        { error: `Groq API returned ${res.status}`, details: errText },
        { status: res.status }
      )
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || 'No response generated.'

    return NextResponse.json({
      success: true,
      model: 'groq-llama-3.3-70b-versatile',
      reply
    })
  } catch (error: any) {
    console.error('Failed to invoke Groq Copilot:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
