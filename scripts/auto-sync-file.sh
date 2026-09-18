#!/bin/bash

# Goal: Syncing a file across all branches
# To apply and persist changes from a single file across all other branches exactly as it looks on main, you can pull that specific file directly from main while standing in your other branches.
# You can use git checkout (or git restore) with a specific file path. This targets only that file without modifying or merging anything else from main.

set -euo pipefail

# USAGE
#   bash scripts/auto-sync-file.sh <file1> [file2] [file3] ... [--push] [--dry-run]
#
#   --dry-run   show which branches would change, commit nothing, push nothing
#   --push      push any branch that ends up ahead of its upstream --
#               whether the extra commit(s) came from this run or were
#               already sitting there unpushed from a previous run

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

original_branch=$(git branch --show-current)

if [ "$original_branch" != "main" ]; then
    echo "Run this from main."
    exit 1
fi

# fail if any file isn't tracked on main -- no silent per-branch skipping
missing=()
for f in "${files[@]}"; do
    git cat-file -e "main:$f" 2>/dev/null || missing+=("$f")
done
if [ ${#missing[@]} -gt 0 ]; then
    echo "Not tracked on main: ${missing[*]}"
    exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
    echo "Working tree not clean. Commit or stash first."
    exit 1
fi

$dry_run && echo "Dry run -- no commits or pushes will be made."

# undo checkout's index+worktree change for one file on the current branch,
# without assuming the file was ever tracked here before
revert_file() {
    local f="$1"
    git reset --quiet -- "$f"
    if git cat-file -e "HEAD:$f" 2>/dev/null; then
        git checkout -- "$f"
    else
        rm -f -- "$f"
    fi
}

# how many commits is the current branch ahead of its upstream.
# empty output means no upstream configured at all.
ahead_count() {
    local upstream
    upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null) || return 1
    git rev-list --count "$upstream..HEAD"
}

for branch in $(git branch --format='%(refname:short)'); do
    [ "$branch" = "main" ] && continue

    git switch "$branch" --quiet

    for f in "${files[@]}"; do
        git checkout main -- "$f"
    done

    if git diff --cached --quiet -- "${files[@]}"; then
        echo "-> $branch: already up to date (${files[*]})"
        for f in "${files[@]}"; do
            revert_file "$f"
        done
    else
        changed=()
        for f in "${files[@]}"; do
            git diff --cached --quiet -- "$f" || changed+=("$f")
        done

        if $dry_run; then
            echo "-> $branch: WOULD sync: ${changed[*]}"
            for f in "${files[@]}"; do
                revert_file "$f"
            done
        else
            git commit -m "chore: sync ${changed[*]} from main [automated]" --quiet
            echo "-> $branch: synced and committed (${changed[*]})"
        fi
    fi

    # push check runs regardless of whether this run made a new commit --
    # it catches commits left unpushed from an earlier run too
    if $do_push; then
        if count=$(ahead_count); then
            if [ "$count" -gt 0 ]; then
                if $dry_run; then
                    echo "   WOULD push $branch ($count commit(s) ahead of upstream)"
                else
                    git push origin "$branch"
                    echo "   pushed to origin/$branch ($count commit(s))"
                fi
            fi
        else
            echo "   $branch: no upstream configured, skipping push (run: git push -u origin $branch)"
        fi
    fi
done

git switch "$original_branch" --quiet
echo "Done."
