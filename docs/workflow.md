# Workflow (PR-based)

## Rules
- One task = one branch = one PR.
- Branch naming: `task-000X`.
- PR title: `Task 000X: <short title>`.
- No unrelated changes in a task PR (no drive-by fixes).

## PR Description (Required)
- Task: link to `docs/tasks/task-000X.md`
- Spec status: Partial | Complete | Deviating
- Scope:
  - ...
- Out of scope:
  - ...
- Spec references (sections in `docs/spec-v1.md`):
  - ...
- Known gaps / follow-ups:
  - ...

## Review Process
- Review is diff-first.
- If ChatGPT review is needed, paste:
  - PR description
  - `git diff main...HEAD`
