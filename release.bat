@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   83rd Fire UAF - 一键发布工具
echo ============================================
echo.

echo [1/5] 检查本地改动并提交...
git add .
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "update %date% %time%"
    echo   有新改动已提交
) else (
    echo   没有新改动需要提交
)
echo.

echo [2/5] 拉取远程更新（避免冲突）...
git pull --no-edit
if errorlevel 1 (
    echo.
    echo  X 拉取失败！可能有冲突，请手动解决后再试
    pause
    exit /b 1
)
echo.

echo [3/5] 推送代码到 GitHub...
git push
if errorlevel 1 (
    echo.
    echo  X 推送失败！
    pause
    exit /b 1
)
echo.

echo ============================================
echo   是否要发布新版本？
echo ============================================
echo.
set /p tagver="请输入版本号（如 v2.7.6），不发布请直接回车: "

if "%tagver%"=="" (
    echo.
    echo  完成！只推送了代码，未发布新版本
    pause
    exit /b 0
)

echo.
echo [4/5] 创建 tag %tagver%...
git tag %tagver%
if errorlevel 1 (
    echo.
    echo  X tag 创建失败！可能版本号已存在
    pause
    exit /b 1
)

echo.
echo [5/5] 推送 tag 到 GitHub...
git push origin %tagver%
if errorlevel 1 (
    echo.
    echo  X tag 推送失败！
    pause
    exit /b 1
)

echo.
echo ============================================
echo   发布成功！%tagver%
echo ============================================
echo.
echo 给朋友的加载器代码:
echo.
echo   fetch('https://cdn.jsdelivr.net/gh/hejianzi/83rd_Fire_UAF@%tagver%/index.js')
echo     .then(r =^> r.text^(^))
echo     .then(code =^> {
echo       var s = document.createElement('script'^);
echo       s.textContent = code;
echo       document.head.appendChild(s^);
echo     }^);
echo.
echo 验证链接（用浏览器打开看代码）:
echo   https://cdn.jsdelivr.net/gh/hejianzi/83rd_Fire_UAF@%tagver%/index.js
echo.

pause