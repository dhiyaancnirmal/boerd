# boerd

Open-source, self-hostable platform for building mixed-media moodboards.

If Are.na is the paid community version, Boerd is the self-hosted freedom version.

---

## Quick Start

```bash
# Clone
git clone https://github.com/boerd/boerd.git
cd boerd

# Install (requires Bun)
bun install

# Setup database
bun run setup

# Start dev server
bun run dev
```

Visit `http://localhost:3000`

---

## Stack

- **Runtime:** Bun
- **Framework:** Next.js 16
- **Database:** bun:sqlite + Drizzle ORM
- **UI:** Tailwind CSS + shadcn/ui

---

## Project Structure

```
boerd/
├── apps/web/          # Next.js application
├── packages/database/ # Database layer
└── docs/              # Documentation
```

---

## Commands

```bash
bun run dev          # Start dev server
bun run build        # Build for production
bun run start        # Start production server
bun run db:push      # Push schema to database
bun run db:generate  # Generate migrations
```

---

## Documentation

- [Product Requirements](docs/PRD.md)
- [System Design](docs/SYSTEM_DESIGN.md)
- [UI Design Guide](docs/UI_DESIGN_GUIDE.md)
- [Agent Instructions](AGENTS.md)

---

## License

MIT
