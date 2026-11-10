# Builder Method — original Build prompts (English)

The skill follows their intent; the user never has to type them. In the course, the first two were run in plan mode and the third as a goal. Here that means: plan and get approval first, then keep going autonomously until the goal is met.

## 1 · Orchestration plan
> Create an execution plan for this PRD, in phases and tasks, with subagents that use the best model for each task (Sonnet, Opus…).

## 2 · Pre-setup
> Before we start programming, help me create: 1) the directory structure, 2) the CLAUDE.md file with the conventions, 3) the development scripts (dev, test, build) and 4) the linting and formatting configuration, following best practices for scalable and secure software. Align the base structure with the orchestration plan and the validation criteria already defined in the PRD.

## 3 · Build
> Orchestrate the execution of this plan autonomously until the specification is complete. Check that each piece of work meets its task, and test the front end and the back end. Add realistic sample data to try it. Keep going until every task in the plan, phase or task X is completed and tested.
