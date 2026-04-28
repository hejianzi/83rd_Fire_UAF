@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === 推送 ===
git add .
git commit -m "update %date% %time%"
git push
echo.
echo === 完成！ST 按 Ctrl+F5 刷新即可 ===
pause