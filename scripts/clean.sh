#!/bin/bash

if [[ ! -d .git ]]; then
  echo "Error: This script should be run from the repository root"
  exit 1
fi

delete_file() {
  file_name=$1
  find . -name "$file_name" -delete
}

delete_directory() {
  dir_name=$1
  find . -name "$dir_name" -type d -prune -exec rm -rf {} +
}

delete_file '*.lock'
delete_file '*.lockb'
delete_file 'package-lock.json'
delete_file 'yarn.lock'
delete_file 'pnpm-lock.yaml'

delete_directory '.turbo'
delete_directory 'node_modules'
delete_directory 'dist'
delete_directory 'build'
delete_directory '.next'
