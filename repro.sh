#!/bin/bash
rm -rf out

pnpm turbo prune @repo/test-app

cd out || exit

pnpm install

pnpm turbo build --filter=@repo/test-app

cd apps/test-app || exit

docker build -t "test-app:0.1.0" . --no-cache
