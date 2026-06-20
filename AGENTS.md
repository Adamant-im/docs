# ADAMANT Docs: AI Agent Operating Manual

This document defines how AI agents should work in this repository.

## Mission

`Adamant-im/docs` is the VitePress documentation site for the ADAMANT blockchain node and API, published at [docs.adamant.im](https://docs.adamant.im).

Agent output must optimize for:

1. Accuracy — documentation must reflect current node and API behavior.
2. Clarity — content must be approachable for both developers and node operators.
3. Consistency — style, terminology, and structure must be uniform across pages.

## Language Policy

- Developers may communicate with AI in any language.
- All repository artifacts must be in English only.
- Write all content, comments, commit messages, and PR text in English.

## Sources of Truth

Use these sources when writing or reviewing content:

- This repository: `README.md`, `.vitepress/config.mts`, current page content.
- Published docs: <https://docs.adamant.im>
- ADAMANT node source: <https://github.com/Adamant-im/adamant> (branch `dev`)
- API schema site: <https://schema.adamant.im>
- API schema source: <https://github.com/Adamant-im/adamant-schema> (branch `dev`)
- AIP index: <https://aips.adamant.im>
- AIP source: <https://github.com/Adamant-im/AIPs>
- Org-wide issue and label governance: <https://github.com/Adamant-im/.github>
- Recommended issue title prefixes: <https://github.com/orgs/Adamant-im/discussions/5>
- Recommended labels: <https://github.com/orgs/Adamant-im/discussions/1>
- Current docs issues: <https://github.com/Adamant-im/docs/issues>

If sources disagree, treat current node code and passing tests as implementation truth, and document any drift. Do not silently ignore a mismatch — raise it and propose a fix.

## System Map

Key files and directories:

- `.vitepress/config.mts` — sidebar structure, head, markdown, theme config.
- `.vitepress/theme/` — custom theme components and styles.
- `.vitepress/langs/` — custom Shiki language definitions (e.g., `url.json`).
- `index.md` — Introduction page (entry point of the docs).
- `core-concepts.md` — high-level blockchain and protocol concepts.
- `own-node/` — node setup: installation, configuration, testnet, localnet, consensus, syncing.
- `essentials/` — developer essentials: accounts, signing, encryption, KVS, contacts.
- `api/` — making requests, WebSocket, transactions query language.
- `api-endpoints/` — REST API reference: accounts, blocks, blockchain, delegates, KVS, transactions, chatrooms.
- `api-types/` — transaction types and message types.
- `examples/` — code examples (Swift, Java).
- `public/` — static assets: icons, logos.
- `package.json` — dev/build scripts; always keep VitePress version accurate.

## Content Conventions

### Markdown style

- Use [VitePress Markdown features](https://vitepress.dev/guide/markdown) where appropriate: code blocks with language tags, `::: tip`, `::: warning`, `::: danger` callouts, and `[[toc]]`.
- Use fenced code blocks with correct language identifiers. For bare URLs, use the custom `url` language (`lang="url"`).
- Prefer sentence case for headings; do not use title case.
- Do not use trailing punctuation in headings.
- Keep line length readable (under 120 characters where possible).
- Use relative links between pages: `[Installation](/own-node/installation.md)`.

### Terminology

- Use **ADAMANT** (all caps) when referring to the protocol and network.
- Use **ADM** for the token.
- Use **DPoS** for Delegated Proof of Stake.
- Use **node** (lowercase) when referring to a running instance.
- Use **delegate** (lowercase) when referring to block forgers.
- Do not invent new abbreviations.

### Sidebar

- Any new page must be added to `.vitepress/config.mts` under the appropriate section.
- Keep sidebar order logical for the reader, not alphabetical.
- Use short, descriptive text labels in the sidebar.

### Code examples

- Prefer real, runnable examples.
- Include the correct HTTP method and full endpoint path.
- For request/response examples, show realistic sample values.
- Do not expose real private keys or passphrases — use obvious placeholders such as `your-passphrase-here`.

### API endpoint pages

When adding or updating an API endpoint page:

- Follow the existing structure: short description, parameters table, request example, response example.
- Keep parameters tables aligned with the schema at `adamant-schema`.
- Note deprecated fields explicitly and link to the replacement where possible.

## Issue, Label, and PR Conventions

### Issue creation workflow

1. Check existing open issues first: <https://github.com/Adamant-im/docs/issues>
2. Use org templates from `Adamant-im/.github/.github/ISSUE_TEMPLATE/*`.
3. Start the title with one concise prefix.
4. Apply labels from the org label catalog (`Adamant-im/.github/labels.json`).
5. Link related PRs and issues explicitly.

### Recommended title prefixes for issues

Use one or two prefixes maximum:

- `[Bug]` — inaccuracy, broken link, missing content, rendering issue
- `[Feat]` — new documentation page or section
- `[Enhancement]` — improvement of existing content or structure
- `[Refactor]` — reorganization without content change
- `[Docs]` — meta documentation (AGENTS.md, CONTRIBUTING, README)
- `[Chore]` — maintenance and dependency updates
- `[Task]` — general task
- `[Composite]` — multi-part task with sub-tasks

### Label policy

Apply a minimal but informative set:

- One type label: `documentation`, `bug`, `enhancement`, `Task`, `Composite task`
- One or more domain labels: `APIs`, `Nodes`, `Blockchain`, `CI/CD`, `Guideline`
- Optional: `High priority`, `good first issue`

### PR conventions

- Target `dev`, not `main`.
- PR title format: `Type: Short summary` (e.g., `Docs: Add AGENTS.md`).
- Do not use issue-style square-bracket prefixes in PR titles.
- Use org PR template sections: `Description`, `Related issue`, `How to test`, `Checklist`.
- Link the issue with a closing keyword: `Closes #<issue>`.
- In the issue body, link back to the PR URL once created.

## Running Locally

```sh
npm install
npm run dev       # dev server with hot reload at http://localhost:5173
npm run docs:build  # production build
npm run docs:preview  # preview production build locally
```

There is no test suite. Validate changes by running `npm run dev` and visually inspecting affected pages. For build validation, run `npm run docs:build` and confirm it exits without errors.

## AI Change Workflow

Follow this order:

1. Read all pages relevant to the change before editing.
2. Check sources of truth to confirm current behavior before writing.
3. Make the smallest accurate change.
4. Ensure the sidebar in `.vitepress/config.mts` is updated if a page was added or renamed.
5. Run `npm run docs:build` to confirm no build errors.
6. Report any content drift found between docs and the node/API sources.

## Working with CLI Tools

When a CLI tool accepts multi-line input, use a temporary file in `.ai-ignored/` instead of inline multi-line shell strings.

- Prefer file-based flags: `gh pr create --body-file`, `gh issue create --body-file`, `git commit -F`.
- Use descriptive dated filenames: `.ai-ignored/temp.YYYY-MM-DD.pr-description.md`.
- Cleanup is optional because `.ai-ignored/` is git-ignored.

Example:

```sh
gh issue create \
  --title "[Task] Add AGENTS.md" \
  --body-file .ai-ignored/temp.2026-06-20.issue-body.md \
  --label "documentation,Task"
```

## Done Criteria

A change is complete when all of the following are true:

1. Content is accurate relative to current node behavior and API schema.
2. VitePress build exits without errors (`npm run docs:build`).
3. Affected pages are added to the sidebar in `.vitepress/config.mts`.
4. PR links to the issue with a closing keyword.
5. All repository artifacts are in English.
