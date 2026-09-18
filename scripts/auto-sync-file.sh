#!/bin/bash

# Goal: Syncing a file across all branches
# To apply and persist changes from a single file across all other branches exactly as it looks on main, you can pull that specific file directly from main while standing in your other branches.
# You can use git checkout (or git restore) with a specific file path. This targets only that file without modifying or merging anything else from main.
#!/bin/bash
set -euo pipefail

# USAGE
#   bash scripts/auto-sync-file.sh <file1> [file2] [file3] ... [--push] [--dry-run]
#
#   --dry-run   show which branches would change, commit nothing, push nothing
#   --push      after committing on each branch, push it to origin

files=()
do_push=false
dry_run=false

for arg in "$@"; do
    case "$arg" in
        --push) do_push=true ;;
        --dry-run) dry_run=true ;;
        *) files+=("$arg") ;;
    esac
done

if [ ${#files[@]} -eq 0 ]; then
    read -rp "Files to sync from main (space-separated): " -a files
fi

if [ ${#files[@]} -eq 0 ]; then
    echo "No files given."
    exit 1
fi

# validate every file exists before touching any branch
missing=()
for f in "${files[@]}"; do
    [ -e "$f" ] || missing+=("$f")
done
if [ ${#missing[@]} -gt 0 ]; then
    echo "Not found on current branch (are you on main?): ${missing[*]}"
    exit 1
fi

original_branch=$(git branch --show-current)

if [ -n "$(git status --porcelain)" ]; then
    echo "Working tree not clean. Commit or stash first."
    exit 1
fi

$dry_run && echo "🔍 Dry run — no commits or pushes will be made."

for branch in $(git branch --format='%(refname:short)'); do
    [ "$branch" = "main" ] && continue

    git switch "$branch"

    # restore only files that exist on main; skip ones that don't, per branch
    present=()
    for f in "${files[@]}"; do
        if git cat-file -e "main:$f" 2>/dev/null; then
            git restore --source=main -- "$f"
            present+=("$f")
        else
            echo "→ $branch: skipping '$f' (not on main)"
        fi
    done

    if [ ${#present[@]} -eq 0 ]; then
        continue
    fi

    if git diff --cached -- "${present[@]}"; then
        echo "→ $branch: already up to date (${present[*]})"
        git restore --staged -- "${present[@]}"
        continue
    fi

    changed=()
    for f in "${present[@]}"; do
        git diff --cached -- "$f" || changed+=("$f")
    done

    if $dry_run; then
        echo "→ $branch: WOULD sync: ${changed[*]}"
        git restore --staged -- "${present[@]}"
        git checkout -- "${present[@]}" 2>/dev/null || true
        continue
    fi

    git commit -m "chore: sync ${changed[*]} from main [automated]"
    echo "→ $branch: synced and committed (${changed[*]})"

    if $do_push; then
        git push origin "$branch"
        echo "   pushed to origin/$branch"
    fi
done

git switch "$original_branch"
echo "Done."
