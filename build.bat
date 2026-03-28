@echo off
set PATH=%PATH%;C:\Program Files\nodejs\
"C:\Program Files\nodejs\npm.cmd" install
"C:\Program Files\nodejs\npx.cmd" expo export -p web
