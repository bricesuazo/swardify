## Installation

```bash
copy .env.example .env

pnpm install

pnpm start
```

## Migration

```bash
# Changes from local to remote
pnpm db:diff <title_or_description>

pnpm db:cli

supabase db push
```
