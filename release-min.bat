@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   83rd Fire UAF - 一键压缩并发布
echo   只发布压缩版 indexxx.js，源码 index.js 不上传
echo ============================================
echo.

REM ===== 0. 检查 Node.js 是否安装 =====
where node >nul 2>nul
if errorlevel 1 (
    echo [错误] 没找到 Node.js
    echo.
    echo 请先去 https://nodejs.org/ 下载 LTS 版本安装
    echo 安装后重启电脑，然后再运行这个脚本
    echo.
    pause
    exit /b 1
)

REM ===== 1. 输入版本号 =====
set /p tagver="请输入新版本号（例如 v2.7.6）: "
if "%tagver%"=="" (
    echo [取消] 没输入版本号，已退出
    pause
    exit /b 0
)

REM ===== 2. 一次性清掉远程仓库里已存在的 index.js（本地源码不删！） =====
echo.
echo [1/6] 检查并清除远程仓库里可能残留的源码 index.js ...
git ls-files --error-unmatch index.js >nul 2>nul
if not errorlevel 1 (
    echo   发现仓库里还有 index.js，正在从 git 索引中移除（本地文件保留）...
    git rm --cached index.js >nul
    git commit -m "remove source index.js from repo" 2>nul
)

REM ===== 3. 用 terser 压缩 index.js → indexxx.js =====
echo.
echo [2/6] 正在压缩 index.js → indexxx.js ...
echo （首次运行会自动下载 terser，可能要等 1-2 分钟）
call npx --yes terser index.js -c passes=2 -m -o indexxx.js
if errorlevel 1 (
    echo.
    echo [错误] 压缩失败！请检查 index.js 是否有语法错误
    pause
    exit /b 1
)

REM ===== 4. 拉取远程更新（避免 push 冲突） =====
echo.
echo [3/6] 拉取远程更新 ...
git pull --no-edit

REM ===== 5. 提交压缩产物（.gitignore 已自动屏蔽 index.js） =====
echo.
echo [4/6] 提交 indexxx.js 到 GitHub ...
git add .
git commit -m "build: %tagver%"
git push

REM ===== 6. 打 tag 并推送 =====
echo.
echo [5/6] 创建并推送 tag %tagver% ...
git tag %tagver%
git push origin %tagver%
if errorlevel 1 (
    echo.
    echo [警告] tag 推送失败，可能是这个版本号已存在
    echo 如果需要覆盖，请手动执行：
    echo   git tag -d %tagver%
    echo   git push origin :refs/tags/%tagver%
    echo 然后重新运行本脚本
    pause
    exit /b 1
)

echo.
echo [6/6] 全部完成！
echo.
echo ============================================
echo   发布成功！%tagver%
echo ============================================
echo.
echo === 加载器代码（复制下面 4 行到酒馆 / 给朋友） ===
echo.
echo var V='%tagver%';
echo fetch('https://cdn.jsdelivr.net/gh/hejianzi/83rd_Fire_UAF@'+V+'/indexxx.js')
echo .then(r=^>r.text^(^)).then(c=^>{document.querySelectorAll('script[data-uaf]').forEach(s=^>s.remove^(^));
echo var s=document.createElement('script');s.dataset.uaf=1;s.textContent=c+'\n//# sourceURL=UAF_'+V+'.js';document.head.appendChild(s);console.log('[UAF] '+V+' 已加载');});
echo.
echo === 验证链接（首次访问 jsDelivr 可能要等 1-2 分钟生效） ===
echo   https://cdn.jsdelivr.net/gh/hejianzi/83rd_Fire_UAF@%tagver%/indexxx.js
echo.
pause
