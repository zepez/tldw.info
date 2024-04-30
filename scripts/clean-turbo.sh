#!/bin/bash

if [[ ! -d .git ]]; then
  echo "Error: This script should be run from the repository root"
  exit 1
fi

delete_directory() {
  dir_name=$1
  find . -name "$dir_name" -type d -prune -exec rm -rf {} +
}

delete_directory '.turbo'

