# Week 9 Deliverables: Document & Demo Your Agent

## What You Submit

### 1. README (GitHub-style documentation)
A markdown file that lives in your agent's repo explaining everything a stranger needs to use it.

### 2. Demo Video (3-5 minutes)
A recorded screen capture showing your agent working end-to-end, with you narrating what's happening.

---

## Deliverable 1: README

### Required Sections (Delete if not applicable)

#### 1. Title & Description
```
# [Agent Name]

What it does: [One sentence + brief paragraph for whom and why]
```

#### 2. Features
- List what the agent actually does (3-5 bullet points)

#### 3. Setup Instructions
- Prerequisites (Python 3.10+, Node.js, API keys needed, etc.)
- Installation steps a stranger could follow:
  ```bash
  git clone [repo]
  cd [folder]
  pip install -r requirements.txt
  export GROQ_API_KEY=your_key_here
  python agent.py
  ```

#### 4. Usage Examples
- Show 2-3 real examples of what users input and what the agent outputs
- Include actual terminal output or chat examples

#### 5. Architecture (Simple Diagram or Text)
```
User Input 
  ↓
Agent Logic (Decision trees, function calls, etc.)
  ↓
Groq LLM (Inference)
  ↓
External APIs (if any: Supabase, web search, etc.)
  ↓
Output to User
```

#### 6. Evaluation Results
- How you tested it (what scenarios, how many test cases)
- Results: accuracy %, success rate, benchmark numbers
- Be honest about performance

#### 7. Known Limitations
- What it can't do (e.g., "Cannot access real-time data," "No image processing")
- Edge cases it fails on
- Things you'd fix in v2

#### 8. Future Work (v2)
- What you plan to add

#### 9. License & Repo Link
- MIT, Apache 2.0, or whatever you choose

---

## Deliverable 2: Demo Video

### What to Show (3-5 min)

**Structure:**
1. **Intro (15 sec):** "This is [Agent Name]. It does X. Here's why it matters." (You on camera or voiceover)
2. **Live Run (2-3 min):** Open the agent, give it real input, show it working
3. **Explain One Feature (30 sec):** Point to code or output, explain a key design decision
4. **Show One Limitation (30 sec):** "It struggles with X because Y. That's a trade-off I made for Z."
5. **Outro (15 sec):** "That's the agent. Check the README for setup."

### Recording Requirements
- ✅ Screen recording (not slides)
- ✅ Clear audio narration (not background music)
- ✅ Show the real agent running (terminal, chat interface, or API response)
- ✅ 3-5 minutes total
- ✅ Unlisted YouTube link (not private)

### Recording Tools (Pick One)
- **OBS Studio** (free, open-source, no watermark)
- **Loom** (free tier, easy, includes webcam corner)
- **ScreenFlow** (Mac, built-in)
- **Windows 10 Game Bar** (Win+G, free built-in)

### Demo Script Example
```
"Hi, I'm showing you [Agent Name]. 

It's designed to [purpose]. Here's how it works:

[Show opening the agent/CLI]

I'll give it this input: '[user input]'

[Agent processes and outputs result]

See that? It just [explain what happened].

One key design decision: I used Groq instead of GPT-4 because 
[reason: speed, cost, accuracy on this task].

One limitation though: it can't handle [use case] because 
[explain the constraint]. That's okay for v1—I'd fix that in v2 by [solution].

That's the demo. Check the repo for setup instructions."
```

---

## Submission Checklist

### Before You Submit
- [ ] README is in your agent's GitHub repo
- [ ] README includes all 7 required sections
- [ ] Setup instructions actually work (test them)
- [ ] Eval results show honest numbers
- [ ] Limitations are explicit, not hidden
- [ ] Demo video recorded (3-5 min)
- [ ] Demo shows real agent running, not slides
- [ ] You explain one design decision on camera
- [ ] You explain one limitation on camera
- [ ] Video uploaded to YouTube (unlisted, not private)
- [ ] Audio is clear and audible

### What You Post to Portal
1. **GitHub Repo Link** (where README lives)
2. **YouTube Demo Link** (unlisted)

---

## Common Mistakes to Avoid

❌ "My agent is perfect, no limitations" → Be honest; every agent has trade-offs  
❌ README says "python agent.py" but requires setup → Test the steps yourself first  
❌ Demo is all slides and code snippets → Show it actually running with real input  
❌ Demo is 10 minutes → Keep it tight to 3-5 min (they want clear, not comprehensive)  
❌ No narration → Silence is boring; explain what's happening as you show it  
❌ Video is private on YouTube → Make it unlisted so they can view it  

---

## README Template to Start From

Use [makeareadme.com](https://www.makeareadme.com/) as your starting point, then customize for your agent.

**Minimal README structure:**
```markdown
# Agent Name

[One sentence description]

## What It Does
[Paragraph + bullet list of capabilities]

## Setup
[Step-by-step instructions]

## Usage
[Examples of input/output]

## Architecture
[Diagram or description of how it works]

## Evaluation Results
[Test results, metrics, accuracy]

## Limitations
[What it can't do, edge cases]

## Future Work
[What's next for v2]
```

---

## How to Evaluate Your Own Work

**Before submitting, ask:**
1. Could I hand this README to a friend and they'd get it running? (If no, simplify)
2. Does the demo show the agent actually solving a problem? (If not, pick a better example)
3. Do I explain why I made a specific choice? (Design decision explained = yes)
4. Do I admit one thing that doesn't work? (Limitation explained = yes)
5. Is the demo under 5 minutes? (Tight focus = yes)

If all 5 are yes → ready to submit.

---

## Timeline (Week 9 = 5 hours)

- **Hour 1:** Write README (draft all sections)
- **Hour 2:** Test setup instructions (actually run them)
- **Hour 3:** Record demo (do 2-3 takes, pick the best)
- **Hour 4:** Upload to YouTube, get unlisted link
- **Hour 5:** Final review, submit

---

## Example Eval Results Section

```markdown
## Evaluation Results

**Test Set:** 50 user queries from [source]

| Metric | Score |
|--------|-------|
| Accuracy | 87% |
| Latency | 2.3s avg |
| Handles multi-turn | 94% |
| Follows guardrails | 98% |

Failed cases: Agent hallucinated on 5 queries requiring real-time data.
[See limitations below]
```

---

## Example Limitations Section

```markdown
## Known Limitations

1. **Real-time data:** Cannot access live APIs (stock prices, weather, news)
   - *Why:* Groq doesn't have internet access; added latency for API calls
   - *Fix for v2:* Add async API layer to fetch data before inference

2. **Long context:** Struggles with inputs > 5000 tokens
   - *Why:* Memory constraints in current pipeline
   - *Fix for v2:* Implement sliding window or summarization

3. **Non-English:** Only tested on English text
   - *Why:* Training data was English-heavy
   - *Fix for v2:* Multilingual fine-tune or translate layer
```

---

**You're ready to document.** Start with the README, then record the demo. Ship it. 🚀