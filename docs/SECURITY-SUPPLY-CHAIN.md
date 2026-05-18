# Seguridad de cadena de suministro (pnpm / agentes IA)

Controles del repo frente a incidentes recientes de **marzo–mayo 2026**. Ejecutar `pnpm run security:audit` antes de subir dependencias o commitear configs de agentes.

## Incidentes de referencia

| Fuente | Incidente | Riesgo principal |
|--------|-----------|------------------|
| [IntCyberDigest / HACKOBAR](https://x.com/IntCyberDigest/status/2054166749998661659) · [resumen](https://hackobar.com/item/twitter-status-2054166749998661659) | **Mini Shai-Hulud** (may 2026): 42+ paquetes npm de ecosistema IA/agentic (TanStack, Mistral, UiPath, etc.) | Gusano auto-propágable, robo de secretos CI/CD, persistencia en **Claude Code** y VS Code |
| [@massimodeluisa](https://x.com/massimodeluisa/status/2054084559629701247) | Cobertura del mismo ecosistema / persistencia en configs de agentes (misma ventana temporal) | Hooks en `.claude/settings.json`, `tasks.json` con `folderOpen` |
| [Microsoft / axios post-mortem](https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/) · [axios#10636](https://github.com/axios/axios/issues/10636) | **axios@1.14.1** y **0.30.4** + **plain-crypto-js@4.2.1** (mar 2026) | RAT en `pnpm install` vía lifecycle scripts |

Lecturas técnicas: [StepSecurity – TanStack wave](https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem), [CSA research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-mini-shai-hulud-multi-ecosystem-supply-cha/).

## Controles en este repositorio

| Control | Ubicación |
|---------|-----------|
| Solo pnpm | `packageManager`, `scripts/ensure-pnpm.mjs` (`preinstall`) |
| Auditoría local | `pnpm run security:audit` → `scripts/security/audit-supply-chain.mjs` |
| Lista de versiones maliciosas | `scripts/security/blocklist.json` + `blocklist.stepsecurity-2026-05.json` (@tanstack/*, @uipath/*) |
| Lockfile obligatorio | `pnpm-lock.yaml` + `.npmrc` |
| Pin preventivo axios | `package.json` → `pnpm.overrides` |
| CI en PR/push | `.github/workflows/supply-chain-audit.yml` |
| Reglas para agentes | `.cursor/rules/supply-chain-security.mdc`, `package-manager.mdc` |
| Plantilla Claude segura | `.claude/settings.json.example` |

## Si estuviste expuesto

### axios / plain-crypto-js (mar 2026)

1. Buscar en `pnpm-lock.yaml`: `axios@1.14.1`, `axios@0.30.4`, `plain-crypto-js`.
2. Fijar axios a **1.14.0** (o **0.30.3** en rama 0.x) vía `pnpm.overrides`.
3. **Rotar** todos los secretos (npm, GitHub, cloud, API keys).
4. Revisar logs por `sfrclak.com` o `142.11.206.73:8000`.
5. Considerar la máquina comprometida si instalaste durante la ventana (~3 h).

### Mini Shai-Hulud (may 2026)

1. Revisar versiones en [StepSecurity](https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem) / actualizar `blocklist.json`.
2. Auditar `.claude/settings.json`: **no** debe tener `hooks.SessionStart` ni scripts desconocidos.
3. Auditar `.vscode/tasks.json`: **no** usar `runOn: folderOpen` con comandos no revisados.
4. Rotar tokens npm, GitHub, OIDC de Actions, secretos de Expo/EAS.
5. Buscar repos/commits con mensajes tipo “Mini Shai-Hulud” o autor `claude@users.noreply.github.com` inesperado.

## Prácticas de equipo

- `corepack enable` y usar solo **pnpm** (`pnpm install`, `pnpm add`).
- CI: `pnpm install --frozen-lockfile` (no `npm ci` ni `yarn`).
- No commitear `package-lock.json` ni `yarn.lock`.
- Evitar rangos amplios (`^`) en dependencias críticas; revisar diffs de `pnpm-lock.yaml` en PR.
- No commitear `.env`, claves ni tokens en skills/reglas.
- Revisar manualmente cualquier cambio en `.claude/`, `.cursor/`, `.vscode/` antes del merge.
- Tras actualizar deps: `pnpm run security:audit` y `pnpm run security:deps-audit`.

## Ampliar el blocklist

1. **@tanstack / @uipath (May 2026):** ya en `scripts/security/blocklist.stepsecurity-2026-05.json` ([tabla StepSecurity](https://www.stepsecurity.io/blog/mini-shai-hulud-is-back-a-self-spreading-supply-chain-attack-hits-the-npm-ecosystem)).
2. **Otros paquetes:** añadir a `scripts/security/blocklist.json` o crear `blocklist.<fuente>.json` (el auditor fusiona todos los `blocklist.*.json`).
3. Monitorizar el [OSS Security Feed de StepSecurity](https://app.stepsecurity.io/oss-security-feed) ante nuevas olas.

El CI fallará si `pnpm-lock.yaml` contiene alguna versión listada.
