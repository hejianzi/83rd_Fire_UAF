@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo === 开始推送 ===
git add .
git commit -m "update %date% %time%"
git push
echo.
echo === 等待 5 秒，让 GitHub 同步 ===
timeout /t 5 /nobreak >nul
echo === 清除 jsdelivr 缓存 ===
curl -s "https://purge.jsdelivr.net/gh/hejianzi/83rd_Fire_UAF@main/index.js"
echo.
echo === 全部完成！===
pause