# PitchHook

PitchHook is an AI tool for B2B outreach pitch generation. It analyzes a target company's text and crafts a bespoke, compelling, high-converting outreach pitch based on your offering and outreach angle.

## Local Execution Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and set your Gemini API key:
   ```bash
   GEMINI_API_KEY="your_api_key_here"
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Data Shapes

The app exposes a POST endpoint at `/api/generate`.

### Request JSON Shape
- `companyText` (string, required): Target company text.
- `offering` (string, required): Your offering description.
- `angle` (string): Selected outreach angle.
- `customAngleText` (string, optional): Specifics for a custom angle.

### Response JSON Shape
- `angle_title` (string): Value hook summarizing the angle.
- `evidence_snippet` (string): Quote or factual detail from company text.
- `rationale` (string): Why the offering and goal create mutual value.
- `subject_line` (string): Curiosity-inducing cold email subject line.
- `email_body` (string): A 3-paragraph pitch email draft.
- `call_to_action` (string): Low-friction next step CTA.
