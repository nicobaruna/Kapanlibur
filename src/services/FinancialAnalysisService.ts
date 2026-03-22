import Anthropic from '@anthropic-ai/sdk';

export type LeaveType = 'paid' | 'unpaid';
export type UserGoal = 'hemat' | 'balance' | 'healing' | 'luxury';

export interface FinancialInput {
  monthly_salary: number;
  leave_days_taken: number;
  leave_type: LeaveType;
  trip_days: number;
  total_trip_cost: number;
  user_goal: UserGoal;
}

export interface FinancialSimulation extends FinancialInput {
  daily_salary: number;
  salary_loss: number;
  total_financial_impact: number;
  cost_vs_salary_percentage: number;
}

export interface FinancialAnalysisResult {
  status: 'aman' | 'perlu_pertimbangan' | 'berat';
  insight: {
    summary: string;
    key_reason: string;
  };
  recommendation: {
    decision: string;
    advice: string;
  };
  optimization: string[];
  comparison: {
    salary_vs_cost: string;
    main_cost_driver: string;
  };
  share_text: string;
}

const SYSTEM_PROMPT = `You are an assistant inside a financial planning app.

Your role:
Provide clear financial insights based on pre-calculated simulation data.

IMPORTANT:
- DO NOT recalculate numbers
- Use numbers exactly as provided
- Focus on analysis, recommendation, and user-friendly explanation

Input (JSON):
{
  "monthly_salary": number,
  "daily_salary": number,
  "leave_days_taken": number,
  "leave_type": "paid | unpaid",
  "salary_loss": number,
  "trip_days": number,
  "total_trip_cost": number,
  "total_financial_impact": number,
  "cost_vs_salary_percentage": number,
  "user_goal": "hemat | balance | healing | luxury"
}

Your task:
1. Analyze affordability
2. Provide recommendation
3. Give actionable optimization tips
4. Generate short shareable text

Affordability rules:
- <30 → "aman"
- 30–60 → "perlu pertimbangan"
- >60 → "berat"

Output format (STRICT JSON ONLY):
{
  "status": "aman | perlu_pertimbangan | berat",
  "insight": {
    "summary": string,
    "key_reason": string
  },
  "recommendation": {
    "decision": string,
    "advice": string
  },
  "optimization": [
    string,
    string
  ],
  "comparison": {
    "salary_vs_cost": string,
    "main_cost_driver": string
  },
  "share_text": string
}

Rules:
- Bahasa Indonesia
- Max 2 sentences per field
- No emojis
- No markdown
- No extra text outside JSON

Guidance:
- Adjust tone based on user_goal:
  - hemat → lebih konservatif
  - balance → netral
  - healing → lebih fleksibel
  - luxury → longgar

- "share_text" must be short, catchy, and under 15 words`;

export function buildSimulation(input: FinancialInput): FinancialSimulation {
  const daily_salary = Math.round(input.monthly_salary / 22);
  const salary_loss =
    input.leave_type === 'unpaid'
      ? daily_salary * input.leave_days_taken
      : 0;
  const total_financial_impact = salary_loss + input.total_trip_cost;
  const cost_vs_salary_percentage = Math.round(
    (total_financial_impact / input.monthly_salary) * 100,
  );

  return {
    ...input,
    daily_salary,
    salary_loss,
    total_financial_impact,
    cost_vs_salary_percentage,
  };
}

export async function analyzeFinancial(
  apiKey: string,
  input: FinancialInput,
): Promise<FinancialAnalysisResult> {
  const simulation = buildSimulation(input);

  const client = new Anthropic({apiKey});

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: JSON.stringify(simulation),
      },
    ],
  });

  const textBlock = response.content.find(b => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from Claude');
  }

  const result: FinancialAnalysisResult = JSON.parse(textBlock.text);
  return result;
}
