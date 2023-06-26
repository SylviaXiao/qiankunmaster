@echo off

set remote="%1"

if exist dist (
  echo del dir[dist]...
  rd /S /Q dist\ > nul
) else (
  mkdir dist
)

call npm run build

if %remote% == "remote" (
  echo Deploy to remoting server...
  scp -r dist root@47.114.145.92:/www/erp-html
)

echo Done.
