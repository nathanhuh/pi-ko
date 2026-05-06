#!/usr/bin/env bash
set -euo pipefail

ERRORS=0

fail() {
  echo "ERROR: $*" >&2
  ERRORS=$((ERRORS + 1))
}

# ---------------------------------------------------------------------------
# 1. SKILL.md frontmatter: name + description required; name must match dir
# ---------------------------------------------------------------------------
echo "--- Linting skills ---"
while IFS= read -r skill_file; do
  dir=$(basename "$(dirname "$skill_file")")

  name=$(awk '/^---/{f=!f; next} f && /^name:/{print; exit}' "$skill_file" | sed 's/^name:[[:space:]]*//')
  desc=$(awk '/^---/{f=!f; next} f && /^description:/{found=1} found{print; exit}' "$skill_file" | sed 's/^description:[[:space:]]*//')

  if [[ -z "$name" ]]; then
    fail "$skill_file: missing 'name' in frontmatter"
  elif [[ "$name" != "$dir" ]]; then
    fail "$skill_file: name '$name' does not match directory '$dir'"
  fi

  if [[ -z "$desc" ]]; then
    fail "$skill_file: missing 'description' in frontmatter"
  fi

  echo "  ok  $skill_file"
done < <(find skills -name 'SKILL.md' | sort)

# ---------------------------------------------------------------------------
# 2. Prompt templates: description required in frontmatter
# ---------------------------------------------------------------------------
echo "--- Linting prompts ---"
while IFS= read -r prompt_file; do
  desc=$(awk '/^---/{f=!f; next} f && /^description:/{print; exit}' "$prompt_file" | sed 's/^description:[[:space:]]*//')

  if [[ -z "$desc" ]]; then
    fail "$prompt_file: missing 'description' in frontmatter"
  fi

  echo "  ok  $prompt_file"
done < <(find prompts -name '*.md' | sort)

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
if [[ $ERRORS -gt 0 ]]; then
  echo ""
  echo "Lint failed with $ERRORS error(s)." >&2
  exit 1
fi

echo ""
echo "All lint checks passed."
