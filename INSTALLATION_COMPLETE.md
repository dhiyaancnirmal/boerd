# Installation Complete - Boerd Development Environment

## Installed Components

### 1. Shadcn MCP Server
**Location:** `~/.config/opencode/opencode.json`
**Purpose:** Browse, search, and install shadcn/ui components
**Command:** `npx shadcn@latest mcp`

### 2. Agent Skills (9 skills installed)
**Location:** `~/.config/opencode/skills/`

| # | Skill | Description | Use Case |
|---|--------|-------------|-----------|
| 1 | vercel-react-best-practices | React/Next.js performance patterns (57 rules) | Writing components, optimizing bundles, data fetching |
| 2 | web-design-guidelines | UI compliance & accessibility (100+ rules) | Reviewing UI, checking accessibility, auditing design |
| 3 | vercel-composition-patterns | Flexible component APIs | Building reusable components, avoiding boolean props |
| 4 | api-design-principles | REST/GraphQL API design | Designing API routes for blocks, boerds, users |
| 5 | error-handling-patterns | Cross-language error handling | Robust file uploads, database errors, API failures |
| 6 | test-driven-development | TDD practices and workflow | Testing blocks, boerds, authentication |
| 7 | next-best-practices | Next.js-specific patterns | App Router, Turbopack, server actions |
| 8 | typescript-advanced-types | Advanced TypeScript patterns | Database types, block detection, strict typing |
| 9 | vercel-react-native-skills | React Native/Expo best practices | Future mobile app development |

## Next Steps

### 1. Restart OpenCode
Restart OpenCode to load the new MCP server and all installed skills.

### 2. Verify Shadcn MCP Server
After restarting, run the `/mcp` command in OpenCode.
You should see "shadcn" listed among the MCP servers with status "Connected".

### 3. Test Skills
Try these prompts to verify skills are working:

**Shadcn MCP Server:**
- "Show me all available components in the shadcn registry"
- "Add the button, dialog, and card components to my project"
- "Create a login form using shadcn components"

**React Best Practices:**
- "Review my React component for performance issues"
- "Help me optimize this Next.js page"
- "Check if I'm following React best practices"

**Web Design Guidelines:**
- "Review my UI for accessibility issues"
- "Check if this component follows web design best practices"
- "Audit this page against accessibility standards"

**Composition Patterns:**
- "Refactor this component to avoid boolean props"
- "How should I structure this component's API?"

## How Skills Work

Skills are **automatically loaded** when OpenCode detects a relevant task:
- Writing React components → React best practices skill activates
- Reviewing UI code → Web design guidelines skill activates  
- Designing APIs → API design principles skill activates
- Implementing error handling → Error handling patterns skill activates

No manual invocation needed—the `skill` tool shows available skills to the agent, and the agent loads the full skill content when needed.

## Project Structure

```
~/.config/opencode/
├── opencode.json (contains MCP server configurations)
└── skills/
    ├── api-design-principles/
    │   └── SKILL.md
    ├── error-handling-patterns/
    │   └── SKILL.md
    ├── next-best-practices/
    │   └── SKILL.md
    ├── test-driven-development/
    │   └── SKILL.md
    ├── typescript-advanced-types/
    │   └── SKILL.md
    ├── vercel-composition-patterns/
    │   └── SKILL.md
    ├── vercel-react-best-practices/
    │   └── SKILL.md
    ├── vercel-react-native-skills/
    │   └── SKILL.md
    └── web-design-guidelines/
        └── SKILL.md
```

## Troubleshooting

### Skills not loading?
1. Verify SKILL.md files exist in `~/.config/opencode/skills/*/`
2. Check that `name` and `description` are in YAML frontmatter
3. Restart OpenCode after installing new skills

### Shadcn MCP not responding?
1. Check opencode.json includes the shadcn configuration
2. Verify `npx shadcn@latest mcp` works in terminal
3. Restart OpenCode

### Want project-local skills?
Create `.opencode/skills/<skill-name>/SKILL.md` in your project directory.
These take precedence over global skills for that project only.

## Additional Resources

- [Agent Skills Documentation](https://opencode.ai/docs/skills/)
- [Shadcn MCP Server](https://ui.shadcn.com/docs/mcp-server)
- [Skills.sh Registry](https://skills.sh/)
- [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills)
