@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === 开始推送 ===
git add .
git commit -m "update %date% %time%"
git push
echo === 完成 ===
pause