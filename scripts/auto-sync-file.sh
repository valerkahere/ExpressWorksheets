#!/bin/bash

# Goal: Syncing a file across all branches
# To apply and persist changes from a single file across all other branches exactly as it looks on main, you can pull that specific file directly from main while standing in your other branches.
# You can use git checkout (or git restore) with a specific file path. This targets only that file without modifying or merging anything else from main.

#!/bin/bash
set -euo pipefail

# USAGE
#   bash scripts/auto-sync-file.sh <file-name> [--push] [--dry-run]
#
#   --dry-run   show which branches would change, commit nothing, push nothing
#   --push      after committing on each branch, push it to origin

filename=""
do_push=false
dry_run=false

for arg in "$@"; do
    case "$arg" in
        --push) do_push=true ;;
        --dry-run) dry_run=true ;;
        *) filename="$arg" ;;
    esac
done

if [ -z "$filename" ]; then
    read -rp "File to sync from main: " filename
fi

if [ ! -e "$filename" ]; then
    echo " '$filename' does not exist on the current branch. Are you on main?"
    exit 1
fi

original_branch=$(git branch --show-current)

if [ -n "$(git status --porcelain)" ]; then
    echo " Working tree not clean. Commit or stash first."
    exit 1
fi

$dry_run && echo "🔍 Dry run — no commits or pushes will be made."

for branch in $(git branch --format='%(refname:short)'); do
    [ "$branch" = "main" ] && continue

    git switch "$branch" --quiet
    git restore --source=main -- "$filename"

    if git diff --cached --quiet -- "$filename"; then
        echo "→ $branch: already up to date"
        git restore --staged "$filename"
        continue
    fi

    if $dry_run; then
        echo "→ $branch: WOULD sync '$filename'"
        git restore --staged "$filename"
        git restore -- "$filename" 2>/dev/null || true
        git checkout -- "$filename" 2>/dev/null || true
        continue
    fi

    git commit -m "chore: sync $filename from main [automated]" --quiet
    echo "→ $branch: synced and committed"

    if $do_push; then
        git push origin "$branch"
        echo "   pushed to origin/$branch"
    fi
done

git switch "$original_branch" --quiet
echo " Done."

