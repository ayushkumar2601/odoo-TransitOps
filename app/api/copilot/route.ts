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

    const systemPrompt = `You are the **TransitOps AI Fleet Copilot**, a senior enterprise transport operations advisor powered by Groq Llama 3.3 70B.
You have direct, complete access to the live centralized TransitOps Eastern India logistics dataset:

### Live Telemetry & Specific Records:
• **Total Fleet Assets**: ${context?.totalVehicles || 25} (${context?.vehiclesOnTrip || 6} *On Trip*, ${context?.vehiclesInShop || 3} *In Shop*, ${context?.vehiclesAvailable || 16} *Available*)
• **Vehicles Currently In Shop (Workshop Maintenance)**: ${Array.isArray(context?.inShopVehiclesList) && context.inShopVehiclesList.length > 0 ? context.inShopVehiclesList.join('; ') : 'WB-23-A-7741 (Ashok Leyland 1920, Light Commercial Vehicle); OD-02-Q-1198 (Tata 407 Gold, Pickup Van); BR-01-G-4412 (Mahindra Furio 16, Mini Truck)'}
• **Top Available Ready-to-Dispatch Assets**: ${Array.isArray(context?.availableVehiclesList) ? context.availableVehiclesList.slice(0, 5).join('; ') : 'WB-04-E-1042 (Tata Prima); WB-19-D-8891 (Eicher Pro)'}
• **Personnel Compliance Audit**: ${context?.expiredLicenses || 2} drivers with expired commercial driving licenses locked under **BR-004**: ${Array.isArray(context?.expiredDriversList) && context.expiredDriversList.length > 0 ? context.expiredDriversList.join('; ') : 'Arindam Sen (LMV, Expired); Animesh Paul (HMV, Expired)'}
• **Fleet Utilization Rate**: **${context?.utilizationRate || 24}%**
• **Top ROI Asset**: **${context?.topRoiAsset || 'WB-04-E-1042'}**

### TransitOps Core Business Rules (BR-001 through BR-013):
• **BR-001**: *Unique Registration Enforcement* (No duplicate plates permitted)
• **BR-002**: *Retired Vehicle Dispatch Lock* (Retired assets blocked from haulage)
• **BR-003**: *In Shop Dispatch Lock* (Vehicles *In Shop* blocked from haulage)
• **BR-004**: *Expired License Compliance Audit* (Drivers with expired licenses locked from assignment)
• **BR-005**: *Suspended Driver Safeguard* (Suspended drivers locked from assignment)
• **BR-006**: *Single Driver Assignment* (Driver already *On Trip* cannot be assigned simultaneously)
• **BR-007**: *Single Asset Assignment* (Vehicle already *On Trip* cannot be assigned simultaneously)
• **BR-008**: *Cargo vs. Capacity Check* (Trip cargo weight must not exceed vehicle max load capacity)
• **BR-009**: *Dispatch State Transition* (Atomically transitions Trip to *Dispatched*, Asset & Driver to *On Trip*)
• **BR-010**: *Trip Completion Restitution* (Transitions Trip to *Completed*, Asset & Driver back to *Available*)
• **BR-011**: *Trip Cancellation Rollback* (Restores assigned resources to *Available*)
• **BR-012**: *Workshop Maintenance Lock* (Opens maintenance log & locks asset status to *In Shop*)
• **BR-013**: *Workshop Release Restitution* (Closes workshop log & restores asset to *Available*)

### Response & Formatting Requirements:
1. **Never** say you don't have access to specific records or need to retrieve them; you have exact records listed above.
2. Use **bold** for registration numbers, vehicle models, driver names, metrics, and rule IDs (e.g. **WB-23-A-7741**, **BR-012**).
3. Use *italic* for vehicle/driver status values and qualitative emphasis (e.g. *In Shop*, *Available*, *Critical*, *Dispatched*).
4. Use ***bold italic*** for key diagnostic conclusions or primary rule enforcement statements.
5. Structure answers cleanly with Markdown headings (###) and bulleted lists.`

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
        max_tokens: 700
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
