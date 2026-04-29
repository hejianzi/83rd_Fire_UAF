@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   83rd Fire UAF - 一键发布工具
echo ============================================
echo.

echo [1/4] 提交本地改动...
git add .
git commit -m "update %date% %time%" 2>nul
echo.

echo [2/4] 拉取远程更新...
git pull --no-edit
echo.

echo [3/4] 推送代码到 GitHub...
git push
echo.

echo ============================================
echo   是否要发布新版本？
echo ============================================
echo.
set /p tagver="输入版本号（如 v2.7.6），跳过请直接回车: "

if "%tagver%"=="" (
    echo.
    echo  完成！只推送了代码，未发布新版本
    pause
    exit /b 0
)

echo.
echo [4/4] 创建并推送 tag %tagver%...
git tag %tagver%
git push origin %tagver%

echo.
echo ============================================
echo   发布完成！%tagver%
echo ============================================
echo.
echo 给朋友的加载器代码:
echo.
echo fetch('https://cdn.jsdelivr.net/gh/hejianzi/83rd_Fire_UAF@%tagver%/index.js')
echo   .then(r =^> r.text^(^))
echo   .then(code =^> {
echo     var s = document.createElement('script'^);
echo     s.textContent = code;
echo     document.head.appendChild(s^);
echo   }^);
echo.
echo 验证链接（浏览器打开看是否有代码）:
echo   https://cdn.jsdelivr.net/gh/hejianzi/83rd_Fire_UAF@%tagver%/index.js
echo.

pause