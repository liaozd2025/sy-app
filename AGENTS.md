# 颐享健康平台 Agent Guide

## Repository Overview

This repository is a lightweight monorepo for `颐享健康大讲堂`.

- `apps/mobile`: Expo React Native prototype for the member-facing mobile app.
- `apps/admin-web`: placeholder for the future React admin console.
- `server/`: Java / Spring Boot backend (Maven multi-module: dh-admin, dh-framework, dh-system, dh-quartz, dh-generator, dh-common).
- `packages/api-contracts`: placeholder for future OpenAPI schemas and generated TypeScript API clients.
- `docs`: shared product, architecture, and learning documentation.

The current runnable product is the Expo mobile app under `apps/mobile`.

## Commands

Use `corepack pnpm` from the repository root.

```sh
corepack pnpm install
corepack pnpm run mobile:web -- --port 8081
corepack pnpm run mobile:ios
corepack pnpm run mobile:android
corepack pnpm run lint
corepack pnpm run type-check
corepack pnpm test --runInBand
```

## Implementation Rules

- Keep mobile app work under `apps/mobile` unless the change is genuinely shared across products.
- Keep admin web work under `apps/admin-web` once that app is created.
- Keep backend service work under `server/` (Java Spring Boot).
- Put shared API contracts in `packages/api-contracts`; do not share UI components between React Web and React Native by default.
- Use the mobile-specific guide at `apps/mobile/AGENTS.md` for Expo, React Native, routing, mock data, Zustand state, and iOS layout rules.
- Prefer API contracts and generated clients for front/backend integration instead of handwritten duplicated request types.

## Current Scope

The mobile app remains a local mock-data prototype. Do not add real payment, livestream SDK, video SDK, member authentication, CMS, or backend integration without a separate product decision.
