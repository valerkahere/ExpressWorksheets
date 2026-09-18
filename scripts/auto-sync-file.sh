#!/bin/bash

# USAGE
# bash scripts/auto-sync-file.sh <file-name>

# To apply and persist changes from a single file across all other branches exactly as it looks on main, you can pull that specific file directly from main while standing in your other branches.
# You can use git checkout (or git restore) with a specific file path. This targets only that file without modifying or merging anything else from main.

echo "give file name"
read filename

for branch in $(git branch --format='%(refname:short)' | grep -v 'main'); do
    git switch $branch
    git switch main -- $filename
    git commit -m "feat: auto-sync $filename from main [automated]"
done
git switch main
