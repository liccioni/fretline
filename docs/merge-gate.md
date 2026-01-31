# Merge Gate (required before merge)
- [ ] PR links exactly one task file: `docs/tasks/task-000X.md`
- [ ] PR title matches: `Task 000X: <short title>`
- [ ] PR description uses `.github/pull_request_template.md` and is fully filled out
- [ ] Spec status chosen (Partial/Complete/Deviating) and explanation provided
- [ ] Scope and Out of scope are explicitly filled (no placeholders)
- [ ] No unrelated refactors / drive-by fixes (diff matches task scope)
- [ ] No routing libraries added (unless explicitly allowed by spec/task)
- [ ] Persistence remains local-only (no backend/cloud) unless spec/task says otherwise
- [ ] Runner invariant preserved: no mid-session interruption; exit only after completion
- [ ] Storage invariant preserved: safe load on empty/malformed localStorage (no crashes)
- [ ] Acceptance Criteria in the task are satisfied OR explicitly called out as follow-ups if Spec status is Partial/Deviating
- [ ] Basic verification steps written and actually executed (recorded in PR)

## If Spec status is Deviating
- [ ] Deviation is explicitly justified and time-bounded
- [ ] Follow-up task created to remove the deviation

## If Spec status is Partial
- [ ] Missing spec items are explicitly listed as follow-ups (no surprises)
