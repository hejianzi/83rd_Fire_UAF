var PCA_USER_THEME = null;

// ==== 主题数据 ====
// 设计原则：新增主题只需在 pcaThemes 里加一份对象。
// 字段约定：sheen 字段为流光主色（一般等于 accent），用于按钮/标题金光扫过动画。
var pcaThemes = {
    // 苹果（黑底微紫 + 饱和暗血红 + 少量微紫白；金色仅做罕见装饰）
    'apple': {
        name: '苹果',
        colors: {
            bg:'#08080c',          // 近黑，仅一丝冷调
            surface:'#101015',     // 黑色微泛紫
            surfaceHi:'#1a1620',   // 黑+极少量紫
            border:'#2a2530',      // 灰紫黑边
            borderHi:'#4a3e55',    // 暗紫灰高亮边（边缘还能看出紫）
            primary:'#8a1a2e',     // 暗血红（主操作色，饱和但暗）
            primaryDim:'#6e1626',  // 深血红（渐变末端 / 边框）
            accent:'#a8243a',      // 焦血红（hover 提亮，仍属暗红）
            accentDim:'#6e1626',
            text:'#ece8f4',        // 微紫白（贝利尔发色）
            textDim:'#7a7388',     // 中紫灰
            textOff:'#3a3540',     // 失效灰紫
            danger:'#c54052',      // 错误（比 primary 略亮以区分）
            warning:'#8a7448',     // 暗金（罕用警示）
            success:'#5e8a6f',     // 暗绿（去饱和）
            info:'#7a6890',        // 暗紫罗兰
            infoDim:'#4a3e55',
            input:'#0c0c12',
        },
        fonts: { sans:"'Segoe UI',system-ui,-apple-system,sans-serif", mono:"Consolas,Menlo,monospace" },
        sheen: '#b8243a',          // 流光红（动画扫过的瞬间亮起）
    },
    // 月光：深夜星空 + 月光银蓝 + 提亮符文金
    'moonlight': {
        name: '月光',
        colors: {
            bg:'#0d0e1a', surface:'#171a2e', surfaceHi:'#1f2340',
            border:'#262a45', borderHi:'#3a4068',
            primary:'#e8d394', primaryDim:'#b89e60',         // 提亮符文金（清透）
            accent:'#9eb4d8', accentDim:'#6c81a8',           // 月光银蓝
            text:'#e8e6f0', textDim:'#7c809a', textOff:'#3a3e58',
            danger:'#c5546b', warning:'#e8c060', success:'#7eb695',
            info:'#9eb4d8', infoDim:'#6c81a8',
            input:'#0f1124',
        },
        fonts: { sans:"'Segoe UI',system-ui,-apple-system,sans-serif", mono:"Consolas,Menlo,monospace" },
        sheen: '#f5e5b8',          // 流光银金（更亮）
    },
};

// 旧主题名兼容映射（避免老用户 localStorage 里的 'default'/'magic' 失效）
var pcaThemeAliases = { 'default':'apple', 'magic':'moonlight' };

// 全局颜色对象 — 由 pcaApplyTheme 动态填充。下方的 default 值仅在主题应用前作为兜底，
// 兼容旧字段名（card/card2/pink/pinkDim/gold/goldDim/dim/off/migrate*/diff*）。
var pcaC = {};

function pcaApplyTheme(name, opts) {
    opts = opts || {};
    // 旧名兼容
    if (pcaThemeAliases && pcaThemeAliases[name]) name = pcaThemeAliases[name];
    var theme = pcaThemes[name] || pcaThemes['apple'];
    // 用户钩子覆盖
    if (PCA_USER_THEME && PCA_USER_THEME.colors) {
        var merged = {};
        Object.keys(theme.colors).forEach(function(k){ merged[k] = theme.colors[k]; });
        Object.keys(PCA_USER_THEME.colors).forEach(function(k){ merged[k] = PCA_USER_THEME.colors[k]; });
        theme = { name:(PCA_USER_THEME.name||theme.name), colors:merged, fonts:(PCA_USER_THEME.fonts||theme.fonts) };
    }
    var c = theme.colors;
    // 写入新语义 token
    pcaC.bg=c.bg; pcaC.surface=c.surface; pcaC.surfaceHi=c.surfaceHi;
    pcaC.border=c.border; pcaC.borderHi=c.borderHi;
    pcaC.primary=c.primary; pcaC.primaryDim=c.primaryDim;
    pcaC.accent=c.accent; pcaC.accentDim=c.accentDim;
    pcaC.text=c.text; pcaC.textDim=c.textDim; pcaC.textOff=c.textOff;
    pcaC.danger=c.danger; pcaC.warning=c.warning; pcaC.success=c.success;
    pcaC.info=c.info; pcaC.infoDim=c.infoDim; pcaC.input=c.input;
    // 兼容旧字段名（避免一次性替换全文 ~30 处引用）
    pcaC.card=c.surface; pcaC.card2=c.surfaceHi;
    pcaC.pink=c.primary; pcaC.pinkDim=c.primaryDim;
    pcaC.gold=c.accent; pcaC.goldDim=c.accentDim;
    pcaC.dim=c.textDim; pcaC.off=c.textOff;
    pcaC.migrate=c.info; pcaC.migrateDim=c.infoDim;
    pcaC.migrateBg='rgba('+pcaHexToRgb(c.info)+',0.1)';
    pcaC.migrateBorder='rgba('+pcaHexToRgb(c.info)+',0.3)';
    pcaC.diffAdd='rgba('+pcaHexToRgb(c.success)+',0.15)';
    pcaC.diffAddBorder='rgba('+pcaHexToRgb(c.success)+',0.4)';
    pcaC.diffDel='rgba('+pcaHexToRgb(c.danger)+',0.15)';
    pcaC.diffDelBorder='rgba('+pcaHexToRgb(c.danger)+',0.4)';
    pcaC.diffAddText=c.success; pcaC.diffDelText=c.danger;
    // 字体
    pcaC._fontSans = (theme.fonts && theme.fonts.sans) || "'Segoe UI',sans-serif";
    pcaC._fontMono = (theme.fonts && theme.fonts.mono) || "Consolas,monospace";
    // 流光色
    pcaC.sheen = theme.sheen || c.primary;
    pcaC._themeName = name;
    pcaC._themeLabel = theme.name;
    // 持久化
    if (!opts.skipPersist) { try { localStorage.setItem('pca_theme', name); } catch(e) {} }
    // 重新注入 CSS
    if (typeof pcaInjectCSS === 'function') pcaInjectCSS();
    // 重渲染当前 UI
    if (opts.rerender !== false && typeof pcaState !== 'undefined' && pcaState && pcaState.compared) {
        try {
            if (pcaState.activeTab === 'migrate' && typeof pcaRenderMigrate === 'function') pcaRenderMigrate();
            else if (pcaState.activeTab === 'edit' && typeof pcaRenderEdit === 'function') pcaRenderEdit();
            else if (typeof pcaRenderDiffs === 'function') pcaRenderDiffs();
        } catch(e) {}
    }
}
function pcaHexToRgb(hex) {
    hex = (hex || '').replace('#','');
    if (hex.length === 3) hex = hex.split('').map(function(c){return c+c;}).join('');
    var n = parseInt(hex, 16);
    return ((n>>16)&255)+','+((n>>8)&255)+','+(n&255);
}
// 启动时应用持久化主题
(function(){
    var saved = null;
    try { saved = localStorage.getItem('pca_theme'); } catch(e) {}
    if (saved && pcaThemeAliases[saved]) saved = pcaThemeAliases[saved];
    pcaApplyTheme((saved && pcaThemes[saved]) ? saved : 'apple', { skipPersist:true, rerender:false });
})();

var pcaLogs = [];
function pcaLog(msg) {
    var t = new Date().toLocaleTimeString('zh-CN',{hour12:false});
    pcaLogs.push(t + ' ' + msg);
    if (pcaLogs.length > 300) pcaLogs.splice(0, pcaLogs.length - 300);
    console.log('[预设对比]', msg);
}
function pcaEsc(s) { var d = document.createElement('div'); d.textContent = s||''; return d.innerHTML; }
function pcaAttr(s) { return (s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function pcaGetDoc() { try { return window.parent.document; } catch(e) { return document; } }
function pcaGetWin() { try { return window.parent; } catch(e) { return window; } }
function pcaGetJQ() {
    var w = pcaGetWin();
    if (w && (w.jQuery || w.$)) return w.jQuery || w.$;
    return (typeof jQuery !== 'undefined') ? jQuery : ((typeof $ !== 'undefined') ? $ : null);
}
function pcaQ(sel) { return pcaGetDoc().querySelector(sel); }
function pcaGetHeaders() {
    var h = {'Content-Type':'application/json'};
    try { var ctx = SillyTavern.getContext(); if (typeof ctx.getRequestHeaders === 'function') Object.assign(h, ctx.getRequestHeaders()); } catch(e) {}
    return h;
}

function pcaDiffLines(oldText, newText) {
    var oldLines = (oldText || '').split('\n');
    var newLines = (newText || '').split('\n');
    var m = oldLines.length, n = newLines.length;
    if (m * n > 500000) return pcaDiffSimple(oldLines, newLines);
    var dp = [];
    for (var i = 0; i <= m; i++) { dp[i] = []; for (var j = 0; j <= n; j++) dp[i][j] = 0; }
    for (var i2 = 1; i2 <= m; i2++) {
        for (var j2 = 1; j2 <= n; j2++) {
            if (oldLines[i2-1] === newLines[j2-1]) dp[i2][j2] = dp[i2-1][j2-1] + 1;
            else dp[i2][j2] = Math.max(dp[i2-1][j2], dp[i2][j2-1]);
        }
    }
    var result = [];
    var oi = m, ni = n;
    while (oi > 0 || ni > 0) {
        if (oi > 0 && ni > 0 && oldLines[oi-1] === newLines[ni-1]) { result.unshift({type:'same',text:oldLines[oi-1]}); oi--; ni--; }
        else if (ni > 0 && (oi === 0 || dp[oi][ni-1] >= dp[oi-1][ni])) { result.unshift({type:'add',text:newLines[ni-1]}); ni--; }
        else { result.unshift({type:'del',text:oldLines[oi-1]}); oi--; }
    }
    return result;
}
function pcaDiffSimple(oldLines, newLines) {
    var result = [];
    var oi=0, ni=0;
    while (oi < oldLines.length || ni < newLines.length) {
        if (oi < oldLines.length && ni < newLines.length && oldLines[oi] === newLines[ni]) { result.push({type:'same',text:oldLines[oi]}); oi++; ni++; }
        else if (oi < oldLines.length) { result.push({type:'del',text:oldLines[oi]}); oi++; }
        else if (ni < newLines.length) { result.push({type:'add',text:newLines[ni]}); ni++; }
    }
    return result;
}
function pcaIsRewrite(diffResult) {
    if (!diffResult.length) return false;
    var same=0, total=0;
    diffResult.forEach(function(d){ if(d.text.trim()){total++;if(d.type==='same')same++;} });
    return total>0 && (same/total)<0.2;
}
function pcaHasContentDiff(leftContent, rightContent) {
    return (leftContent||'') !== (rightContent||'');
}
function pcaRenderDiffHTML(leftContent, rightContent) {
    if (!leftContent && !rightContent) return '<div style="color:#555;padding:8px;">（两侧都是空内容）</div>';
    if (!leftContent) return '<div style="padding:8px;"><div style="color:'+pcaC.gold+';font-size:11px;margin-bottom:6px;font-weight:600;">\ud83d\udcdd 左侧为空，右侧全部为新增内容：</div><div style="background:'+pcaC.diffAdd+';border-left:3px solid '+pcaC.diffAddBorder+';padding:6px 10px;border-radius:4px;font-size:12px;line-height:1.6;color:'+pcaC.diffAddText+';white-space:pre-wrap;word-break:break-all;">'+pcaEsc(rightContent)+'</div></div>';
    if (!rightContent) return '<div style="padding:8px;"><div style="color:'+pcaC.gold+';font-size:11px;margin-bottom:6px;font-weight:600;">\ud83d\udcdd 右侧为空，左侧全部内容已删除：</div><div style="background:'+pcaC.diffDel+';border-left:3px solid '+pcaC.diffDelBorder+';padding:6px 10px;border-radius:4px;font-size:12px;line-height:1.6;color:'+pcaC.diffDelText+';white-space:pre-wrap;word-break:break-all;">'+pcaEsc(leftContent)+'</div></div>';
    if (leftContent === rightContent) return '<div style="color:'+pcaC.success+';padding:8px;font-size:13px;">✓ 内容完全相同</div>';
    var diff = pcaDiffLines(leftContent, rightContent);
    var rewrite = pcaIsRewrite(diff);
    if (rewrite) {
        return '<div style="padding:8px;"><div style="color:'+pcaC.gold+';font-size:11px;margin-bottom:8px;font-weight:600;">⚠️ 内容几乎完全重写（相同部分＜20%），左右并排展示：</div><div style="display:flex;gap:10px;"><div style="flex:1;min-width:0;"><div style="font-size:10px;color:'+pcaC.diffDelText+';margin-bottom:4px;font-weight:600;">◀ 左侧（旧）</div><div style="background:'+pcaC.diffDel+';border:1px solid '+pcaC.diffDelBorder+';border-radius:6px;padding:8px 10px;max-height:250px;overflow-y:auto;font-size:11px;line-height:1.6;color:'+pcaC.diffDelText+';white-space:pre-wrap;word-break:break-all;">'+pcaEsc(leftContent)+'</div></div><div style="flex:1;min-width:0;"><div style="font-size:10px;color:'+pcaC.diffAddText+';margin-bottom:4px;font-weight:600;">▶ 右侧（新）</div><div style="background:'+pcaC.diffAdd+';border:1px solid '+pcaC.diffAddBorder+';border-radius:6px;padding:8px 10px;max-height:250px;overflow-y:auto;font-size:11px;line-height:1.6;color:'+pcaC.diffAddText+';white-space:pre-wrap;word-break:break-all;">'+pcaEsc(rightContent)+'</div></div></div></div>';
    }
    var html = '<div style="padding:8px;"><div style="color:'+pcaC.gold+';font-size:11px;margin-bottom:6px;font-weight:600;">\ud83d\udcdd 内容差异（<span style="color:'+pcaC.diffDelText+'">红色=删除</span> <span style="color:'+pcaC.diffAddText+'">绿色=新增</span>）：</div><div style="background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:6px;padding:8px 0;max-height:300px;overflow-y:auto;font-size:12px;line-height:1.7;font-family:Consolas,monospace;">';
    diff.forEach(function(d){
        var prefix,bg,color;
        if(d.type==='add'){prefix='+';bg=pcaC.diffAdd;color=pcaC.diffAddText;}
        else if(d.type==='del'){prefix='-';bg=pcaC.diffDel;color=pcaC.diffDelText;}
        else{prefix=' ';bg='transparent';color=pcaC.dim;}
        html+='<div style="background:'+bg+';padding:1px 10px;color:'+color+';white-space:pre-wrap;word-break:break-all;"><span style="display:inline-block;width:16px;opacity:0.6;user-select:none;">'+prefix+'</span>'+pcaEsc(d.text||' ')+'</div>';
    });
    html += '</div>';
    var ac=0,dc=0; diff.forEach(function(d){if(d.type==='add')ac++;if(d.type==='del')dc++;});
    html += '<div style="margin-top:6px;font-size:11px;color:'+pcaC.dim+';">';
    if(ac)html+='<span style="color:'+pcaC.diffAddText+';">+'+ac+' 行新增</span> ';
    if(dc)html+='<span style="color:'+pcaC.diffDelText+';">-'+dc+' 行删除</span>';
    html += '</div></div>';
    return html;
}

var pcaState = {
    leftName:'', rightName:'',
    leftEntries:[], rightEntries:[],
    diffs:[], newItems:[],
    rightPresetData:null,
    leftPresetData:null,
    originalValues:{},
    activeTab:'diff', compared:false,
    allPresets:null,
    migrateSearch:'',
    migrateSelected:{},
    migrateNotes:[],
    migrateFavActive:false,
    migratePending:[],
    migrateUndoStack:[],
    migrateFilterStatus:'all',
    migrateFilterDiff:'all',
    migrateQueueExpanded:false,
    migrateFavGroups:{},
    activeFavGroupId:'',
    confHelpExpanded:false,
    editorClipText:'',
    editorClipFrom:'',
    editorState:null,
    editorDrafts:{},
    // 编辑器软换行开关：true = 自动换行（推荐，对手机和长行友好），false = 不换行（保留代码风格横向滚动）
    editorWrap:(function(){try{var v=localStorage.getItem('pca_editor_wrap_v1');return v===null?true:v==='1';}catch(e){return true;}})(),
    // ====== 条目编辑模块（单预设自改 / 反向迁移）======
    editTarget:'right',          // 'left' | 'right'：当前要编辑哪个预设
    editPending:[],              // 待修改队列：{ action: 'new' | 'overwrite' | 'delete' | 'reorder' | 'toggle', ... }
    editUndoStack:[],
    editSearch:'',
    editOnlyNew:false,           // 仅显示「目标独有」的新条目（替代旧的"新增条目"标签）
    editQueueExpanded:false,     // 待修改队列是否展开
};

var PCA_NOTES_KEY = 'pca_migrate_notes_v1';
var PCA_EDITOR_WRAP_KEY = 'pca_editor_wrap_v1';
function pcaLoadNotes() {
    try { var s = localStorage.getItem(PCA_NOTES_KEY); if(s) pcaState.migrateNotes = JSON.parse(s); else pcaState.migrateNotes = []; } catch(e) { pcaState.migrateNotes = []; }
}
function pcaSaveNotes() {
    try { localStorage.setItem(PCA_NOTES_KEY, JSON.stringify(pcaState.migrateNotes)); } catch(e) {}
}

function pcaInjectCSS() {
    var doc = pcaGetDoc();
    var old = doc.querySelector('#pca-style');
    if (old) old.remove();
    var s = doc.createElement('style');
    s.id = 'pca-style';
    // CSS 变量定义 — 让所有 .pca-* 样式自动跟随主题
    var rootVars = ':root,#pca-root{'
        + '--pca-bg:'+pcaC.bg+';'
        + '--pca-surface:'+pcaC.surface+';'
        + '--pca-surface-hi:'+pcaC.surfaceHi+';'
        + '--pca-border:'+pcaC.border+';'
        + '--pca-border-hi:'+pcaC.borderHi+';'
        + '--pca-primary:'+pcaC.primary+';'
        + '--pca-primary-dim:'+pcaC.primaryDim+';'
        + '--pca-accent:'+pcaC.accent+';'
        + '--pca-accent-dim:'+pcaC.accentDim+';'
        + '--pca-text:'+pcaC.text+';'
        + '--pca-text-dim:'+pcaC.textDim+';'
        + '--pca-text-off:'+pcaC.textOff+';'
        + '--pca-danger:'+pcaC.danger+';'
        + '--pca-warning:'+pcaC.warning+';'
        + '--pca-success:'+pcaC.success+';'
        + '--pca-info:'+pcaC.info+';'
        + '--pca-info-dim:'+pcaC.infoDim+';'
        + '--pca-input:'+pcaC.input+';'
        + '--pca-sheen:'+pcaC.sheen+';'
        + '--pca-font-sans:'+pcaC._fontSans+';'
        + '--pca-font-mono:'+pcaC._fontMono+';'
        + '--pca-radius-sm:6px;--pca-radius-md:10px;--pca-radius-lg:14px;'
        + '--pca-space-xs:4px;--pca-space-sm:8px;--pca-space-md:12px;--pca-space-lg:16px;--pca-space-xl:22px;'
        + '--pca-shadow-sm:0 2px 8px rgba(0,0,0,0.35);'
        + '--pca-shadow-md:0 4px 16px rgba(0,0,0,0.5);'
        + '--pca-shadow-lg:0 8px 40px rgba(0,0,0,0.6);'
        + '--pca-pop-w:min(420px,96vw);'
        + '--pca-modal-w:min(520px,96vw);'
        + '}';
    s.textContent = rootVars + '\n' + [
        'dialog.popup:has(#pca-root){background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important;margin:auto!important;width:fit-content!important;min-width:0!important;max-width:96vw!important;height:fit-content!important;min-height:0!important;max-height:96vh!important;max-height:96dvh!important;overflow:visible!important;inset:0!important}',
        'dialog.popup:has(#pca-root)::backdrop{background:rgba(0,0,0,0.65)!important}',
        'dialog.popup:has(#pca-root) .popup-body{background:transparent!important;border:none!important;padding:0!important;margin:0!important;display:contents!important}',
        'dialog.popup:has(#pca-root) .popup-content{background:transparent!important;padding:0!important;margin:0!important}',
        'dialog.popup:has(#pca-root) .popup-controls{display:none!important}',
        '#pca-root [data-pca-action]{cursor:pointer!important}',
        '#pca-root [data-pca-action]:hover{opacity:0.85}',
        // 让表单元素也继承主题字体
        '#pca-root input,#pca-root select,#pca-root button,#pca-root textarea{font-family:inherit!important}',
        // ====== Header 标题区（无毛玻璃，纯实色 + 底部一道暗红光带）======
        '#pca-root .pca-header-bar{position:relative;background:'+pcaC.bg+'!important}',
        '#pca-root .pca-header-bar::after{content:"";position:absolute;left:22px;right:22px;bottom:0;height:1px;background:linear-gradient(90deg,transparent 0%,'+pcaC.primaryDim+' 25%,'+pcaC.sheen+' 50%,'+pcaC.primaryDim+' 75%,transparent 100%);opacity:0.7;pointer-events:none}',
        // ====== 标题字体（祭坛石碑：20px / 800 / 字间距）======
        '#pca-root .pca-title{font-size:20px;font-weight:800;letter-spacing:1px;color:'+pcaC.text+';line-height:1.1;white-space:nowrap}',
        '#pca-root .pca-subtitle{font-size:10px;font-weight:500;color:'+pcaC.textDim+';letter-spacing:1.5px;text-transform:uppercase;margin-top:3px;line-height:1}',
        // 标题静态渐变（无动画，避免 background-clip:text 动画卡顿）
        '#pca-root .pca-title-gradient{background:linear-gradient(90deg,'+pcaC.text+' 0%,'+pcaC.text+' 25%,'+pcaC.accent+' 50%,'+pcaC.text+' 75%,'+pcaC.text+' 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}',
        // ====== Header 工具区按钮（无边框，hover 才出红色下划线）======
        '#pca-root .pca-tool-link{display:inline-block;font-size:12px;color:'+pcaC.textDim+';padding:4px 6px;cursor:pointer;border:none;background:transparent;position:relative;line-height:1.2;transition:color .15s ease}',
        '#pca-root .pca-tool-link::after{content:"";position:absolute;left:6px;right:6px;bottom:2px;height:1px;background:'+pcaC.primary+';transform:scaleX(0);transform-origin:center;transition:transform .15s ease}',
        '#pca-root .pca-tool-link:hover{color:'+pcaC.accent+'}',
        '#pca-root .pca-tool-link:hover::after{transform:scaleX(1)}',
        '#pca-root .pca-tool-select{font-size:11px;color:'+pcaC.textDim+';background:transparent;padding:4px 6px;border:none;outline:none;cursor:pointer;letter-spacing:0.3px}',
        '#pca-root .pca-tool-select:hover{color:'+pcaC.accent+'}',
        // ====== 幽灵按钮（次要动作）— hover 磨砂玻璃浮起 ======
        '#pca-root .pca-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;font-size:13px;font-weight:600;background:transparent;color:'+pcaC.textDim+';border:1px solid '+pcaC.border+';border-radius:3px;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,color .2s ease,background .2s ease,backdrop-filter .2s ease;white-space:nowrap;line-height:1.2;font-family:inherit;outline:none;-webkit-text-fill-color:'+pcaC.textDim+';letter-spacing:0.3px;will-change:transform}',
        '#pca-root .pca-btn:hover{border-color:'+pcaC.accent+';color:'+pcaC.accent+';-webkit-text-fill-color:'+pcaC.accent+';background:rgba(255,255,255,0.05);backdrop-filter:blur(8px) saturate(1.2);-webkit-backdrop-filter:blur(8px) saturate(1.2);transform:translateY(-1px);box-shadow:0 4px 12px rgba('+pcaHexToRgb(pcaC.primary)+',0.18),0 0 0 1px rgba(255,255,255,0.04) inset}',
        '#pca-root .pca-btn:active{transform:translateY(0);box-shadow:0 2px 6px rgba('+pcaHexToRgb(pcaC.primary)+',0.12)}',
        '#pca-root .pca-btn-danger{color:'+pcaC.danger+';border-color:rgba('+pcaHexToRgb(pcaC.danger)+',0.4);-webkit-text-fill-color:'+pcaC.danger+'}',
        '#pca-root .pca-btn-danger:hover{border-color:'+pcaC.danger+';color:'+pcaC.danger+';-webkit-text-fill-color:'+pcaC.danger+';background:rgba(255,255,255,0.05);backdrop-filter:blur(8px) saturate(1.2);-webkit-backdrop-filter:blur(8px) saturate(1.2);transform:translateY(-1px);box-shadow:0 4px 12px rgba('+pcaHexToRgb(pcaC.danger)+',0.22),0 0 0 1px rgba(255,255,255,0.04) inset}',
        // ====== 输入控件（input/textarea/select）— hover/focus 磨砂玻璃浮起 ======
        '#pca-root input,#pca-root textarea,#pca-root select{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease,backdrop-filter .2s ease;will-change:transform}',
        '#pca-root input:hover,#pca-root textarea:hover,#pca-root select:hover{background:rgba(255,255,255,0.04)!important;backdrop-filter:blur(8px) saturate(1.2);-webkit-backdrop-filter:blur(8px) saturate(1.2);transform:translateY(-1px);box-shadow:0 4px 12px rgba('+pcaHexToRgb(pcaC.primary)+',0.15),0 0 0 1px rgba(255,255,255,0.04) inset;border-color:'+pcaC.borderHi+'!important}',
        '#pca-root input:focus,#pca-root textarea:focus,#pca-root select:focus{background:rgba(255,255,255,0.05)!important;backdrop-filter:blur(10px) saturate(1.3);-webkit-backdrop-filter:blur(10px) saturate(1.3);transform:translateY(-1px);box-shadow:0 4px 14px rgba('+pcaHexToRgb(pcaC.primary)+',0.28),0 0 0 1px '+pcaC.primary+' inset;border-color:'+pcaC.primary+'!important;outline:none}',
        // hover/focus 浮起兜底（系统减弱动效）
        '@media (prefers-reduced-motion:reduce){',
        '  #pca-root .pca-btn:hover,#pca-root .pca-btn-danger:hover,#pca-root input:hover,#pca-root input:focus,#pca-root textarea:hover,#pca-root textarea:focus,#pca-root select:hover,#pca-root select:focus{transform:none!important}',
        '}',
        // ====== 主操作按钮（暗血碑：透明底 + 红边 + hover 血液渗透从左到右）======
        '#pca-root .pca-btn-primary{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 22px;font-size:13px;font-weight:700;color:'+pcaC.accent+';background:transparent;border:1px solid '+pcaC.primary+';border-radius:2px;cursor:pointer;overflow:hidden;font-family:inherit;outline:none;-webkit-text-fill-color:'+pcaC.accent+';letter-spacing:0.5px;transition:color .25s ease,-webkit-text-fill-color .25s ease,border-color .25s ease;z-index:0}',
        // ::before = 红色填充层，hover 时从左到右铺满
        '#pca-root .pca-btn-primary::before{content:"";position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,'+pcaC.primaryDim+' 0%,'+pcaC.primary+' 100%);transition:width .35s ease;z-index:-1}',
        '#pca-root .pca-btn-primary:hover{color:'+pcaC.text+';-webkit-text-fill-color:'+pcaC.text+';border-color:'+pcaC.accent+'}',
        '#pca-root .pca-btn-primary:hover::before{width:100%}',
        // ::after = 流光红横扫一道（hover 时触发，仅一次扫过）
        '#pca-root .pca-btn-primary::after{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 35%,rgba('+pcaHexToRgb(pcaC.sheen)+',0.55) 50%,transparent 65%);transform:translateX(-100%);transition:transform .7s ease;pointer-events:none}',
        '#pca-root .pca-btn-primary:hover::after{transform:translateX(100%)}',
        // 主按钮常驻边框红光呼吸
        '#pca-root .pca-btn-primary.pca-glow{box-shadow:0 0 0 1px rgba('+pcaHexToRgb(pcaC.primary)+',0.4),0 0 10px rgba('+pcaHexToRgb(pcaC.primary)+',0.18);animation:pcaGlowPulse 3.2s ease-in-out infinite}',
        '@keyframes pcaGlowPulse{0%,100%{box-shadow:0 0 0 1px rgba('+pcaHexToRgb(pcaC.primary)+',0.35),0 0 6px rgba('+pcaHexToRgb(pcaC.primary)+',0.12)}50%{box-shadow:0 0 0 1px rgba('+pcaHexToRgb(pcaC.sheen)+',0.6),0 0 14px rgba('+pcaHexToRgb(pcaC.sheen)+',0.35)}}',
        // ====== 标题：静态对角渐变（135°，左上→右下，淡淡过渡）======
        '#pca-root .pca-title-shine{background:linear-gradient(135deg,'+pcaC.text+' 0%,'+pcaC.textDim+' 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}',
        // ====== 条目悬停 — 左侧 2px 暗红色条带 ======
        '#pca-root .pca-entry-card{position:relative;transition:background .15s ease}',
        '#pca-root .pca-entry-card::before{content:"";position:absolute;left:0;top:8px;bottom:8px;width:0;background:'+pcaC.primary+';border-radius:2px;transition:width .15s ease;pointer-events:none;box-shadow:0 0 6px rgba('+pcaHexToRgb(pcaC.accent)+',0.4)}',
        '#pca-root .pca-entry-card:hover::before{width:2px}',
        '#pca-root .pca-entry-card:hover{background:rgba('+pcaHexToRgb(pcaC.primary)+',0.05)!important}',
        // ====== 卡片层（无边框，靠 8px gap + 微底色提升）======
        '#pca-root .pca-card{background:rgba(255,255,255,0.02);border-radius:4px;padding:10px 12px}',
        // ====== 独立 overlay 按钮（不带 #pca-root 前缀，给挂在 body 上的对话框用）======
        '.pca-modal-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;font-size:13px;font-weight:600;background:transparent;color:'+pcaC.textDim+';border:1px solid '+pcaC.border+';border-radius:3px;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,color .2s ease,background .2s ease,backdrop-filter .2s ease;white-space:nowrap;line-height:1.2;font-family:inherit;outline:none;letter-spacing:0.3px;will-change:transform}',
        '.pca-modal-btn:hover{border-color:'+pcaC.accent+';color:'+pcaC.accent+';background:rgba(255,255,255,0.05);backdrop-filter:blur(8px) saturate(1.2);-webkit-backdrop-filter:blur(8px) saturate(1.2);transform:translateY(-1px);box-shadow:0 4px 12px rgba('+pcaHexToRgb(pcaC.primary)+',0.18),0 0 0 1px rgba(255,255,255,0.04) inset}',
        '.pca-modal-btn:active{transform:translateY(0);box-shadow:0 2px 6px rgba('+pcaHexToRgb(pcaC.primary)+',0.12)}',
        '.pca-modal-btn-primary{position:relative;display:inline-flex;align-items:center;gap:6px;padding:7px 18px;font-size:13px;font-weight:700;background:transparent;color:'+pcaC.accent+';border:1px solid '+pcaC.primary+';border-radius:2px;cursor:pointer;overflow:hidden;letter-spacing:0.5px;line-height:1.2;font-family:inherit;outline:none;transition:color .25s ease,border-color .25s ease,box-shadow .25s ease;z-index:0;white-space:nowrap}',
        '.pca-modal-btn-primary::before{content:"";position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,'+pcaC.primaryDim+' 0%,'+pcaC.primary+' 100%);transition:width .35s ease;z-index:-1}',
        '.pca-modal-btn-primary:hover{color:'+pcaC.text+';border-color:'+pcaC.accent+';box-shadow:0 4px 14px rgba('+pcaHexToRgb(pcaC.primary)+',0.32)}',
        '.pca-modal-btn-primary:hover::before{width:100%}',
        '.pca-modal-btn-primary:active{transform:translateY(1px)}',
        // ====== 给独立 overlay 内的 .pca-btn / .pca-btn-primary / .pca-btn-danger 兜底（无 #pca-root 前缀）======
        '.pca-modal-overlay .pca-btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;font-size:13px;font-weight:600;background:transparent;color:'+pcaC.textDim+';border:1px solid '+pcaC.border+';border-radius:3px;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,color .2s ease,background .2s ease,backdrop-filter .2s ease;white-space:nowrap;line-height:1.2;font-family:inherit;outline:none;-webkit-text-fill-color:'+pcaC.textDim+';letter-spacing:0.3px;will-change:transform}',
        '.pca-modal-overlay .pca-btn:hover{border-color:'+pcaC.accent+';color:'+pcaC.accent+';-webkit-text-fill-color:'+pcaC.accent+';background:rgba(255,255,255,0.05);backdrop-filter:blur(8px) saturate(1.2);-webkit-backdrop-filter:blur(8px) saturate(1.2);transform:translateY(-1px);box-shadow:0 4px 12px rgba('+pcaHexToRgb(pcaC.primary)+',0.18),0 0 0 1px rgba(255,255,255,0.04) inset}',
        '.pca-modal-overlay .pca-btn:active{transform:translateY(0);box-shadow:0 2px 6px rgba('+pcaHexToRgb(pcaC.primary)+',0.12)}',
        '.pca-modal-overlay .pca-btn-danger{color:'+pcaC.danger+';border-color:rgba('+pcaHexToRgb(pcaC.danger)+',0.4);-webkit-text-fill-color:'+pcaC.danger+'}',
        '.pca-modal-overlay .pca-btn-danger:hover{border-color:'+pcaC.danger+';color:'+pcaC.danger+';-webkit-text-fill-color:'+pcaC.danger+';box-shadow:0 4px 12px rgba('+pcaHexToRgb(pcaC.danger)+',0.22),0 0 0 1px rgba(255,255,255,0.04) inset}',
        '.pca-modal-overlay .pca-btn-primary{position:relative;display:inline-flex;align-items:center;gap:6px;padding:8px 22px;font-size:13px;font-weight:700;background:transparent;color:'+pcaC.accent+';border:1px solid '+pcaC.primary+';border-radius:2px;cursor:pointer;overflow:hidden;letter-spacing:0.5px;line-height:1.2;font-family:inherit;outline:none;transition:color .25s ease,border-color .25s ease,box-shadow .25s ease;z-index:0;white-space:nowrap}',
        '.pca-modal-overlay .pca-btn-primary::before{content:"";position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,'+pcaC.primaryDim+' 0%,'+pcaC.primary+' 100%);transition:width .35s ease;z-index:-1}',
        '.pca-modal-overlay .pca-btn-primary:hover{color:'+pcaC.text+';border-color:'+pcaC.accent+';box-shadow:0 4px 14px rgba('+pcaHexToRgb(pcaC.primary)+',0.32)}',
        '.pca-modal-overlay .pca-btn-primary:hover::before{width:100%}',
        '.pca-modal-overlay .pca-btn-primary:active{transform:translateY(1px)}',
        // ====== 滑块开关（启用/禁用）======
        '.pca-toggle{position:relative;display:inline-block;width:34px;height:18px;flex-shrink:0;cursor:pointer;vertical-align:middle}',
        '.pca-toggle input{opacity:0;width:0;height:0;position:absolute}',
        '.pca-toggle .pca-toggle-slider{position:absolute;inset:0;background:'+pcaC.surfaceHi+';border:1px solid '+pcaC.border+';border-radius:18px;transition:background .2s ease,border-color .2s ease}',
        '.pca-toggle .pca-toggle-slider::before{content:"";position:absolute;left:2px;top:1px;width:12px;height:12px;background:'+pcaC.textDim+';border-radius:50%;transition:transform .2s ease,background .2s ease}',
        '.pca-toggle input:checked + .pca-toggle-slider{background:rgba('+pcaHexToRgb(pcaC.primary)+',0.4);border-color:'+pcaC.primary+'}',
        '.pca-toggle input:checked + .pca-toggle-slider::before{transform:translateX(16px);background:'+pcaC.accent+'}',
        '.pca-toggle:hover .pca-toggle-slider{box-shadow:0 0 0 3px rgba('+pcaHexToRgb(pcaC.primary)+',0.12)}',
        // ====== 减弱动效兜底 ======
        '@media (prefers-reduced-motion:reduce){',
        '  #pca-root .pca-btn-primary::before,#pca-root .pca-btn-primary::after,#pca-root .pca-btn-primary.pca-glow{animation:none!important;transition:none!important}',
        '}',
        '.pca-insert-line{transition:all 0.15s ease;cursor:pointer!important}',
        '.pca-insert-line:hover{background:'+pcaC.migrateBg+'!important;border-color:'+pcaC.migrateBorder+'!important}',
        '.pca-insert-line:hover .pca-insert-icon{color:'+pcaC.migrate+'!important;transform:scale(1.3)}',
        '.pca-insert-line [data-pca-action]{cursor:pointer!important}',
        '#pca-root .pca-entry-item{transition:background 0.1s}',
        '#pca-root .pca-entry-item:hover{background:rgba(255,255,255,0.03)!important}',
        '#pca-root .pca-search-input{background:'+pcaC.input+'!important;color:'+pcaC.text+'!important;border:1px solid '+pcaC.border+'!important;border-radius:6px!important;padding:6px 10px!important;font-size:12px!important;outline:none!important;width:100%!important}',
        '#pca-root .pca-search-input:focus{border-color:'+pcaC.pink+'!important}',
        '#pca-root .pca-search-input::placeholder{color:'+pcaC.dim+'!important}',
        '#pca-root .pca-note-tag{display:inline-flex;align-items:center;gap:4px;background:'+pcaC.card2+';border:1px solid '+pcaC.border+';border-radius:16px;padding:3px 10px 3px 8px;font-size:12px;color:'+pcaC.text+';margin:3px;transition:all 0.15s;max-width:100%;overflow:hidden}',
        '#pca-root .pca-note-tag:hover{border-color:'+pcaC.migrate+'}',
        '#pca-root .pca-note-tag .pca-note-x{color:'+pcaC.dim+';cursor:pointer;font-size:14px;line-height:1;padding:0 2px;flex-shrink:0}',
        '#pca-root .pca-note-tag .pca-note-x:hover{color:'+pcaC.danger+'}',
        '#pca-root .pca-note-tag .pca-note-find{color:'+pcaC.migrate+';cursor:pointer;font-size:11px;flex-shrink:0}',
        '#pca-root .pca-note-tag .pca-note-find:hover{color:'+pcaC.pink+'}',
        '#pca-root .pca-note-tag .pca-note-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
        '.pca-modal-overlay{position:fixed!important;inset:0!important;z-index:2147483647!important;background:rgba(0,0,0,0.75)!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:10px!important}',
        '#pca-editor-overlay{cursor:default!important}',
        '#pca-editor-overlay *{box-sizing:border-box}',
        '#pca-editor-overlay textarea{background:'+pcaC.input+'!important;color:'+pcaC.text+'!important;border:1px solid '+pcaC.border+'!important;border-radius:6px!important;padding:10px 12px!important;font-size:14px!important;line-height:1.6!important;font-family:Consolas,Menlo,monospace!important;outline:none!important;resize:vertical!important;width:100%!important;box-sizing:border-box!important;-webkit-text-fill-color:'+pcaC.text+'!important;opacity:1!important}',
        '#pca-editor-overlay textarea:focus{border-color:'+pcaC.migrate+'!important}',
        '#pca-editor-overlay [data-pca-action]{cursor:pointer!important}',
        '#pca-editor-overlay [data-pca-action]:hover{opacity:0.85}',
        '#pca-editor-overlay button{cursor:pointer!important;font-family:inherit!important}',
        '#pca-editor-overlay .pca-ed-btn{font-size:12px!important;padding:5px 10px!important;background:'+pcaC.card2+'!important;color:'+pcaC.text+'!important;border:1px solid '+pcaC.border+'!important;border-radius:5px!important;cursor:pointer!important;user-select:none!important;display:inline-block!important;line-height:1.4!important;-webkit-text-fill-color:'+pcaC.text+'!important}',
        '#pca-editor-overlay .pca-ed-btn:hover{border-color:'+pcaC.migrate+'!important;color:'+pcaC.migrate+'!important;-webkit-text-fill-color:'+pcaC.migrate+'!important}',
        '#pca-editor-overlay .pca-ed-tab{font-size:12px!important;padding:6px 12px!important;border-radius:6px 6px 0 0!important;cursor:pointer!important;user-select:none!important;border:1px solid '+pcaC.border+'!important;border-bottom:none!important;background:'+pcaC.card2+'!important;color:'+pcaC.dim+'!important;display:inline-block!important;-webkit-text-fill-color:'+pcaC.dim+'!important}',
        '#pca-editor-overlay .pca-ed-tab.active{background:'+pcaC.input+'!important;color:'+pcaC.migrate+'!important;border-color:'+pcaC.migrateBorder+'!important;-webkit-text-fill-color:'+pcaC.migrate+'!important}',
        '#pca-editor-overlay .pca-ed-diff-line{cursor:pointer!important;transition:filter 0.1s}',
        '#pca-editor-overlay .pca-ed-diff-line:hover{filter:brightness(1.3)}',
        '#pca-editor-overlay .pca-ed-diff-line:hover .pca-ed-copy-icon{opacity:1!important}',
        // ====== 全设备响应式 ======
        // 平板 / 小笔记本（≤900px）：内边距收紧
        '@media(max-width:900px){',
        '  #pca-root{font-size:13px}',
        '  #pca-root .pca-pad-x{padding-left:14px!important;padding-right:14px!important}',
        '}',
        // 手机大屏（≤640px）— 用 dvh（动态视口高度）避开浏览器导航栏占位
        '@media(max-width:640px){',
        '  :root,#pca-root{--pca-space-xl:14px;--pca-space-lg:12px;--pca-space-md:10px}',
        '  #pca-root{width:100vw!important;max-width:100vw!important;max-height:100vh!important;max-height:100dvh!important;border-radius:0!important}',
        '  #pca-root .pca-entry-name-id{flex-direction:column!important;align-items:flex-start!important;gap:2px!important}',
        '  #pca-root .pca-eid-tag{max-width:100%!important;overflow:hidden;text-overflow:ellipsis;font-size:9px!important}',
        '  #pca-root .pca-entry-name{white-space:normal!important;word-break:break-word!important}',
        '  #pca-root .pca-toolbar{flex-wrap:wrap!important;gap:6px!important}',
        '  #pca-root .pca-toolbar > *{flex:0 0 auto!important}',
        '  #pca-root .pca-tabs-bar{overflow-x:auto!important;overflow-y:hidden!important;flex-wrap:nowrap!important;-webkit-overflow-scrolling:touch}',
        '  #pca-root .pca-tabs-bar > *{flex-shrink:0!important;padding:8px 12px!important;font-size:12px!important}',
        '  #pca-root .pca-filter-row{gap:6px!important}',
        '  #pca-root .pca-filter-row > *{font-size:11px!important;padding:3px 8px!important}',
        '  #pca-root .pca-fav-tabs{overflow-x:auto;flex-wrap:nowrap!important;-webkit-overflow-scrolling:touch;padding-bottom:4px}',
        '  #pca-root .pca-fav-tabs > *{flex-shrink:0!important}',
        '  #pca-editor-overlay .pca-ed-modal{width:100vw!important;max-width:100vw!important;max-height:100vh!important;height:100vh!important;max-height:100dvh!important;height:100dvh!important;border-radius:0!important}',
        '  #pca-editor-overlay textarea{font-size:13px!important}',
        '  #pca-editor-overlay .pca-ed-toolbar{flex-wrap:wrap!important;gap:4px!important}',
        '}',
        // 极窄屏（≤414px，常见手机）：进一步紧凑
        '@media(max-width:414px){',
        '  #pca-root{font-size:12px}',
        '  #pca-root h1,#pca-root h2,#pca-root h3{font-size:14px!important}',
        '  #pca-root .pca-pad-x{padding-left:10px!important;padding-right:10px!important}',
        '  #pca-root .pca-fav-tabs > *{font-size:10px!important;padding:2px 8px!important}',
        '  #pca-root button,#pca-root .pca-btn{font-size:12px!important;padding:5px 10px!important}',
        '  #pca-root select{font-size:12px!important;padding:6px 8px!important}',
        '  #pca-root .pca-search-input{font-size:12px!important;padding:5px 8px!important}',
        '}',
        // 折叠屏极窄竖屏（≤320px）
        '@media(max-width:320px){',
        '  #pca-root .pca-pad-x{padding-left:8px!important;padding-right:8px!important}',
        '  #pca-root .pca-tabs-bar > *{padding:6px 10px!important;font-size:11px!important}',
        '}',
    ].join('\n');
    doc.head.appendChild(s);
}

function pcaSetupButton() {
    var doc = pcaGetDoc();
    var old = doc.querySelector('#pca-wand-btn'); if (old) old.remove();
    var menu = doc.querySelector('#extensionsMenu');
    if (!menu) { setTimeout(pcaSetupButton, 500); return; }
    var btn = doc.createElement('div');
    btn.id = 'pca-wand-btn';
    btn.className = 'list-group-item flex-container flexGap5 interactable';
    btn.tabIndex = 0;
    btn.innerHTML = '<div class="fa-fw fa-solid fa-code-compare extensionsMenuExtensionButton"></div> ✧ 预设对比';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', function(){ pcaOpenPanel(); });
    menu.appendChild(btn);
}

function pcaGetPresetNames() {
    var items = [], doc = pcaGetDoc(), sel = null;
    try { var ctx = SillyTavern.getContext(); var pm = ctx.getPresetManager(); if (pm && pm.select) sel = (pm.select.length !== undefined) ? pm.select[0] : pm.select; } catch(e) {}
    if (!sel) sel = doc.querySelector('#settings_preset_openai');
    if (sel && sel.options) { for (var i=0;i<sel.options.length;i++) { var v=(sel.options[i].value||'').trim(),t=(sel.options[i].text||sel.options[i].textContent||'').trim(); if(v||t) items.push({value:v,text:t}); } }
    return items;
}

async function pcaFetchAllPresets() {
    try {
        var res = await fetch('/api/settings/get',{method:'POST',headers:pcaGetHeaders(),body:JSON.stringify({})});
        if (!res.ok) throw new Error('HTTP '+res.status);
        var data = await res.json();
        if (!data.openai_settings||!data.openai_setting_names) throw new Error('无openai_settings');
        var rawList = data.openai_settings, names = data.openai_setting_names, parsedList = [];
        for (var i=0;i<rawList.length;i++) { var item=rawList[i]; if(typeof item==='string'){try{item=JSON.parse(item);}catch(e){parsedList.push(null);continue;}} parsedList.push(item); }
        return {names:names,list:parsedList};
    } catch(e) { pcaLog('获取失败:'+e.message); return null; }
}

function pcaFindPreset(all, name) {
    if(!all) return null;
    var idx=all.names.indexOf(name);
    if(idx!==-1&&all.list[idx]) return JSON.parse(JSON.stringify(all.list[idx]));
    var num=parseInt(name,10);
    if(!isNaN(num)&&num>=0&&num<all.list.length&&all.list[num]) return JSON.parse(JSON.stringify(all.list[num]));
    for(var i=0;i<all.names.length;i++){if(all.names[i].toLowerCase()===name.toLowerCase()) return JSON.parse(JSON.stringify(all.list[i]));}
    return null;
}

function pcaGetOrder(po) {
    if(!po)return[];
    if(!Array.isArray(po)){if(typeof po==='object'){var ks=Object.keys(po);for(var i=0;i<ks.length;i++){if(Array.isArray(po[ks[i]]))return po[ks[i]];}}return[];}
    if(!po.length)return[];
    if(po[0]&&po[0].order&&Array.isArray(po[0].order))return po[0].order;
    if(po[0]&&po[0].identifier!==undefined)return po;
    return[];
}

function pcaExtract(preset) {
    if(!preset)return[];
    var prompts=preset.prompts||[],order=pcaGetOrder(preset.prompt_order);
    var pMap={};prompts.forEach(function(p){if(p&&p.identifier)pMap[p.identifier]=p;});
    var entries=[],seen={};
    order.forEach(function(item){if(!item||!item.identifier)return;var p=pMap[item.identifier];entries.push({id:item.identifier,name:p?(p.name||item.identifier):item.identifier,enabled:!!item.enabled,content:p?(p.content||''):'',role:p?(p.role||''):'',marker:p?!!p.marker:false});seen[item.identifier]=true;});
    prompts.forEach(function(p){if(p&&p.identifier&&!seen[p.identifier])entries.push({id:p.identifier,name:p.name||p.identifier,enabled:false,content:p.content||'',role:p.role||'',marker:!!p.marker});});
    return entries;
}

function pcaCompare(left, right) {
    var diffs=[],news=[];
    var leftById={};left.forEach(function(e){leftById[e.id]=e;});
    var leftByName={};left.forEach(function(e){if(!leftByName[e.name])leftByName[e.name]=[];leftByName[e.name].push(e);});
    right.forEach(function(r){
        var ml=leftById[r.id];
        if(ml){if(ml.enabled!==r.enabled)diffs.push({left:ml,right:r});return;}
        var nms=leftByName[r.name];
        if(nms&&nms.length>0){nms.forEach(function(l){if(l.enabled!==r.enabled)diffs.push({left:l,right:r});});return;}
        news.push({right:r});
    });
    return {diffs:diffs,newItems:news};
}

function pcaGetEnabled(preset,id){var order=pcaGetOrder(preset.prompt_order);for(var i=0;i<order.length;i++){if(order[i].identifier===id)return!!order[i].enabled;}return false;}
function pcaSetEnabled(preset,id,val){var order=pcaGetOrder(preset.prompt_order);for(var i=0;i<order.length;i++){if(order[i].identifier===id){order[i].enabled=val;return;}}}

async function pcaSavePresetToFile(preset, name) {
    var saveData = {};
    var keys = Object.keys(preset);
    for (var k = 0; k < keys.length; k++) {
        saveData[keys[k]] = preset[keys[k]];
    }
    saveData.preset_name = name;

    pcaLog('保存数据字段数: ' + Object.keys(saveData).length + ' prompts: ' + (saveData.prompts?saveData.prompts.length:0));

    // 优先用ST自己的savePreset方法
    try {
        var ctx = SillyTavern.getContext();
        var pm = ctx.getPresetManager();
        if (pm && typeof pm.savePreset === 'function') {
            pcaLog('使用 pm.savePreset, apiId=' + pm.apiId);
            await pm.savePreset(name, saveData, { skipUpdate: false });
            pcaLog('✓ pm.savePreset 完成');
            return true;
        }
    } catch(e) {
        pcaLog('pm.savePreset 失败: ' + e.message + ', fallback to fetch');
    }

    // 备用：直接fetch
    try {
        var res = await fetch('/api/presets/save', {
            method: 'POST',
            headers: pcaGetHeaders(),
            body: JSON.stringify({ preset: saveData, name: name, apiId: 'openai' })
        });
        if (res.ok) {
            pcaLog('文件保存成功 via fetch status=' + res.status);
            return true;
        }
        pcaLog('端点返回: ' + res.status + ' ' + res.statusText);
    } catch(e) {
        pcaLog('端点异常: ' + e.message);
    }
    return false;
}

function pcaGetPresetSelect() {
    var doc = pcaGetDoc();
    var sel = null;
    try { var ctx = SillyTavern.getContext(); var pm = ctx.getPresetManager(); if (pm && pm.select) sel = (pm.select.length !== undefined) ? pm.select[0] : pm.select; } catch(e) {}
    if (!sel) sel = doc.querySelector('#settings_preset_openai');
    return sel;
}

function pcaIsCurrentPreset(name) {
    var sel = pcaGetPresetSelect();
    if (!sel || sel.selectedIndex < 0) return false;
    var curName = (sel.options[sel.selectedIndex].text || '').trim();
    return curName === name.trim();
}

function pcaForceRefreshPromptManagerUI() {
    var doc = pcaGetDoc();
    var $j = pcaGetJQ();
    var sel = doc.querySelector('#settings_preset_openai');
    if (!sel) return;
    if ($j) {
        try { $j(sel).trigger('change'); pcaLog('✓ 已触发 select change'); }
        catch(e) { pcaLog('jQuery trigger 失败: ' + e.message); }
    } else {
        try { sel.dispatchEvent(new Event('change', { bubbles: true })); } catch(e) {}
    }
}

async function pcaSyncAndSave(presetData, name) {
    pcaLog('保存: "' + name + '" prompts=' + (presetData.prompts?presetData.prompts.length:0));
    
    // 安全检查：拒绝保存空数据
    if (!presetData || !presetData.prompts || presetData.prompts.length === 0) {
        pcaLog('❌ 拒绝保存：prompts为空');
        toastr.error('数据异常，已阻止保存（防止清空预设）');
        return false;
    }
    
    // 只保存文件，不碰live对象，不调updatePreset
    var saved = await pcaSavePresetToFile(presetData, name);
    if (!saved) return false;
    
    pcaLog('✓ 文件已保存');
    
    // 如果是当前预设，提示用户切换刷新
    if (pcaIsCurrentPreset(name)) {
        toastr.success('保存成功！', '', {timeOut: 6000});
    } else {
        toastr.success('保存成功！');
    }
    return true;
}

// ========== 取当前迁移视图下"可见的左侧条目 id 列表" ==========
function pcaGetVisibleLeftEntryIds() {
    var leftEntries = pcaState.leftEntries || [];
    var rightEntries = pcaExtract(pcaState.rightPresetData);
    var rightById = {}, rightByName = {};
    rightEntries.forEach(function(e) { rightById[e.id] = e; rightByName[e.name] = e; });
    // 匹配优先级：name 优先（用户视角），id 兜底
    var filterNames = (typeof pcaGetMigrateFilterNames === 'function') ? pcaGetMigrateFilterNames() : null;
    var ids = [];
    leftEntries.forEach(function(e) {
        if (filterNames && typeof pcaMatchesFilter === 'function' && !pcaMatchesFilter(e.name, filterNames)) return;
        var rightMatch = rightByName[e.name] || rightById[e.id] || null;
        var exists = !!rightMatch;
        var contentSame = rightMatch ? pcaContentEqual(e.content, rightMatch.content) : false;
        if (pcaState.migrateFilterStatus === 'exists' && !exists) return;
        if (pcaState.migrateFilterStatus === 'new' && exists) return;
        if (pcaState.migrateFilterDiff === 'diff' && exists && contentSame) return;
        if (pcaState.migrateFilterDiff === 'same' && (!exists || !contentSame)) return;
        ids.push(e.id);
    });
    return ids;
}

// ========== 智能定位算法（双锚点） ==========
// 给定旧版条目 srcEntry，返回它在新版应插入的位置
// 返回: { insertIndex, insertAfterName, confidence: 'high'|'medium'|'low', warn: '...' }
function pcaResolveSamePosition(srcEntry, leftEntries, rightEntries) {
    var srcIdx = -1;
    for (var i = 0; i < leftEntries.length; i++) {
        if (leftEntries[i].id === srcEntry.id) { srcIdx = i; break; }
    }
    if (srcIdx < 0) {
        return { insertIndex: rightEntries.length, insertAfterName: '', insertBeforeName: '', confidence: 'low', warn: '在旧版中找不到该条目，已追加到末尾' };
    }

    // 在右侧找到候选条目的位置（id 优先，name 兜底）
    function findInRight(cand) {
        for (var ri = 0; ri < rightEntries.length; ri++) {
            if (rightEntries[ri].id === cand.id) return ri;
        }
        for (var rj = 0; rj < rightEntries.length; rj++) {
            if (rightEntries[rj].name === cand.name) return rj;
        }
        return -1;
    }

    // 向上找最近共有前驱
    var prevAnchor = null;
    for (var pi = srcIdx - 1; pi >= 0; pi--) {
        var rIdxP = findInRight(leftEntries[pi]);
        if (rIdxP >= 0) { prevAnchor = { name: leftEntries[pi].name, rightIndex: rIdxP }; break; }
    }
    // 向下找最近共有后继
    var nextAnchor = null;
    for (var ni = srcIdx + 1; ni < leftEntries.length; ni++) {
        var rIdxN = findInRight(leftEntries[ni]);
        if (rIdxN >= 0) { nextAnchor = { name: leftEntries[ni].name, rightIndex: rIdxN }; break; }
    }

    if (prevAnchor && nextAnchor) {
        if (prevAnchor.rightIndex < nextAnchor.rightIndex) {
            return { insertIndex: prevAnchor.rightIndex + 1, insertAfterName: prevAnchor.name, insertBeforeName: nextAnchor.name, confidence: 'high', warn: '' };
        }
        return { insertIndex: prevAnchor.rightIndex + 1, insertAfterName: prevAnchor.name, insertBeforeName: '', confidence: 'medium', warn: '新版顺序与旧版不一致，按"' + prevAnchor.name + '"之后插入' };
    }
    if (prevAnchor) {
        return { insertIndex: prevAnchor.rightIndex + 1, insertAfterName: prevAnchor.name, insertBeforeName: '', confidence: 'medium', warn: '' };
    }
    if (nextAnchor) {
        // posLabel 已会显示"在 xx 前"，warn 留空避免重复信息
        return { insertIndex: nextAnchor.rightIndex, insertAfterName: '', insertBeforeName: nextAnchor.name, confidence: 'medium', warn: '' };
    }
    if (srcIdx === 0) {
        return { insertIndex: 0, insertAfterName: '', insertBeforeName: '', confidence: 'low', warn: '无共有邻居，已置于新版顶部' };
    }
    return { insertIndex: rightEntries.length, insertAfterName: '', insertBeforeName: '', confidence: 'low', warn: '无共有邻居，已追加到新版末尾' };
}

// ========== 收藏夹分组 ==========
// 数据结构：pcaState.migrateFavGroups = { groupId: { id, name, color, notes:[name,...] } }
// pcaState.migrateNotes 视为"未分组"（虚拟分组 id=''），向后兼容旧数据
var PCA_FAV_GROUPS_KEY = 'pca_migrate_fav_groups_v1';
var PCA_FAV_PALETTE = ['#d4a853','#8eb8e5','#6ecf8a','#e07090','#b08ee5','#e0a070','#5fb8c5','#cc6677'];

function pcaLoadFavGroups() {
    try { var s = localStorage.getItem(PCA_FAV_GROUPS_KEY); if (s) pcaState.migrateFavGroups = JSON.parse(s); } catch(e) {}
    if (!pcaState.migrateFavGroups || typeof pcaState.migrateFavGroups !== 'object') pcaState.migrateFavGroups = {};
}
function pcaSaveFavGroups() {
    try { localStorage.setItem(PCA_FAV_GROUPS_KEY, JSON.stringify(pcaState.migrateFavGroups || {})); } catch(e) {}
}
function pcaGenFavGroupId() {
    return 'g' + Date.now().toString(36) + Math.floor(Math.random()*1000).toString(36);
}
// 生成新条目 ID（UUID v4 风格，跟 ST 的 identifier 兼容）
function pcaGenEntryId() {
    try {
        if (typeof crypto !== 'undefined' && crypto && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
    } catch(e) {}
    // 兜底：手写 v4 UUID
    var hex = '0123456789abcdef';
    var s = '';
    for (var i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) { s += '-'; }
        else if (i === 14) { s += '4'; }
        else if (i === 19) { s += hex[(Math.random()*4|0) + 8]; }
        else { s += hex[Math.random()*16|0]; }
    }
    return s;
}
function pcaCreateFavGroup(name, color) {
    name = (name || '').trim();
    if (!name) { toastr.warning('请输入分组名'); return null; }
    pcaLoadFavGroups();
    // 重名检查
    var groups = pcaState.migrateFavGroups;
    var keys = Object.keys(groups);
    for (var i = 0; i < keys.length; i++) {
        if (groups[keys[i]].name === name) { toastr.warning('已有同名分组：' + name); return keys[i]; }
    }
    var id = pcaGenFavGroupId();
    var pickedColor = color || PCA_FAV_PALETTE[keys.length % PCA_FAV_PALETTE.length];
    groups[id] = { id: id, name: name, color: pickedColor, notes: [] };
    pcaSaveFavGroups();
    return id;
}
function pcaRenameFavGroup(groupId, newName) {
    pcaLoadFavGroups();
    var g = pcaState.migrateFavGroups[groupId];
    if (!g) return false;
    newName = (newName || '').trim();
    if (!newName) return false;
    g.name = newName;
    pcaSaveFavGroups();
    return true;
}
function pcaSetFavGroupColor(groupId, color) {
    pcaLoadFavGroups();
    var g = pcaState.migrateFavGroups[groupId];
    if (!g) return false;
    g.color = color;
    pcaSaveFavGroups();
    return true;
}
function pcaDeleteFavGroup(groupId) {
    pcaLoadFavGroups();
    if (!pcaState.migrateFavGroups[groupId]) return false;
    delete pcaState.migrateFavGroups[groupId];
    pcaSaveFavGroups();
    if (pcaState.activeFavGroupId === groupId) pcaState.activeFavGroupId = '';
    return true;
}
// 把若干条目名加入指定分组（groupId='' 表示加入未分组）
function pcaAddToFavGroup(entryNames, groupId) {
    if (!entryNames || entryNames.length === 0) return 0;
    var added = 0;
    if (!groupId) {
        // 未分组：写入 migrateNotes
        if (!pcaState.migrateNotes) pcaState.migrateNotes = [];
        entryNames.forEach(function(n) {
            if (pcaState.migrateNotes.indexOf(n) < 0) { pcaState.migrateNotes.push(n); added++; }
        });
        pcaSaveNotes();
        return added;
    }
    pcaLoadFavGroups();
    var g = pcaState.migrateFavGroups[groupId];
    if (!g) return 0;
    if (!g.notes) g.notes = [];
    entryNames.forEach(function(n) {
        if (g.notes.indexOf(n) < 0) { g.notes.push(n); added++; }
    });
    pcaSaveFavGroups();
    return added;
}
// 从指定分组移除某条目
function pcaRemoveFromFavGroup(entryName, groupId) {
    if (!groupId) {
        if (!pcaState.migrateNotes) return false;
        var idx = pcaState.migrateNotes.indexOf(entryName);
        if (idx < 0) return false;
        pcaState.migrateNotes.splice(idx, 1);
        pcaSaveNotes();
        return true;
    }
    pcaLoadFavGroups();
    var g = pcaState.migrateFavGroups[groupId];
    if (!g || !g.notes) return false;
    var i = g.notes.indexOf(entryName);
    if (i < 0) return false;
    g.notes.splice(i, 1);
    pcaSaveFavGroups();
    return true;
}
function pcaListFavGroups() {
    pcaLoadFavGroups();
    return pcaState.migrateFavGroups || {};
}
// 取当前激活分组下的条目名数组（用于"显示全部收藏"过滤）
function pcaGetActiveFavNames() {
    var aid = pcaState.activeFavGroupId || '';
    if (!aid) return (pcaState.migrateNotes || []).slice();
    pcaLoadFavGroups();
    var g = pcaState.migrateFavGroups[aid];
    return (g && g.notes) ? g.notes.slice() : [];
}
// 取所有收藏（跨分组合并），用于"显示全部收藏"按钮
function pcaGetAllFavNames() {
    var all = (pcaState.migrateNotes || []).slice();
    pcaLoadFavGroups();
    var groups = pcaState.migrateFavGroups || {};
    Object.keys(groups).forEach(function(gid) {
        (groups[gid].notes || []).forEach(function(n) { if (all.indexOf(n) < 0) all.push(n); });
    });
    return all;
}

// 弹出"加入收藏夹分组"选择对话框（批量）
function pcaRenderFavGroupPicker(entryNames, callback) {
    if (!entryNames || entryNames.length === 0) { toastr.warning('请先选择条目'); return; }
    pcaLoadFavGroups();
    var doc = pcaGetDoc();
    var existing = doc.querySelector('#pca-fav-picker-overlay');
    if (existing) existing.remove();

    var groups = pcaState.migrateFavGroups || {};
    var groupIds = Object.keys(groups);

    var html = '<div class="pca-modal-overlay" id="pca-fav-picker-overlay">';
    html += '<div style="background:'+pcaC.bg+';border:1px solid '+pcaC.border+';border-radius:14px;width:min(480px,96vw);max-height:min(80vh,640px);max-height:min(80dvh,640px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.6);">';
    html += '<div style="padding:14px 20px;border-bottom:1px solid '+pcaC.border+';flex-shrink:0;">';
    html += '<div style="font-size:15px;font-weight:700;color:'+pcaC.gold+';margin-bottom:4px;">⭐ 加入收藏夹分组</div>';
    html += '<div style="font-size:12px;color:'+pcaC.dim+';">已选 '+entryNames.length+' 项 · 选择目标分组</div>';
    html += '</div>';
    html += '<div style="flex:1;overflow-y:auto;padding:12px 16px;">';
    // 未分组
    var ungroupedCount = (pcaState.migrateNotes || []).length;
    html += '<div data-pca-action="favp-pick" data-pca-gid="" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid '+pcaC.border+';border-radius:8px;margin-bottom:6px;background:'+pcaC.card+';cursor:pointer;">';
    html += '<span style="width:14px;height:14px;border-radius:3px;background:'+pcaC.dim+';flex-shrink:0;"></span>';
    html += '<span style="flex:1;font-size:13px;color:'+pcaC.text+';">📂 未分组</span>';
    html += '<span style="font-size:11px;color:'+pcaC.dim+';">'+ungroupedCount+' 项</span>';
    html += '</div>';
    // 已有分组
    groupIds.forEach(function(gid) {
        var g = groups[gid];
        html += '<div data-pca-action="favp-pick" data-pca-gid="'+pcaAttr(gid)+'" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid '+pcaC.border+';border-radius:8px;margin-bottom:6px;background:'+pcaC.card+';cursor:pointer;">';
        html += '<span style="width:14px;height:14px;border-radius:3px;background:'+(g.color||pcaC.gold)+';flex-shrink:0;"></span>';
        html += '<span style="flex:1;font-size:13px;color:'+pcaC.text+';">'+pcaEsc(g.name)+'</span>';
        html += '<span style="font-size:11px;color:'+pcaC.dim+';">'+((g.notes||[]).length)+' 项</span>';
        html += '</div>';
    });
    html += '<div style="border-top:1px dashed '+pcaC.border+';margin-top:12px;padding-top:12px;">';
    html += '<div style="font-size:12px;color:'+pcaC.dim+';margin-bottom:6px;">或新建分组：</div>';
    html += '<div style="display:flex;gap:6px;">';
    html += '<input id="pca-favp-newname" placeholder="新分组名" style="flex:1;background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:6px;padding:6px 10px;color:'+pcaC.text+';font-size:12px;" />';
    html += '<button data-pca-action="favp-new" class="pca-modal-btn-primary" style="padding:6px 14px;font-size:12px;">+ 新建并加入</button>';
    html += '</div></div>';
    html += '</div>';
    html += '<div style="padding:10px 20px;border-top:1px solid '+pcaC.border+';display:flex;justify-content:flex-end;flex-shrink:0;">';
    html += '<button data-pca-action="favp-cancel" class="pca-modal-btn">取消</button>';
    html += '</div></div></div>';

    var existingDialog = doc.querySelector('dialog.popup:has(#pca-root)');
    var wrap = doc.createElement('div'); wrap.innerHTML = html;
    var overlayEl = wrap.firstChild;
    if (existingDialog) existingDialog.appendChild(overlayEl); else doc.body.appendChild(overlayEl);

    overlayEl.addEventListener('click', function(e) {
        e.stopPropagation();
        var t = e.target;
        while (t && t !== overlayEl) {
            if (t.getAttribute && t.getAttribute('data-pca-action')) break;
            t = t.parentElement;
        }
        if (!t || t === overlayEl) return;
        var act = t.getAttribute('data-pca-action');
        if (act === 'favp-cancel') { overlayEl.remove(); if (typeof callback === 'function') callback(null); return; }
        if (act === 'favp-pick') {
            var gid = t.getAttribute('data-pca-gid') || '';
            var n = pcaAddToFavGroup(entryNames, gid);
            overlayEl.remove();
            var groupName = gid ? (pcaState.migrateFavGroups[gid] && pcaState.migrateFavGroups[gid].name) || '?' : '未分组';
            toastr.success('已加入「'+groupName+'」：'+n+' 项' + (n < entryNames.length ? '（'+(entryNames.length-n)+' 项已存在）' : ''));
            pcaState.migrateSelected = {};
            if (typeof callback === 'function') callback(gid);
            pcaRenderMigrate();
            return;
        }
        if (act === 'favp-new') {
            var inp = doc.querySelector('#pca-favp-newname');
            var name = inp ? (inp.value || '').trim() : '';
            if (!name) { toastr.warning('请输入分组名'); return; }
            var newGid = pcaCreateFavGroup(name, null);
            if (!newGid) return;
            var added = pcaAddToFavGroup(entryNames, newGid);
            overlayEl.remove();
            toastr.success('已创建「'+name+'」并加入 '+added+' 项');
            pcaState.migrateSelected = {};
            if (typeof callback === 'function') callback(newGid);
            pcaRenderMigrate();
        }
    });
}

// 弹出"管理分组"对话框（重命名/改色/删除）
function pcaRenderFavGroupManager() {
    pcaLoadFavGroups();
    var doc = pcaGetDoc();
    var existing = doc.querySelector('#pca-fav-mgr-overlay');
    if (existing) existing.remove();

    var groups = pcaState.migrateFavGroups || {};
    var groupIds = Object.keys(groups);

    var html = '<div class="pca-modal-overlay" id="pca-fav-mgr-overlay">';
    html += '<div style="background:'+pcaC.bg+';border:1px solid '+pcaC.border+';border-radius:14px;width:min(520px,96vw);max-height:min(80vh,640px);max-height:min(80dvh,640px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.6);">';
    html += '<div style="padding:14px 20px;border-bottom:1px solid '+pcaC.border+';flex-shrink:0;display:flex;align-items:center;justify-content:space-between;">';
    html += '<span style="font-size:15px;font-weight:700;color:'+pcaC.gold+';">🗂 管理收藏夹分组</span>';
    html += '<span data-pca-action="favm-close" style="cursor:pointer;color:'+pcaC.dim+';font-size:18px;padding:0 4px;">×</span>';
    html += '</div>';
    html += '<div style="flex:1;overflow-y:auto;padding:12px 16px;">';
    if (groupIds.length === 0) {
        html += '<div style="text-align:center;padding:24px;color:'+pcaC.dim+';font-size:12px;">还没有分组。在收藏夹卡片右上角点 ➕ 创建第一个分组。</div>';
    } else {
        groupIds.forEach(function(gid) {
            var g = groups[gid];
            html += '<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;border:1px solid '+pcaC.border+';border-radius:8px;margin-bottom:6px;background:'+pcaC.card+';">';
            html += '<span data-pca-action="favm-color" data-pca-gid="'+pcaAttr(gid)+'" title="点击换颜色" style="width:18px;height:18px;border-radius:4px;background:'+(g.color||pcaC.gold)+';cursor:pointer;flex-shrink:0;"></span>';
            html += '<input data-pca-action="favm-rename" data-pca-gid="'+pcaAttr(gid)+'" value="'+pcaAttr(g.name)+'" style="flex:1;background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:6px;padding:4px 8px;color:'+pcaC.text+';font-size:12px;" />';
            html += '<span style="font-size:11px;color:'+pcaC.dim+';white-space:nowrap;">'+((g.notes||[]).length)+' 项</span>';
            html += '<span data-pca-action="favm-delete" data-pca-gid="'+pcaAttr(gid)+'" style="cursor:pointer;color:'+pcaC.danger+';font-size:14px;padding:0 6px;" title="删除分组">🗑</span>';
            html += '</div>';
        });
    }
    // 新建分组
    html += '<div style="border-top:1px dashed '+pcaC.border+';margin-top:12px;padding-top:12px;display:flex;gap:6px;">';
    html += '<input id="pca-favm-newname" placeholder="新分组名" style="flex:1;background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:6px;padding:6px 10px;color:'+pcaC.text+';font-size:12px;" />';
    html += '<button data-pca-action="favm-create" class="pca-modal-btn-primary" style="padding:6px 14px;font-size:12px;">+ 新建</button>';
    html += '</div>';
    html += '</div></div></div>';

    var existingDialog = doc.querySelector('dialog.popup:has(#pca-root)');
    var wrap = doc.createElement('div'); wrap.innerHTML = html;
    var overlayEl = wrap.firstChild;
    if (existingDialog) existingDialog.appendChild(overlayEl); else doc.body.appendChild(overlayEl);

    // input 用 change 提交重命名
    overlayEl.querySelectorAll('input[data-pca-action="favm-rename"]').forEach(function(inp) {
        inp.addEventListener('change', function() {
            var gid = inp.getAttribute('data-pca-gid');
            if (pcaRenameFavGroup(gid, inp.value)) {
                toastr.success('已重命名');
                pcaRenderMigrate();
            }
        });
    });

    overlayEl.addEventListener('click', function(e) {
        e.stopPropagation();
        var t = e.target;
        while (t && t !== overlayEl) {
            if (t.getAttribute && t.getAttribute('data-pca-action')) break;
            t = t.parentElement;
        }
        if (!t || t === overlayEl) return;
        var act = t.getAttribute('data-pca-action');
        var gid = t.getAttribute('data-pca-gid');
        if (act === 'favm-close') { overlayEl.remove(); return; }
        if (act === 'favm-color') {
            // 循环切换调色板
            pcaLoadFavGroups();
            var g = pcaState.migrateFavGroups[gid];
            if (!g) return;
            var curIdx = PCA_FAV_PALETTE.indexOf(g.color);
            var next = PCA_FAV_PALETTE[(curIdx + 1) % PCA_FAV_PALETTE.length];
            pcaSetFavGroupColor(gid, next);
            t.style.background = next;
            pcaRenderMigrate();
            return;
        }
        if (act === 'favm-delete') {
            pcaShowConfirm('删除分组「'+pcaEsc(pcaState.migrateFavGroups[gid].name)+'」？<br><br>分组下的收藏条目名将一并丢失（不影响实际预设条目）。', function(ok) {
                if (!ok) return;
                pcaDeleteFavGroup(gid);
                overlayEl.remove();
                pcaRenderFavGroupManager();
                pcaRenderMigrate();
                toastr.info('已删除分组');
            }, { yesText:'删除', noText:'取消', yesColor:pcaC.danger, yesColorDim:'#a04050' });
            return;
        }
        if (act === 'favm-create') {
            var inp = doc.querySelector('#pca-favm-newname');
            var name = inp ? (inp.value || '').trim() : '';
            if (!name) { toastr.warning('请输入分组名'); return; }
            var newGid = pcaCreateFavGroup(name, null);
            if (newGid) {
                overlayEl.remove();
                pcaRenderFavGroupManager();
                pcaRenderMigrate();
            }
        }
    });
}

function pcaMigrateInsertEntry(targetPreset, sourceEntry, insertIndex) {
    var prompts = targetPreset.prompts || [];
    var order = pcaGetOrder(targetPreset.prompt_order);
    // 健壮性：先从源预设找原始 prompt，把它的所有字段（包括 injection_position / depth / trigger 等未知字段）整体保留下来
    var rawOriginal = null;
    try {
        var leftPreset = pcaState.leftPresetData;
        if (leftPreset && Array.isArray(leftPreset.prompts) && sourceEntry._origId) {
            for (var oi = 0; oi < leftPreset.prompts.length; oi++) {
                if (leftPreset.prompts[oi] && leftPreset.prompts[oi].identifier === sourceEntry._origId) {
                    rawOriginal = leftPreset.prompts[oi];
                    break;
                }
            }
        }
        if (!rawOriginal && leftPreset && Array.isArray(leftPreset.prompts)) {
            for (var oi2 = 0; oi2 < leftPreset.prompts.length; oi2++) {
                var pp = leftPreset.prompts[oi2];
                if (pp && (pp.identifier === sourceEntry.id || pp.name === sourceEntry.name)) {
                    rawOriginal = pp;
                    break;
                }
            }
        }
    } catch(_e) {}
    var newPrompt;
    if (rawOriginal) {
        // 深拷贝原始 prompt（保留 injection_position / depth / trigger / system_prompt 等所有字段）
        newPrompt = JSON.parse(JSON.stringify(rawOriginal));
        // 用 sourceEntry 覆盖可编辑字段（id / name / content / role / marker / enabled 都可能被用户改过）
        newPrompt.identifier = sourceEntry.id;
        newPrompt.name = sourceEntry.name;
        newPrompt.content = sourceEntry.content || '';
        newPrompt.role = sourceEntry.role || newPrompt.role || 'system';
        newPrompt.marker = !!(sourceEntry.marker || newPrompt.marker);
        if (typeof sourceEntry.system_prompt === 'boolean') newPrompt.system_prompt = sourceEntry.system_prompt;
    } else {
        // 兜底：原始字段拿不到时按旧逻辑构造
        newPrompt = {
            identifier: sourceEntry.id,
            name: sourceEntry.name,
            content: sourceEntry.content || '',
            role: sourceEntry.role || 'system',
            marker: sourceEntry.marker || false,
            system_prompt: sourceEntry.system_prompt || false,
        };
    }
    // 应用字段编辑覆写（来自二级"字段"面板）
    var fo = sourceEntry._fieldOverrides || null;
    if (fo) {
        if (typeof fo.identifier === 'string' && fo.identifier) newPrompt.identifier = fo.identifier;
        if (typeof fo.name === 'string' && fo.name) newPrompt.name = fo.name;
        if (typeof fo.role === 'string') newPrompt.role = fo.role;
        if (typeof fo.injection_position === 'number') newPrompt.injection_position = fo.injection_position;
        if (typeof fo.injection_depth === 'number') newPrompt.injection_depth = fo.injection_depth;
        if (typeof fo.injection_order === 'number') newPrompt.injection_order = fo.injection_order;
        if (Array.isArray(fo.injection_trigger)) {
            newPrompt.injection_trigger = fo.injection_trigger.slice();
        } else if (fo.injection_trigger === null && Object.prototype.hasOwnProperty.call(newPrompt, 'injection_trigger')) {
            delete newPrompt.injection_trigger;
        }
        if (typeof fo.system_prompt === 'boolean') newPrompt.system_prompt = fo.system_prompt;
        if (typeof fo.marker === 'boolean') newPrompt.marker = fo.marker;
        if (typeof fo.forbid_overrides === 'boolean') newPrompt.forbid_overrides = fo.forbid_overrides;
    }
    prompts.push(newPrompt);
    targetPreset.prompts = prompts;
    // order 用最终 identifier（可能被字段覆写改过）
    var finalIdentifier = newPrompt.identifier || sourceEntry.id;
    var orderItem = { identifier: finalIdentifier, enabled: sourceEntry.enabled };
    if (insertIndex < 0 || insertIndex >= order.length) { order.push(orderItem); }
    else { order.splice(insertIndex, 0, orderItem); }
}

function pcaBuildHTML(presetNames) {
    var opts = '<option value="">-- 请选择预设 --</option>';
    presetNames.forEach(function(n){var dn=n.text||n.value;opts+='<option value="'+pcaAttr(dn)+'">'+pcaEsc(dn)+'</option>';});

    var h = '<div id="pca-root" style="font-family:'+pcaC._fontSans+';color:'+pcaC.text+';width:min(880px,96vw);max-height:min(88vh,1000px);max-height:min(88dvh,1000px);background:'+pcaC.bg+';border:1px solid '+pcaC.border+';border-radius:14px;box-shadow:0 8px 40px rgba(0,0,0,0.6);display:flex;flex-direction:column;overflow:hidden;position:relative;">';
    // ====== Header（祭坛石碑：标题大字 + v2.7 副标题下沉；无边框；底部红光带）======
    h += '<div class="pca-pad-x pca-header-bar" style="padding:18px 22px 14px;display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0;gap:8px;flex-wrap:wrap;">';
    h += '<div style="display:flex;flex-direction:column;align-items:flex-start;min-width:0;">';
    h += '<span class="pca-title pca-title-shine">预设对比助手</span>';
    h += '<span class="pca-subtitle">v 2 . 7</span>';
    h += '</div>';
    h += '<div class="pca-toolbar" style="display:flex;align-items:center;gap:14px;">';
    // 主题切换（无边框）
    var themeOpts = '';
    Object.keys(pcaThemes).forEach(function(k){
        var sel = (k === pcaC._themeName) ? ' selected' : '';
        themeOpts += '<option value="'+pcaAttr(k)+'"'+sel+'>'+pcaEsc(pcaThemes[k].name)+'</option>';
    });
    h += '<select id="pca-theme-select" class="pca-tool-select" title="切换主题">'+themeOpts+'</select>';
    h += '<span data-pca-action="debug-toggle" class="pca-tool-link" title="调试">调试</span>';
    h += '<span data-pca-action="close" class="pca-tool-link" title="关闭" style="font-size:18px;line-height:1;">×</span>';
    h += '</div></div>';

    // ====== 选预设 + 主操作按钮 ======
    h += '<div class="pca-pad-x pca-toolbar" style="padding:14px 22px;border-bottom:1px solid '+pcaC.border+';display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;flex-shrink:0;">';
    h += '<div style="flex:1;min-width:140px;"><div style="font-size:11px;color:'+pcaC.textDim+';margin-bottom:5px;font-weight:600;letter-spacing:0.3px;text-transform:uppercase;">旧预设 · 源</div>';
    h += '<select id="pca-sel-left" style="width:100%;padding:8px 10px;background:'+pcaC.input+';color:'+pcaC.text+';border:1px solid '+pcaC.border+';border-radius:6px;font-size:13px;outline:none;">'+opts+'</select></div>';
    h += '<div style="flex:1;min-width:140px;"><div style="font-size:11px;color:'+pcaC.textDim+';margin-bottom:5px;font-weight:600;letter-spacing:0.3px;text-transform:uppercase;">新预设 · 目标</div>';
    h += '<select id="pca-sel-right" style="width:100%;padding:8px 10px;background:'+pcaC.input+';color:'+pcaC.text+';border:1px solid '+pcaC.border+';border-radius:6px;font-size:13px;outline:none;">'+opts+'</select></div>';
    h += '<button data-pca-action="compare" class="pca-btn-primary pca-glow">开始对比</button>';
    h += '</div>';

    h += '<div id="pca-debug-area" style="display:none;max-height:500px;flex-shrink:0;overflow-y:auto;padding:10px 22px;border-bottom:1px solid '+pcaC.border+';background:#0a0a0f;"><pre id="pca-debug-log" style="font-size:11px;color:#888;margin:0;white-space:pre-wrap;word-break:break-all;font-family:Consolas,monospace;"></pre></div>';

    // ====== Tabs ======
    h += '<div id="pca-tabs" class="pca-pad-x pca-tabs-bar" style="padding:0 22px;border-bottom:1px solid '+pcaC.border+';display:none;flex-shrink:0;">';
    h += '<span data-pca-action="tab-diff" id="pca-tab-diff" style="display:inline-block;padding:10px 16px;font-size:13px;font-weight:600;border-bottom:2px solid '+pcaC.primary+';color:'+pcaC.primary+';">开关差异 (0)</span>';
    h += '<span data-pca-action="tab-migrate" id="pca-tab-migrate" style="display:inline-block;padding:10px 16px;font-size:13px;font-weight:600;border-bottom:2px solid transparent;color:'+pcaC.textDim+';">条目迁移</span>';
    h += '<span data-pca-action="tab-edit" id="pca-tab-edit" style="display:inline-block;padding:10px 16px;font-size:13px;font-weight:600;border-bottom:2px solid transparent;color:'+pcaC.textDim+';">条目编辑</span>';
    h += '</div>';

    h += '<div id="pca-content" class="pca-pad-x" style="flex:1;overflow-y:auto;padding:14px 22px;min-height:80px;">';
    h += '<div style="text-align:center;padding:40px 0;color:'+pcaC.textDim+';font-size:14px;">请选择两个预设后点击「开始对比」</div></div>';

    // ====== Footer ======
    h += '<div id="pca-footer" class="pca-pad-x pca-toolbar" style="padding:12px 22px;border-top:1px solid '+pcaC.border+';display:none;justify-content:flex-end;gap:10px;flex-shrink:0;flex-wrap:wrap;">';
    h += '<button data-pca-action="syncall" class="pca-btn" style="margin-right:auto;">全部同步 左→右</button>';
    h += '<button data-pca-action="save" class="pca-btn">覆盖保存</button>';
    h += '<button data-pca-action="saveas" class="pca-btn-primary pca-glow">另存为</button>';
    h += '</div></div>';
    return h;
}

function pcaRenderDiffs() {
    var wrap = pcaQ('#pca-content'); if(!wrap)return;
    if (!pcaState.diffs.length) { wrap.innerHTML='<div style="text-align:center;padding:30px;color:'+pcaC.success+';font-size:14px;">🎉 没有开关差异！</div>'; return; }
    var html = '';
    pcaState.diffs.forEach(function(d, i) {
        var curRight = pcaGetEnabled(pcaState.rightPresetData, d.right.id);
        var origRight = d.right.enabled;
        var synced = (curRight === d.left.enabled);
        var wasModified = (curRight !== origRight);
        var hasDiff = pcaHasContentDiff(d.left.content, d.right.content);

        html += '<div style="background:'+pcaC.card+';border:1px solid '+(synced?'rgba(110,207,138,0.3)':pcaC.border)+';border-radius:10px;padding:12px 16px;margin-bottom:10px;">';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:8px;flex-wrap:wrap;">';
        html += '<div class="pca-entry-name-id" style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">';
        html += '<span class="pca-entry-name" style="font-size:14px;font-weight:600;color:'+pcaC.text+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex-shrink:1;" title="'+pcaAttr(d.right.name)+'">'+pcaEsc(d.right.name)+'</span>';
        html += '<span class="pca-eid-tag" style="font-size:10px;color:'+pcaC.dim+';background:'+pcaC.card2+';padding:1px 6px;border-radius:3px;flex-shrink:0;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+pcaAttr(d.right.id)+'">'+pcaEsc(d.right.id)+'</span>';
        html += '</div>';
        html += '<div style="display:flex;gap:6px;flex-shrink:0;">';
        if (synced) {
            html += '<span style="font-size:11px;color:'+pcaC.success+';background:rgba(110,207,138,0.1);padding:3px 10px;border-radius:20px;">✓ 已同步</span>';
            if (wasModified) html += '<span data-pca-action="revert" data-pca-idx="'+i+'" style="font-size:11px;color:'+pcaC.danger+';background:rgba(224,96,112,0.1);border:1px solid rgba(224,96,112,0.3);padding:3px 10px;border-radius:20px;">↩ 回退</span>';
        } else {
            html += '<span data-pca-action="sync" data-pca-idx="'+i+'" style="font-size:12px;color:'+pcaC.pink+';background:rgba(232,160,191,0.1);border:1px solid '+pcaC.pinkDim+';border-radius:6px;padding:4px 12px;">← 同步</span>';
            if (wasModified) html += '<span data-pca-action="revert" data-pca-idx="'+i+'" style="font-size:11px;color:'+pcaC.danger+';background:rgba(224,96,112,0.1);border:1px solid rgba(224,96,112,0.3);padding:3px 10px;border-radius:20px;">↩ 回退</span>';
        }
        html += '</div></div>';

        html += '<div style="display:flex;align-items:center;gap:16px;font-size:13px;flex-wrap:wrap;">';
        html += '<div style="flex:1;min-width:120px;"><span style="color:'+pcaC.dim+';">左(旧)：</span><span style="color:'+(d.left.enabled?pcaC.pink:pcaC.off)+';font-weight:600;">'+(d.left.enabled?'● ON':'○ OFF')+'</span></div>';
        html += '<div style="flex:1;min-width:120px;display:flex;align-items:center;gap:8px;">';
        html += '<span style="color:'+pcaC.dim+';">右(新)：</span><span style="color:'+(curRight?pcaC.pink:pcaC.off)+';font-weight:600;">'+(curRight?'● ON':'○ OFF')+'</span>';
        if (wasModified) html += '<span style="font-size:10px;color:'+pcaC.dim+';"> (原:' + (origRight?'ON':'OFF') + ')</span>';
        html += '<span data-pca-action="toggle" data-pca-idx="'+i+'" style="font-size:11px;color:'+pcaC.dim+';background:'+pcaC.card2+';border:1px solid '+pcaC.border+';border-radius:4px;padding:2px 8px;">切换</span>';
        html += '</div></div>';

        html += '<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">';
        html += '<span data-pca-action="view" data-pca-idx="'+i+'" data-pca-side="left" style="font-size:11px;color:'+pcaC.dim+';border:1px solid '+pcaC.border+';border-radius:4px;padding:3px 10px;">👁 左侧内容</span>';
        html += '<span data-pca-action="view" data-pca-idx="'+i+'" data-pca-side="right" style="font-size:11px;color:'+pcaC.dim+';border:1px solid '+pcaC.border+';border-radius:4px;padding:3px 10px;">👁 右侧内容</span>';
        if (hasDiff) {
            html += '<span data-pca-action="view" data-pca-idx="'+i+'" data-pca-side="diff" style="font-size:11px;color:'+pcaC.gold+';background:rgba(212,168,83,0.15);border:1px solid '+pcaC.goldDim+';border-radius:4px;padding:3px 10px;font-weight:600;">⚡ 差异对比</span>';
        } else {
            html += '<span style="font-size:11px;color:'+pcaC.off+';border:1px solid '+pcaC.off+';border-radius:4px;padding:3px 10px;cursor:default;opacity:0.5;">⚡ 差异对比</span>';
        }
        html += '</div>';
        html += '<div id="pca-pv-'+i+'" style="display:none;margin-top:8px;"></div>';
        html += '</div>';
    });
    wrap.innerHTML = html;
}

function pcaRenderNews() {
    var wrap = pcaQ('#pca-content'); if(!wrap)return;
    if (!pcaState.newItems.length) { wrap.innerHTML='<div style="text-align:center;padding:30px;color:'+pcaC.dim+';">没有新增条目</div>'; return; }
    var html = '';
    pcaState.newItems.forEach(function(item, i) {
        var r = item.right;
        var cur = pcaGetEnabled(pcaState.rightPresetData, r.id);
        html += '<div style="background:'+pcaC.card+';border:1px solid '+pcaC.border+';border-radius:10px;padding:12px 16px;margin-bottom:10px;">';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:8px;flex-wrap:wrap;">';
        html += '<div class="pca-entry-name-id" style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">';
        html += '<span class="pca-entry-name" style="font-size:14px;font-weight:600;color:'+pcaC.gold+';min-width:0;flex-shrink:1;">★ '+pcaEsc(r.name)+'</span>';
        html += '<span class="pca-eid-tag" style="font-size:10px;color:'+pcaC.dim+';background:'+pcaC.card2+';padding:1px 6px;border-radius:3px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+pcaAttr(r.id)+'">'+pcaEsc(r.id)+'</span>';
        html += '</div>';
        html += '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">';
        html += '<span style="color:'+(cur?pcaC.pink:pcaC.off)+';font-weight:600;font-size:13px;">'+(cur?'● ON':'○ OFF')+'</span>';
        html += '<span data-pca-action="toggle-new" data-pca-idx="'+i+'" style="font-size:11px;color:'+pcaC.dim+';background:'+pcaC.card2+';border:1px solid '+pcaC.border+';border-radius:4px;padding:2px 8px;">切换</span>';
        html += '</div></div>';
        html += '<span data-pca-action="view-new" data-pca-idx="'+i+'" style="font-size:11px;color:'+pcaC.dim+';border:1px solid '+pcaC.border+';border-radius:4px;padding:3px 10px;">👁 查看内容</span>';
        html += '<div id="pca-pvn-'+i+'" style="display:none;margin-top:8px;"></div>';
        html += '</div>';
    });
    wrap.innerHTML = html;
}

// ========== 条目编辑面板（自改 / 反向迁移 / 整合"新增条目"）==========
// 取目标预设的当前条目数组（应用 editPending 中的 reorder/delete/new 后的状态）
function pcaGetEditTargetEntries() {
    var t = pcaState.editTarget;
    var base = (t === 'left') ? pcaState.leftEntries : pcaState.rightEntries;
    return base ? base.slice() : [];
}
function pcaGetEditOtherEntries() {
    var t = pcaState.editTarget;
    return (t === 'left') ? pcaState.rightEntries : pcaState.leftEntries;
}
function pcaGetEditTargetName() {
    return (pcaState.editTarget === 'left') ? pcaState.leftName : pcaState.rightName;
}
function pcaGetEditTargetPreset() {
    return (pcaState.editTarget === 'left') ? pcaState.leftPresetData : pcaState.rightPresetData;
}

// 跳到指定序号 + 高亮
// kind: 'migrate' | 'edit'
function pcaJumpToEntry(kind, n) {
    var doc = pcaGetDoc();
    var sel = (kind === 'migrate') ? '[data-pca-migrate-idx="'+n+'"]' : '[data-pca-edit-idx="'+n+'"]';
    var el = doc.querySelector(sel);
    if (!el) { toastr.warning('未找到第 '+n+' 项（可能被筛选隐藏）'); return; }
    try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch(_e) { el.scrollIntoView(); }
    // 高亮 1.6s
    var origBoxShadow = el.style.boxShadow;
    var origBorder = el.style.borderColor;
    el.style.boxShadow = '0 0 0 2px '+pcaC.gold+', 0 0 16px rgba('+pcaHexToRgb(pcaC.gold)+',0.4)';
    el.style.borderColor = pcaC.gold;
    setTimeout(function(){
        el.style.boxShadow = origBoxShadow;
        el.style.borderColor = origBorder;
    }, 1600);
}

function pcaRenderEdit() {
    var wrap = pcaQ('#pca-content'); if (!wrap) return;
    if (!pcaState.compared) {
        wrap.innerHTML = '<div style="text-align:center;padding:30px;color:'+pcaC.dim+';">请先对比预设</div>';
        return;
    }
    var entries = pcaGetEditTargetEntries();
    var other = pcaGetEditOtherEntries();
    var otherByName = {}, otherById = {};
    other.forEach(function(e){ otherByName[e.name] = e; otherById[e.id] = e; });

    var html = '';
    // 顶部控制栏：选择目标预设 + 搜索 + 仅显示新增
    html += '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:10px;">';
    html += '<div style="display:flex;align-items:center;gap:6px;font-size:12px;color:'+pcaC.dim+';">编辑目标：</div>';
    html += '<div style="display:inline-flex;border:1px solid '+pcaC.border+';border-radius:6px;overflow:hidden;">';
    var leftActive = (pcaState.editTarget === 'left');
    var rightActive = (pcaState.editTarget === 'right');
    html += '<span data-pca-action="edit-target" data-pca-side="left" style="padding:5px 12px;font-size:12px;cursor:pointer;background:'+(leftActive?pcaC.gold:'transparent')+';color:'+(leftActive?'#fff':pcaC.dim)+';font-weight:'+(leftActive?'700':'500')+';">📁 旧（'+pcaEsc(pcaState.leftName||'?')+'）</span>';
    html += '<span data-pca-action="edit-target" data-pca-side="right" style="padding:5px 12px;font-size:12px;cursor:pointer;background:'+(rightActive?pcaC.gold:'transparent')+';color:'+(rightActive?'#fff':pcaC.dim)+';font-weight:'+(rightActive?'700':'500')+';">📂 新（'+pcaEsc(pcaState.rightName||'?')+'）</span>';
    html += '</div>';
    html += '<div style="flex:1;min-width:140px;"><input id="pca-edit-search" class="pca-search-input" placeholder="🔍 按条目名搜索..." value="'+pcaAttr(pcaState.editSearch)+'" /></div>';
    html += '<div style="display:flex;align-items:center;gap:4px;flex-shrink:0;"><span style="font-size:11px;color:'+pcaC.dim+';">跳到</span><input id="pca-edit-jump" type="number" min="1" max="'+entries.length+'" placeholder="#" style="width:70px;padding:5px 8px;background:'+pcaC.input+';color:'+pcaC.text+';border:1px solid '+pcaC.border+';border-radius:4px;font-size:12px;outline:none;text-align:center;" title="输入序号后回车，跳转并高亮条目" /></div>';
    html += '<label style="display:flex;align-items:center;gap:4px;font-size:11px;color:'+pcaC.dim+';cursor:pointer;"><input type="checkbox" id="pca-edit-only-new"'+(pcaState.editOnlyNew?' checked':'')+' style="cursor:pointer;" /> 仅显示「目标独有」</label>';
    html += '</div>';

    // 操作栏：新建条目
    html += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">';
    html += '<button data-pca-action="edit-new-entry" class="pca-btn-primary" style="padding:5px 14px;font-size:12px;">＋ 新建空白条目</button>';
    html += '<span style="font-size:11px;color:'+pcaC.dim+';align-self:center;">在「'+pcaEsc(pcaGetEditTargetName())+'」中创建一个新条目</span>';
    html += '</div>';

    // 条目列表
    if (!entries.length) {
        html += '<div style="text-align:center;padding:30px;color:'+pcaC.dim+';">没有条目</div>';
    } else {
        var search = (pcaState.editSearch || '').toLowerCase();
        var totalCount = 0;
        entries.forEach(function(entry, idx) {
            if (search && entry.name.toLowerCase().indexOf(search) < 0) return;
            // 是否是「目标独有」
            var inOther = !!(otherByName[entry.name] || otherById[entry.id]);
            if (pcaState.editOnlyNew && inOther) return;

            // 找到此条目对应的 pending 项
            var p = null;
            for (var pi = 0; pi < pcaState.editPending.length; pi++) {
                var pp = pcaState.editPending[pi];
                if (pp.targetId === entry.id || pp.entryId === entry.id) { p = pp; break; }
            }
            // 状态条
            var stTag = '';
            if (p) {
                if (p.action === 'overwrite') stTag = '<span style="font-size:10px;color:'+pcaC.gold+';background:rgba(212,168,83,0.1);border:1px solid rgba(212,168,83,0.3);padding:1px 8px;border-radius:10px;">待覆盖</span>';
                else if (p.action === 'delete') stTag = '<span style="font-size:10px;color:'+pcaC.danger+';background:rgba(224,96,112,0.1);border:1px solid rgba(224,96,112,0.3);padding:1px 8px;border-radius:10px;">待删除</span>';
                else if (p.action === 'reorder') stTag = '<span style="font-size:10px;color:'+pcaC.migrate+';background:'+pcaC.migrateBg+';border:1px solid '+pcaC.migrateBorder+';padding:1px 8px;border-radius:10px;">待移动→#'+(p.newIndex+1)+'</span>';
                else if (p.action === 'toggle') stTag = '<span style="font-size:10px;color:'+pcaC.info+';background:rgba(255,255,255,0.04);border:1px solid '+pcaC.border+';padding:1px 8px;border-radius:10px;">待'+(p.enabled?'启用':'禁用')+'</span>';
            } else if (!inOther) {
                stTag = '<span style="font-size:10px;color:'+pcaC.success+';background:rgba(110,207,138,0.1);border:1px solid rgba(110,207,138,0.3);padding:1px 8px;border-radius:10px;">★ 目标独有</span>';
            }

            var cardBg = p ? (p.action === 'delete' ? 'rgba(224,96,112,0.05)' : pcaC.card) : pcaC.card;
            html += '<div class="pca-entry-item" data-pca-edit-idx="'+(idx+1)+'" style="background:'+cardBg+';border:1px solid '+pcaC.border+';border-radius:8px;padding:10px 14px;margin-bottom:6px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;transition:box-shadow .25s ease,border-color .25s ease;">';
            html += '<div style="flex:1;min-width:0;">';
            html += '<div class="pca-entry-name-id" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">';
            html += '<span style="font-size:10px;color:'+pcaC.dim+';min-width:24px;text-align:right;">#'+(idx+1)+'</span>';
            // 滑块开关（点击触发 toggle；展示队列预览态）
            var togglePreview = (p && p.action === 'toggle') ? !!p.enabled : !!entry.enabled;
            html += '<span class="pca-toggle" data-pca-action="edit-toggle" data-pca-idx="'+idx+'" title="点击切换启用/禁用"><input type="checkbox"'+(togglePreview?' checked':'')+' tabindex="-1" /><span class="pca-toggle-slider"></span></span>';
            html += '<span class="pca-entry-name" style="font-size:13px;font-weight:600;color:'+pcaC.text+';word-break:break-word;">'+pcaEsc(entry.name)+'</span>';
            html += stTag;
            html += '</div>';
            html += '<div class="pca-eid-tag" style="font-size:10px;color:'+pcaC.dim+';background:'+pcaC.card2+';padding:1px 6px;border-radius:3px;margin-top:3px;display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+pcaAttr(entry.id)+'">'+pcaEsc(entry.id)+'</div>';
            html += '</div>';
            // 操作按钮组
            html += '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;align-items:flex-end;">';
            // 顺序输入框（直接跳到序号 N）
            html += '<div style="display:flex;align-items:center;gap:3px;">';
            html += '<button data-pca-action="edit-move" data-pca-idx="'+idx+'" data-pca-dir="up" class="pca-btn" style="padding:2px 8px;font-size:11px;" title="上移一位">↑</button>';
            html += '<input type="number" min="1" max="'+entries.length+'" value="'+(idx+1)+'" style="width:50px;padding:2px 4px;background:'+pcaC.input+';color:'+pcaC.text+';border:1px solid '+pcaC.border+';border-radius:3px;font-size:11px;text-align:center;outline:none;" data-pca-edit-jump="'+idx+'" title="输入序号回车跳转" />';
            html += '<button data-pca-action="edit-move" data-pca-idx="'+idx+'" data-pca-dir="down" class="pca-btn" style="padding:2px 8px;font-size:11px;" title="下移一位">↓</button>';
            html += '</div>';
            // 编辑 / 删除（启用切换已通过滑块开关在 name 左侧实现）
            html += '<div style="display:flex;gap:4px;">';
            html += '<button data-pca-action="edit-edit" data-pca-idx="'+idx+'" class="pca-btn" style="padding:3px 10px;font-size:11px;color:'+pcaC.gold+';border-color:'+pcaC.goldDim+';">✏️ 编辑</button>';
            html += '<button data-pca-action="edit-delete" data-pca-idx="'+idx+'" class="pca-btn pca-btn-danger" style="padding:3px 10px;font-size:11px;">🗑 删</button>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            totalCount++;
        });
        if (totalCount === 0) {
            html += '<div style="text-align:center;padding:20px;color:'+pcaC.dim+';">没有匹配的条目</div>';
        }
    }
    // 底部留白防止队列 dock 遮挡（折叠时只留 52px，展开时留够）
    html += '<div style="height:'+(pcaState.editQueueExpanded&&pcaState.editPending.length>0?'min(280px,45dvh)':'52px')+';flex-shrink:0;"></div>';
    wrap.innerHTML = html;

    // 搜索 / 筛选输入绑定
    var searchInput = pcaGetDoc().querySelector('#pca-edit-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            pcaState.editSearch = searchInput.value || '';
            pcaRenderEdit();
            // 保持焦点
            var ne = pcaGetDoc().querySelector('#pca-edit-search');
            if (ne) { ne.focus(); ne.setSelectionRange(ne.value.length, ne.value.length); }
        });
    }
    var onlyNewCb = pcaGetDoc().querySelector('#pca-edit-only-new');
    if (onlyNewCb) {
        onlyNewCb.addEventListener('change', function() {
            pcaState.editOnlyNew = onlyNewCb.checked;
            pcaRenderEdit();
        });
    }
    // 顶部「跳到 N」输入框
    var jumpInput2 = pcaGetDoc().querySelector('#pca-edit-jump');
    if (jumpInput2) {
        jumpInput2.addEventListener('keydown', function(e) {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            var n = parseInt(this.value, 10);
            if (!n || n < 1 || n > entries.length) { toastr.warning('请输入 1 ~ '+entries.length); return; }
            pcaJumpToEntry('edit', n);
        });
    }
    // 序号跳转输入框
    var doc2 = pcaGetDoc();
    doc2.querySelectorAll('input[data-pca-edit-jump]').forEach(function(inp) {
        inp.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                var fromIdx = parseInt(inp.getAttribute('data-pca-edit-jump'), 10);
                var toIdx = parseInt(inp.value, 10) - 1;
                if (isNaN(toIdx) || toIdx < 0) { toastr.warning('请输入有效序号'); return; }
                pcaEditMoveTo(fromIdx, toIdx);
            }
        });
    });

    // 渲染队列 dock
    pcaRenderEditDock();
}

function pcaRenderEditDock() {
    var doc = pcaGetDoc();
    var root = doc.querySelector('#pca-root');
    if (!root) return;
    var existing = root.querySelector('#pca-edit-dock');
    if (existing) existing.remove();
    if (pcaState.activeTab !== 'edit') return;

    var pendingCount = pcaState.editPending.length;
    var expanded = pcaState.editQueueExpanded && pendingCount > 0;
    var dock = doc.createElement('div');
    dock.id = 'pca-edit-dock';
    // 留出右侧 14px 不遮挡滚动条
    dock.style.cssText = 'position:absolute;left:0;right:14px;bottom:0;background:'+pcaC.card2+';border-top:1px solid '+pcaC.goldDim+';box-shadow:0 -4px 16px rgba(0,0,0,0.4);z-index:10;max-height:'+(expanded?'min(280px,50dvh)':'44px')+';display:flex;flex-direction:column;transition:max-height 0.2s;';

    var html = '';
    // 顶栏（点击切换展开/收起）
    html += '<div style="padding:10px 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;user-select:none;">';
    html += '<div data-pca-action="edit-queue-toggle" style="display:flex;align-items:center;gap:10px;cursor:pointer;flex:1;">';
    html += '<span style="font-size:13px;font-weight:600;color:'+pcaC.gold+';">📝 待修改队列</span>';
    if (pendingCount > 0) {
        html += '<span style="background:'+pcaC.gold+';color:#fff;font-size:11px;font-weight:700;padding:1px 8px;border-radius:10px;">'+pendingCount+'</span>';
    } else {
        html += '<span style="font-size:11px;color:'+pcaC.dim+';">（队列为空）</span>';
    }
    html += '</div>';
    html += '<div style="display:flex;align-items:center;gap:8px;">';
    html += '<span style="font-size:11px;color:'+pcaC.dim+';">编辑「'+pcaEsc(pcaGetEditTargetName())+'」</span>';
    if (pendingCount > 0) {
        html += '<span data-pca-action="edit-queue-toggle" style="font-size:14px;color:'+pcaC.dim+';cursor:pointer;padding:0 4px;">'+(expanded?'▼':'▲')+'</span>';
    }
    html += '</div>';
    html += '</div>';

    if (expanded) {
        html += '<div style="flex:1;overflow-y:auto;padding:0 18px 8px;">';
        pcaState.editPending.forEach(function(p, pi) {
            var label = '';
            var color = pcaC.text;
            if (p.action === 'new') { label = '＋ 新建'; color = pcaC.success; }
            else if (p.action === 'overwrite') { label = '↻ 覆盖'; color = pcaC.gold; }
            else if (p.action === 'delete') { label = '🗑 删除'; color = pcaC.danger; }
            else if (p.action === 'reorder') { label = '↕ 移动 → #'+(p.newIndex+1); color = pcaC.migrate; }
            else if (p.action === 'toggle') { label = (p.enabled?'▶ 启用':'⏸ 禁用'); color = pcaC.info; }
            html += '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05);flex-wrap:wrap;">';
            html += '<span style="font-size:11px;color:'+color+';font-weight:600;flex-shrink:0;min-width:80px;">'+pcaEsc(label)+'</span>';
            html += '<span style="font-size:12px;color:'+pcaC.text+';flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+pcaEsc(p.entryName||p.targetName||'')+'</span>';
            html += '<span data-pca-action="edit-pending-remove" data-pca-idx="'+pi+'" style="font-size:11px;color:'+pcaC.danger+';flex-shrink:0;cursor:pointer;padding:0 6px;">✕</span>';
            html += '</div>';
        });
        html += '</div>';
    }

    if (expanded) {
        html += '<div style="padding:8px 18px;border-top:1px solid '+pcaC.border+';display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;flex-shrink:0;">';
        if (pcaState.editUndoStack.length > 0) {
            html += '<button data-pca-action="edit-undo" class="pca-btn pca-btn-danger" style="padding:4px 10px;font-size:11px;">↩ 撤销</button>';
        }
        html += '<button data-pca-action="edit-clear" class="pca-btn" style="padding:4px 10px;font-size:11px;">清空</button>';
        html += '<button data-pca-action="edit-apply" class="pca-btn-primary pca-glow" style="padding:5px 16px;font-size:12px;">应用并保存</button>';
        html += '</div>';
    }
    dock.innerHTML = html;
    root.appendChild(dock);
}

// 把同一个 entryId 的旧 pending 移除（避免重复）
function pcaEditRemovePendingOf(entryId) {
    pcaState.editPending = pcaState.editPending.filter(function(p) {
        return p.entryId !== entryId && p.targetId !== entryId;
    });
}

// 添加 / 替换队列项
function pcaEditAddPending(p) {
    pcaEditRemovePendingOf(p.entryId || p.targetId);
    pcaState.editUndoStack.push({ action:'add', index: pcaState.editPending.length });
    pcaState.editPending.push(p);
}

// 队列：切换启用
// 第一次点击：把目标条目的 toggle 操作加入队列（启用 ↔ 禁用）。
// 第二次点击（即点回原状态）：直接从队列中移除这条 toggle 操作，
// 因为目标 enabled 等于条目本身的 enabled，无需保留无效的 pending 项。
function pcaEditDoToggle(idx) {
    var entries = pcaGetEditTargetEntries();
    if (idx < 0 || idx >= entries.length) return;
    var entry = entries[idx];
    // 检查队列里是否已有针对这个条目的 toggle 项
    var existingIdx = -1;
    for (var i = 0; i < pcaState.editPending.length; i++) {
        var pi = pcaState.editPending[i];
        if (pi.action === 'toggle' && (pi.entryId === entry.id || pi.targetId === entry.id)) {
            existingIdx = i;
            break;
        }
    }
    if (existingIdx >= 0) {
        // 二次点击 → 撤销该 toggle 操作（回到初始状态）
        pcaState.editPending.splice(existingIdx, 1);
        // 同步清理 undo 栈里指向被删项之后位置的索引（避免撤销错位）
        pcaState.editUndoStack = pcaState.editUndoStack.filter(function(u){
            return !(u.action === 'add' && u.index === existingIdx);
        });
        pcaState.editUndoStack.forEach(function(u){
            if (u.action === 'add' && u.index > existingIdx) u.index--;
        });
        pcaRenderEdit();
        toastr.info('已从队列移除：' + (entry.enabled ? '禁用' : '启用') + ' ' + entry.name);
        return;
    }
    // 首次点击 → 加入队列
    pcaEditAddPending({ action:'toggle', targetId: entry.id, entryId: entry.id, entryName: entry.name, enabled: !entry.enabled });
    pcaRenderEdit();
    toastr.success('已加入队列：' + (!entry.enabled ? '启用' : '禁用') + ' ' + entry.name);
}

// 队列：删除
function pcaEditDoDelete(idx) {
    var entries = pcaGetEditTargetEntries();
    if (idx < 0 || idx >= entries.length) return;
    var entry = entries[idx];
    pcaShowConfirm('确认从「'+pcaEsc(pcaGetEditTargetName())+'」中删除条目：<br><br><b>'+pcaEsc(entry.name)+'</b><br><br>（先入队列，应用后才真正删除）', function(ok){
        if (!ok) return;
        pcaEditAddPending({ action:'delete', targetId: entry.id, entryId: entry.id, entryName: entry.name });
        pcaRenderEdit();
        toastr.warning('已加入删除队列：' + entry.name);
    }, { yesText:'加入删除队列', noText:'取消', yesColor: pcaC.danger, yesColorDim: '#a04050' });
}

// 队列：上下移位 / 跳转到指定序号
function pcaEditMoveTo(fromIdx, toIdx) {
    var entries = pcaGetEditTargetEntries();
    if (fromIdx < 0 || fromIdx >= entries.length) return;
    if (toIdx < 0) toIdx = 0;
    if (toIdx >= entries.length) toIdx = entries.length - 1;
    if (toIdx === fromIdx) return;
    var entry = entries[fromIdx];
    pcaEditAddPending({ action:'reorder', targetId: entry.id, entryId: entry.id, entryName: entry.name, fromIndex: fromIdx, newIndex: toIdx });
    pcaRenderEdit();
    toastr.info('已加入移动队列：' + entry.name + ' → 第 ' + (toIdx+1) + ' 位');
}

// 队列：新建空白条目
// 注意：这里不预先入队，只打开编辑器；只有用户点"提交"（pcaEditorSave 的 _isNew 分支）才会真正入队。
// 这样用户在编辑器里点"取消"或丢弃修改时，不会留下垃圾 pending 项。
function pcaEditDoNewEntry() {
    var newId = pcaGenEntryId();
    var newEntry = {
        id: newId,
        name: '新条目',
        enabled: true,
        content: '',
        role: 'system',
        marker: false,
        _isNew: true,
    };
    pcaOpenEditor(newEntry, { isEditTarget: true });
}

// 队列：编辑（覆盖）
function pcaEditDoEdit(idx) {
    var entries = pcaGetEditTargetEntries();
    if (idx < 0 || idx >= entries.length) return;
    var entry = entries[idx];
    // 复用 pcaOpenEditor — 但需要标记为 edit 模式（保存后入 edit 队列而不是 migrate 队列）
    pcaOpenEditor(entry, { isEditTarget: true });
}

function pcaGetMigrateFilterNames() {
    var names = [];
    if (pcaState.migrateFavActive) {
        var favNames = pcaGetActiveFavNames();
        if (favNames && favNames.length > 0) names = favNames.slice();
    }
    if (pcaState.migrateSearch) {
        names.push(pcaState.migrateSearch);
    }
    return names;
}

function pcaMatchesFilter(entryName, filterNames) {
    if (!filterNames.length) return true;
    var lower = entryName.toLowerCase();
    for (var i = 0; i < filterNames.length; i++) {
        if (lower.indexOf(filterNames[i].toLowerCase()) !== -1) return true;
    }
    return false;
}

var pcaComposing = false;

function pcaContentEqual(a, b) {
    return (a || '') === (b || '');
}

function pcaRenderMigrate() {
    var wrap = pcaQ('#pca-content'); if(!wrap)return;
    if (!pcaState.compared) {
        wrap.innerHTML='<div style="text-align:center;padding:30px;color:'+pcaC.dim+';">请先对比预设</div>';
        return;
    }

    var leftEntries = pcaState.leftEntries;
    var rightEntries = pcaState.rightEntries;
    var rightById = {};
    var rightByName = {};
    rightEntries.forEach(function(e) { rightById[e.id] = e; rightByName[e.name] = e; });

    // 先确定每个左侧条目的状态（是否在右侧已存在 + 内容是否相同）
    function getEntryStatus(entry) {
        var pendingItem = null;
        pcaState.migratePending.forEach(function(p) { if (p.entry.id === entry.id) pendingItem = p; });
        // name 优先（用户视角）→ id 兜底
        var rightMatch = rightByName[entry.name] || rightById[entry.id] || null;
        var exists = !!rightMatch;
        var contentSame = rightMatch ? pcaContentEqual(entry.content, rightMatch.content) : false;
        return { pending: pendingItem, rightMatch: rightMatch, exists: exists, contentSame: contentSame };
    }

    var filterNames = pcaGetMigrateFilterNames();
    var filteredLeft = leftEntries.filter(function(e) {
        if (!pcaMatchesFilter(e.name, filterNames)) return false;
        var st = getEntryStatus(e);
        if (pcaState.migrateFilterStatus === 'exists' && !st.exists) return false;
        if (pcaState.migrateFilterStatus === 'new' && st.exists) return false;
        if (pcaState.migrateFilterDiff === 'diff') {
            // 内容有差异：目标已有但内容不同；或者目标没有（也算差异）
            if (st.exists && st.contentSame) return false;
        }
        if (pcaState.migrateFilterDiff === 'same') {
            // 内容相同：必须目标已有且内容相同
            if (!st.exists || !st.contentSame) return false;
        }
        return true;
    });

    var html = '';

    // 收藏夹（含分组）
    var favGroups = pcaState.migrateFavGroups || {};
    var favGroupIds = Object.keys(favGroups);
    var activeGid = pcaState.activeFavGroupId || '';
    var activeGroup = activeGid ? favGroups[activeGid] : null;
    var activeNotes = activeGid ? ((activeGroup && activeGroup.notes) || []) : (pcaState.migrateNotes || []);
    var activeColor = activeGid ? ((activeGroup && activeGroup.color) || pcaC.gold) : pcaC.dim;
    var activeName = activeGid ? ((activeGroup && activeGroup.name) || '?') : '未分组';

    html += '<div style="background:'+pcaC.card+';border:1px solid '+pcaC.border+';border-radius:10px;padding:12px 16px;margin-bottom:14px;">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:6px;">';
    html += '<span style="font-size:13px;font-weight:600;color:'+pcaC.gold+';">⭐ 收藏夹</span>';
    html += '<div style="display:flex;gap:8px;align-items:center;">';
    var favBtnColor = pcaState.migrateFavActive ? pcaC.gold : pcaC.dim;
    var favBtnBg = pcaState.migrateFavActive ? 'rgba(212,168,83,0.15)' : 'transparent';
    html += '<span data-pca-action="fav-toggle-all" style="font-size:11px;color:'+favBtnColor+';background:'+favBtnBg+';border:1px solid '+(pcaState.migrateFavActive?pcaC.goldDim:pcaC.border)+';border-radius:6px;padding:3px 10px;cursor:pointer;">'+(pcaState.migrateFavActive?'✓ 已筛选收藏':'☆ 显示全部收藏')+'</span>';
    html += '<span data-pca-action="fav-mgr-open" title="管理分组" style="font-size:11px;color:'+pcaC.dim+';border:1px solid '+pcaC.border+';border-radius:6px;padding:3px 10px;cursor:pointer;">🗂 管理分组</span>';
    html += '</div></div>';

    // 分组标签栏
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">';
    var ungroupedActive = (activeGid === '');
    html += '<span data-pca-action="fav-tab-pick" data-pca-gid="" style="display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:3px 10px;border-radius:12px;cursor:pointer;border:1px solid '+(ungroupedActive?pcaC.goldDim:pcaC.border)+';background:'+(ungroupedActive?'rgba(212,168,83,0.15)':'transparent')+';color:'+(ungroupedActive?pcaC.gold:pcaC.dim)+';">';
    html += '<span style="width:8px;height:8px;border-radius:50%;background:'+pcaC.dim+';"></span>';
    html += '📂 未分组 <span style="opacity:0.7;">('+(pcaState.migrateNotes||[]).length+')</span></span>';
    favGroupIds.forEach(function(gid) {
        var g = favGroups[gid];
        var isAct = (activeGid === gid);
        var col = g.color || pcaC.gold;
        html += '<span data-pca-action="fav-tab-pick" data-pca-gid="'+pcaAttr(gid)+'" style="display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:3px 10px;border-radius:12px;cursor:pointer;border:1px solid '+(isAct?col:pcaC.border)+';background:'+(isAct?(col+'22'):'transparent')+';color:'+(isAct?col:pcaC.dim)+';">';
        html += '<span style="width:8px;height:8px;border-radius:50%;background:'+col+';"></span>';
        html += pcaEsc(g.name)+' <span style="opacity:0.7;">('+((g.notes||[]).length)+')</span></span>';
    });
    html += '<span data-pca-action="fav-mgr-open" title="新建分组" style="display:inline-flex;align-items:center;font-size:11px;padding:3px 10px;border-radius:12px;cursor:pointer;border:1px dashed '+pcaC.border+';color:'+pcaC.dim+';">➕ 新建</span>';
    html += '</div>';

    html += '<div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;">';
    html += '<input id="pca-note-input" class="pca-search-input" style="flex:1;min-width:140px;" placeholder="输入条目名字加入「'+pcaEsc(activeName)+'」" />';
    html += '<button data-pca-action="note-add" style="padding:5px 14px;background:'+(activeGid?activeColor:pcaC.migrate)+';color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;white-space:nowrap;cursor:pointer;">+ 添加到本组</button>';
    html += '</div>';
    html += '<div id="pca-notes-list" style="display:flex;flex-wrap:wrap;min-height:24px;">';
    if (activeNotes.length === 0) {
        html += '<span style="color:'+pcaC.dim+';font-size:12px;padding:4px;">「'+pcaEsc(activeName)+'」暂无收藏</span>';
    } else {
        activeNotes.forEach(function(note, ni) {
            html += '<span class="pca-note-tag" style="border-color:'+activeColor+'55;">';
            html += '<span class="pca-note-find" data-pca-action="note-find" data-pca-idx="'+ni+'" title="单独搜索此条目">🔍</span> ';
            html += '<span class="pca-note-text">'+pcaEsc(note)+'</span>';
            html += ' <span class="pca-note-x" data-pca-action="note-del" data-pca-idx="'+ni+'" title="从本组移除">×</span>';
            html += '</span>';
        });
    }
    html += '</div></div>';

    // 搜索 + 序号跳转 + 筛选
    html += '<div style="display:flex;gap:10px;margin-bottom:10px;align-items:center;flex-wrap:wrap;">';
    html += '<div style="flex:1;min-width:140px;"><input id="pca-migrate-search" class="pca-search-input" placeholder="🔍 按条目名字搜索..." value="'+pcaAttr(pcaState.migrateSearch)+'" /></div>';
    html += '<div style="display:flex;align-items:center;gap:4px;flex-shrink:0;"><span style="font-size:11px;color:'+pcaC.dim+';">跳到</span><input id="pca-migrate-jump" type="number" min="1" max="'+leftEntries.length+'" placeholder="#" style="width:70px;padding:5px 8px;background:'+pcaC.input+';color:'+pcaC.text+';border:1px solid '+pcaC.border+';border-radius:4px;font-size:12px;outline:none;text-align:center;" title="输入序号后回车，跳转并高亮条目" /></div>';
    html += '<span style="font-size:12px;color:'+pcaC.dim+';white-space:nowrap;">'+filteredLeft.length+' / '+leftEntries.length+' 条</span>';
    if (pcaState.migrateSearch || pcaState.migrateFavActive || pcaState.migrateFilterStatus!=='all' || pcaState.migrateFilterDiff!=='all') {
        html += '<span data-pca-action="migrate-clear-filter" style="font-size:11px;color:'+pcaC.danger+';border:1px solid rgba(224,96,112,0.3);border-radius:6px;padding:3px 10px;white-space:nowrap;">✕ 清除筛选</span>';
    }
    html += '</div>';

    // 状态筛选 + 差异筛选 按钮组
    function btnStyle(active, color) {
        if (active) return 'background:'+(color==='gold'?'rgba(212,168,83,0.15)':'rgba(142,184,229,0.15)')+';color:'+(color==='gold'?pcaC.gold:pcaC.migrate)+';border:1px solid '+(color==='gold'?pcaC.goldDim:pcaC.migrateBorder)+';';
        return 'background:transparent;color:'+pcaC.dim+';border:1px solid '+pcaC.border+';';
    }
    html += '<div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;align-items:center;">';
    html += '<span style="font-size:11px;color:'+pcaC.dim+';margin-right:4px;">状态:</span>';
    html += '<span data-pca-action="filter-status" data-pca-val="all" style="font-size:11px;border-radius:6px;padding:3px 10px;'+btnStyle(pcaState.migrateFilterStatus==='all','migrate')+'">全部</span>';
    html += '<span data-pca-action="filter-status" data-pca-val="new" style="font-size:11px;border-radius:6px;padding:3px 10px;'+btnStyle(pcaState.migrateFilterStatus==='new','migrate')+'">仅目标未有</span>';
    html += '<span data-pca-action="filter-status" data-pca-val="exists" style="font-size:11px;border-radius:6px;padding:3px 10px;'+btnStyle(pcaState.migrateFilterStatus==='exists','migrate')+'">仅目标已有</span>';
    html += '<span style="font-size:11px;color:'+pcaC.dim+';margin:0 4px 0 10px;">内容:</span>';
    html += '<span data-pca-action="filter-diff" data-pca-val="all" style="font-size:11px;border-radius:6px;padding:3px 10px;'+btnStyle(pcaState.migrateFilterDiff==='all','gold')+'">全部</span>';
    html += '<span data-pca-action="filter-diff" data-pca-val="diff" style="font-size:11px;border-radius:6px;padding:3px 10px;'+btnStyle(pcaState.migrateFilterDiff==='diff','gold')+'">仅有差异</span>';
    html += '<span data-pca-action="filter-diff" data-pca-val="same" style="font-size:11px;border-radius:6px;padding:3px 10px;'+btnStyle(pcaState.migrateFilterDiff==='same','gold')+'">仅相同</span>';
    html += '</div>';

    html += '<div style="font-size:13px;font-weight:600;color:'+pcaC.pink+';margin-bottom:8px;">📁 旧预设「'+pcaEsc(pcaState.leftName)+'」条目</div>';

    // 批量操作栏
    var selectedCount = 0;
    if (pcaState.migrateSelected) {
        Object.keys(pcaState.migrateSelected).forEach(function(k) { if (pcaState.migrateSelected[k]) selectedCount++; });
    }
    var hasSelection = selectedCount > 0;
    html += '<div style="background:'+pcaC.card2+';border:1px solid '+pcaC.border+';border-radius:8px;padding:8px 12px;margin-bottom:10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;">';
    html += '<span style="font-size:11px;color:'+pcaC.dim+';margin-right:4px;">批量:</span>';
    html += '<span data-pca-action="batch-select-all" style="font-size:11px;color:'+pcaC.text+';border:1px solid '+pcaC.border+';border-radius:6px;padding:3px 10px;">☑ 全选可见</span>';
    html += '<span data-pca-action="batch-invert" style="font-size:11px;color:'+pcaC.text+';border:1px solid '+pcaC.border+';border-radius:6px;padding:3px 10px;">⇅ 反选</span>';
    html += '<span data-pca-action="batch-clear" style="font-size:11px;color:'+pcaC.dim+';border:1px solid '+pcaC.border+';border-radius:6px;padding:3px 10px;">✕ 清空选择</span>';
    if (hasSelection) {
        html += '<span style="flex:1;font-size:11px;color:'+pcaC.migrate+';font-weight:600;text-align:right;min-width:70px;">已选 '+selectedCount+' 项</span>';
        html += '<button data-pca-action="batch-migrate" class="pca-btn-primary" style="padding:5px 14px;font-size:12px;">✨ 一键智能迁移已选</button>';
        html += '<button data-pca-action="batch-fav" class="pca-btn" style="padding:4px 10px;font-size:11px;" title="加入收藏夹（分组功能开发中）">⭐ 加入收藏</button>';
    } else {
        html += '<span style="flex:1;font-size:11px;color:'+pcaC.dim+';text-align:right;min-width:70px;">勾选条目后批量操作</span>';
    }
    html += '</div>';

    if (filteredLeft.length === 0) {
        html += '<div style="text-align:center;padding:20px;color:'+pcaC.dim+';">没有匹配的条目</div>';
    } else {
        filteredLeft.forEach(function(entry) {
            var origIdx = -1;
            for (var oi = 0; oi < leftEntries.length; oi++) { if (leftEntries[oi] === entry) { origIdx = oi; break; } }

            var st = getEntryStatus(entry);
            var alreadyPending = !!st.pending;

            var statusBadge = '';
            if (alreadyPending) {
                statusBadge = '<span style="font-size:10px;color:'+pcaC.migrate+';background:'+pcaC.migrateBg+';border:1px solid '+pcaC.migrateBorder+';padding:1px 8px;border-radius:10px;">已在队列</span>';
            } else if (st.exists) {
                if (st.contentSame) {
                    statusBadge = '<span style="font-size:10px;color:'+pcaC.success+';background:rgba(110,207,138,0.1);border:1px solid rgba(110,207,138,0.3);padding:1px 8px;border-radius:10px;">目标已有·内容相同</span>';
                } else {
                    statusBadge = '<span style="font-size:10px;color:'+pcaC.gold+';background:rgba(212,168,83,0.1);border:1px solid rgba(212,168,83,0.3);padding:1px 8px;border-radius:10px;">目标已有·内容不同</span>';
                }
            } else {
                statusBadge = '<span style="font-size:10px;color:'+pcaC.dim+';background:'+pcaC.card2+';border:1px solid '+pcaC.border+';padding:1px 8px;border-radius:10px;">目标未有</span>';
            }

            var isSelected = !!(pcaState.migrateSelected && pcaState.migrateSelected[entry.id]);
            var selBorder = isSelected ? pcaC.migrateBorder : pcaC.border;
            var selBg = isSelected ? 'rgba(142,184,229,0.06)' : pcaC.card;
            html += '<div class="pca-entry-item" data-pca-migrate-idx="'+(origIdx+1)+'" style="background:'+selBg+';border:1px solid '+selBorder+';border-radius:8px;padding:10px 14px;margin-bottom:6px;transition:box-shadow .25s ease,border-color .25s ease;">';
            html += '<div style="display:flex;align-items:center;gap:10px;">';
            // 复选框（旧版条目唯一标识用 entry.id）
            html += '<span data-pca-action="batch-toggle" data-pca-entry-id="'+pcaAttr(entry.id)+'" style="flex-shrink:0;font-size:16px;color:'+(isSelected?pcaC.migrate:pcaC.dim)+';padding:2px 4px;user-select:none;" title="选中以批量操作">'+(isSelected?'☑':'☐')+'</span>';
            html += '<span style="font-size:10px;color:'+pcaC.dim+';flex-shrink:0;min-width:28px;text-align:right;">#'+(origIdx+1)+'</span>';
            html += '<div style="flex:1;min-width:0;">';
            html += '<div class="pca-entry-name-id" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">';
            html += '<span class="pca-entry-name" style="font-size:13px;font-weight:600;color:'+pcaC.text+';word-break:break-word;">'+pcaEsc(entry.name)+'</span>';
            html += '<span style="color:'+(entry.enabled?pcaC.pink:pcaC.off)+';font-size:11px;flex-shrink:0;">'+(entry.enabled?'ON':'OFF')+'</span>';
            html += statusBadge;
            html += '</div>';
            html += '<div class="pca-eid-tag" style="font-size:10px;color:'+pcaC.dim+';background:'+pcaC.card2+';padding:1px 6px;border-radius:3px;margin-top:3px;display:inline-block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="'+pcaAttr(entry.id)+'">'+pcaEsc(entry.id)+'</div>';
            html += '</div>';

            if (!alreadyPending) {
                html += '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;align-self:center;">';
                html += '<button data-pca-action="migrate-add" data-pca-idx="'+origIdx+'" class="pca-btn-primary" style="padding:4px 12px;font-size:11px;">📦 迁移</button>';
                // 目标已有同名条目时多一个「复制为新条目」入口（生成新 ID，作为独立条目入队列）
                if (st.exists) {
                    html += '<button data-pca-action="migrate-add-as-new" data-pca-idx="'+origIdx+'" class="pca-btn" style="padding:4px 10px;font-size:11px;color:'+pcaC.success+';border-color:rgba(110,207,138,0.3);" title="保留目标已有那条，再新增一份此条目（生成新 ID）">🆕 复制为新条目</button>';
                }
                html += '<button data-pca-action="migrate-edit" data-pca-idx="'+origIdx+'" class="pca-btn" style="padding:4px 10px;font-size:11px;">✏️ 编辑后迁移</button>';
                html += '</div>';
            }

            html += '</div>';
            html += '<div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">';
            html += '<span data-pca-action="migrate-preview" data-pca-idx="'+origIdx+'" style="font-size:11px;color:'+pcaC.dim+';border:1px solid '+pcaC.border+';border-radius:4px;padding:2px 8px;">👁 预览</span>';
            if (st.exists && !st.contentSame) {
                html += '<span data-pca-action="migrate-diff" data-pca-idx="'+origIdx+'" style="font-size:11px;color:'+pcaC.gold+';background:rgba(212,168,83,0.1);border:1px solid '+pcaC.goldDim+';border-radius:4px;padding:2px 8px;">⚡ 差异对比</span>';
            }
            html += '</div>';
            html += '<div id="pca-mpv-'+origIdx+'" style="display:none;margin-top:6px;"></div>';
            html += '</div>';
        });
    }

    // 底部留白，避免被悬浮队列遮挡（手机端用 dvh 兜底，避免占用过多可视区）
    html += '<div style="height:'+(pcaState.migrateQueueExpanded?'min(280px,45dvh)':'52px')+';flex-shrink:0;"></div>';

    wrap.innerHTML = html;

    var searchInput = pcaGetDoc().querySelector('#pca-migrate-search');
    if (searchInput) {
        searchInput.addEventListener('compositionstart', function() { pcaComposing = true; });
        searchInput.addEventListener('compositionend', function() {
            pcaComposing = false;
            pcaState.migrateSearch = this.value;
            pcaRenderMigrate();
        });
        searchInput.addEventListener('input', function() {
            if (pcaComposing) return;
            pcaState.migrateSearch = this.value;
            pcaRenderMigrate();
        });
    }
    var jumpInput = pcaGetDoc().querySelector('#pca-migrate-jump');
    if (jumpInput) {
        jumpInput.addEventListener('keydown', function(e) {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            var n = parseInt(this.value, 10);
            if (!n || n < 1 || n > leftEntries.length) { toastr.warning('请输入 1 ~ '+leftEntries.length); return; }
            pcaJumpToEntry('migrate', n);
        });
    }
    var noteInput = pcaGetDoc().querySelector('#pca-note-input');
    if (noteInput) {
        noteInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') pcaAddNote();
        });
    }

    pcaRenderQueueDock();
}

function pcaRenderQueueDock() {
    var doc = pcaGetDoc();
    var root = doc.querySelector('#pca-root');
    if (!root) return;

    var existing = root.querySelector('#pca-queue-dock');
    if (existing) existing.remove();

    if (pcaState.activeTab !== 'migrate') return;

    var pendingCount = pcaState.migratePending.length;
    var expanded = pcaState.migrateQueueExpanded;

    var dock = doc.createElement('div');
    dock.id = 'pca-queue-dock';
    // 留出右侧空间不遮挡内容区滚动条（约 12-14px）
    dock.style.cssText = 'position:absolute;left:0;right:14px;bottom:0;background:'+pcaC.card2+';border-top:1px solid '+pcaC.migrateBorder+';box-shadow:0 -4px 16px rgba(0,0,0,0.4);z-index:10;max-height:'+(expanded?'min(320px,50dvh)':'44px')+';display:flex;flex-direction:column;transition:max-height 0.2s;';

    var html = '';
    // 顶部条
    html += '<div style="padding:10px 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;user-select:none;">';
    html += '<div data-pca-action="queue-toggle" style="display:flex;align-items:center;gap:10px;cursor:pointer;flex:1;">';
    html += '<span style="font-size:13px;font-weight:600;color:'+pcaC.migrate+';">📦 待迁移队列</span>';
    if (pendingCount > 0) {
        html += '<span style="background:'+pcaC.migrate+';color:#fff;font-size:11px;font-weight:700;padding:1px 8px;border-radius:10px;">'+pendingCount+'</span>';
    } else {
        html += '<span style="font-size:11px;color:'+pcaC.dim+';">（队列为空）</span>';
    }
    html += '</div>';
    html += '<div style="display:flex;align-items:center;gap:8px;">';
    html += '<span data-pca-action="conf-help-popover" style="font-size:11px;color:'+pcaC.gold+';border:1px solid '+pcaC.goldDim+';border-radius:6px;padding:3px 10px;cursor:help;white-space:nowrap;" title="点击查看智能定位置信度说明">📍 智能定位置信度说明</span>';
    html += '<span data-pca-action="queue-toggle" style="font-size:14px;color:'+pcaC.dim+';cursor:pointer;padding:0 4px;">'+(expanded?'▼':'▲')+'</span>';
    html += '</div>';
    html += '</div>';

    if (expanded) {
        // 列表
        html += '<div style="flex:1;overflow-y:auto;padding:0 18px 8px;">';
        if (pendingCount === 0) {
            html += '<div style="text-align:center;padding:20px;color:'+pcaC.dim+';font-size:12px;">从上方点击「📦 迁移」按钮添加条目</div>';
        } else {
            pcaState.migratePending.forEach(function(p, pi) {
                var typeLabel = p.action === 'overwrite' ? '<span style="color:'+pcaC.gold+';">覆盖</span>' : '<span style="color:'+pcaC.success+';">新建</span>';
                var posLabel = '';
                if (p.action === 'new') {
                    if (p.insertAfterName) {
                        posLabel = ' → 在「'+pcaEsc(p.insertAfterName)+'」后';
                    } else if (p.insertBeforeName) {
                        posLabel = ' → 在「'+pcaEsc(p.insertBeforeName)+'」前';
                    } else if (p.insertIndex === 0) {
                        posLabel = ' → 最顶部';
                    } else {
                        posLabel = ' → 末尾';
                    }
                }
                // 置信度色标
                var confTag = '';
                if (p.action === 'new') {
                    if (p.confidence === 'high') confTag = '<span title="智能定位：高置信" style="color:'+pcaC.success+';font-size:10px;margin-left:4px;">🟢</span>';
                    else if (p.confidence === 'medium') confTag = '<span title="智能定位：中置信" style="color:'+pcaC.gold+';font-size:10px;margin-left:4px;">🟡</span>';
                    else if (p.confidence === 'low') confTag = '<span title="智能定位：低置信，建议手工调整" style="color:'+pcaC.danger+';font-size:10px;margin-left:4px;">🔴</span>';
                }
                var editedTag = p._edited ? '<span title="内容已编辑" style="color:'+pcaC.gold+';font-size:10px;margin-left:4px;">✏️</span>' : '';
                html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);flex-wrap:wrap;">';
                html += '<span style="font-size:12px;color:'+pcaC.text+';flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+typeLabel+confTag+editedTag+' '+pcaEsc(p.entry.name)+'<span style="color:'+pcaC.dim+';font-size:11px;">'+posLabel+'</span></span>';
                html += '<span data-pca-action="migrate-repos" data-pca-idx="'+pi+'" style="font-size:11px;color:'+pcaC.migrate+';flex-shrink:0;cursor:pointer;padding:0 6px;" title="改位置">📍</span>';
                html += '<span data-pca-action="migrate-edit-pending" data-pca-idx="'+pi+'" style="font-size:11px;color:'+pcaC.gold+';flex-shrink:0;cursor:pointer;padding:0 6px;" title="编辑此队列项">✏️</span>';
                html += '<span data-pca-action="migrate-remove" data-pca-idx="'+pi+'" style="font-size:11px;color:'+pcaC.danger+';flex-shrink:0;cursor:pointer;padding:0 6px;">✕</span>';
                html += '</div>';
                if (p.posWarn) {
                    html += '<div style="font-size:10px;color:'+pcaC.gold+';padding:0 0 6px 4px;line-height:1.4;">⚠ '+pcaEsc(p.posWarn)+'</div>';
                }
            });
        }
        html += '</div>';

        // 底部按钮
        html += '<div style="padding:8px 18px;border-top:1px solid '+pcaC.border+';display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;flex-shrink:0;">';
        if (pcaState.migrateUndoStack.length > 0) {
            html += '<button data-pca-action="migrate-undo" class="pca-btn pca-btn-danger" style="padding:4px 10px;font-size:11px;">↩ 撤销</button>';
        }
        if (pendingCount > 0) {
            html += '<button data-pca-action="migrate-clear" class="pca-btn" style="padding:4px 10px;font-size:11px;">清空</button>';
            html += '<button data-pca-action="migrate-apply" class="pca-btn-primary pca-glow" style="padding:5px 16px;font-size:12px;">应用并保存</button>';
        }
        html += '</div>';
    }

    dock.innerHTML = html;
    root.appendChild(dock);
}

function pcaShowInsertPositionPicker(entry, callback) {
    var doc = pcaGetDoc();
    var rightEntries = pcaExtract(pcaState.rightPresetData);

    pcaState.migratePending.forEach(function(p) {
        if (p.action === 'new') {
            var idx = p.insertIndex !== undefined ? p.insertIndex : rightEntries.length;
            if (idx > rightEntries.length) idx = rightEntries.length;
            rightEntries.splice(idx, 0, p.entry);
        }
    });

    var existingDialog = doc.querySelector('dialog.popup:has(#pca-root)');
    var html = '<div class="pca-modal-overlay" id="pca-insert-overlay">';
    html += '<div style="background:'+pcaC.bg+';border:1px solid '+pcaC.border+';border-radius:14px;width:min(600px,96vw);max-height:min(80vh,720px);max-height:min(80dvh,720px);display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.6);">';

    html += '<div style="padding:14px 20px;border-bottom:1px solid '+pcaC.border+';flex-shrink:0;">';
    html += '<div style="font-size:15px;font-weight:700;color:'+pcaC.migrate+';margin-bottom:6px;">📍 选择插入位置</div>';
    html += '<div style="font-size:12px;color:'+pcaC.dim+';word-break:break-word;">将「<span style="color:'+pcaC.pink+';">'+pcaEsc(entry.name)+'</span>」插入到「'+pcaEsc(pcaState.rightName)+'」</div>';
    html += '<div style="font-size:11px;color:'+pcaC.dim+';margin-top:4px;">点击 <span style="color:'+pcaC.migrate+';">➕</span> 选择位置</div>';
    html += '</div>';

    html += '<div style="flex:1;overflow-y:auto;padding:10px 16px;">';

    html += '<div class="pca-insert-line" data-pca-action="pick-pos" data-pca-pos="0" style="display:flex;align-items:center;gap:8px;padding:6px 12px;margin:4px 0;border:1px dashed '+pcaC.border+';border-radius:6px;">';
    html += '<span class="pca-insert-icon" style="color:'+pcaC.dim+';font-size:14px;transition:all 0.15s;">➕</span>';
    html += '<span style="font-size:11px;color:'+pcaC.dim+';">插入到最顶部</span>';
    html += '</div>';

    rightEntries.forEach(function(e, idx) {
        html += '<div class="pca-entry-item" style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:'+pcaC.card+';border:1px solid '+pcaC.border+';border-radius:6px;margin:2px 0;">';
        html += '<span style="font-size:10px;color:'+pcaC.dim+';min-width:24px;text-align:right;flex-shrink:0;">#'+(idx+1)+'</span>';
        html += '<span style="color:'+(e.enabled?pcaC.pink:pcaC.off)+';font-size:10px;flex-shrink:0;">'+(e.enabled?'●':'○')+'</span>';
        html += '<span style="font-size:12px;color:'+pcaC.text+';flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+pcaEsc(e.name)+'</span>';
        if (e.marker) html += '<span style="font-size:9px;color:'+pcaC.gold+';flex-shrink:0;">📌</span>';
        html += '</div>';

        html += '<div class="pca-insert-line" data-pca-action="pick-pos" data-pca-pos="'+(idx+1)+'" data-pca-after="'+pcaAttr(e.name)+'" style="display:flex;align-items:center;gap:8px;padding:6px 12px;margin:4px 0;border:1px dashed '+pcaC.border+';border-radius:6px;">';
        html += '<span class="pca-insert-icon" style="color:'+pcaC.dim+';font-size:14px;transition:all 0.15s;">➕</span>';
        html += '<span style="font-size:11px;color:'+pcaC.dim+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">在「'+pcaEsc(e.name)+'」之后</span>';
        html += '</div>';
    });

    html += '</div>';

    html += '<div style="padding:12px 20px;border-top:1px solid '+pcaC.border+';text-align:right;flex-shrink:0;">';
    html += '<button data-pca-action="pick-cancel" class="pca-modal-btn">取消</button>';
    html += '</div>';

    html += '</div></div>';

    var overlay = doc.createElement('div');
    overlay.innerHTML = html;
    var overlayEl = overlay.firstChild;
    if (existingDialog) { existingDialog.appendChild(overlayEl); } else { doc.body.appendChild(overlayEl); }

    overlayEl.addEventListener('click', function(e) {
        e.stopPropagation();
        var thisOverlay = doc.querySelector('#pca-insert-overlay');
        var target = e.target;
        while (target && target !== thisOverlay) {
            if (target.getAttribute && target.getAttribute('data-pca-action')) break;
            target = target.parentElement;
        }
        if (!target || target === thisOverlay) {
            if (e.target === thisOverlay) { thisOverlay.remove(); callback(-1, ''); }
            return;
        }
        var action = target.getAttribute('data-pca-action');
        if (action === 'pick-pos') {
            var pos = parseInt(target.getAttribute('data-pca-pos'), 10);
            var afterName = target.getAttribute('data-pca-after') || '';
            thisOverlay.remove();
            callback(pos, afterName);
        } else if (action === 'pick-cancel') {
            thisOverlay.remove();
            callback(-1, '');
        }
    });
}

function pcaShowConfirm(message, callback, options) {
    options = options || {};
    var yesText = options.yesText || '确认';
    var noText = options.noText || '取消';
    var yesColor = options.yesColor || pcaC.gold;
    var yesColorDim = options.yesColorDim || pcaC.goldDim;
    var doc = pcaGetDoc();
    var existingDialog = doc.querySelector('dialog.popup:has(#pca-root)');
    var html = '<div class="pca-modal-overlay" id="pca-confirm-overlay">';
    html += '<div style="background:'+pcaC.bg+';border:1px solid '+pcaC.border+';border-radius:12px;padding:24px;width:min(420px,94vw);box-shadow:0 8px 32px rgba(0,0,0,0.6);">';
    html += '<div style="font-size:14px;color:'+pcaC.text+';margin-bottom:16px;line-height:1.5;">'+message+'</div>';
    html += '<div style="display:flex;justify-content:flex-end;gap:10px;">';
    html += '<button data-pca-action="confirm-no" class="pca-modal-btn">'+pcaEsc(noText)+'</button>';
    html += '<button data-pca-action="confirm-yes" class="pca-modal-btn-primary">'+pcaEsc(yesText)+'</button>';
    html += '</div></div></div>';

    var overlay = doc.createElement('div');
    overlay.innerHTML = html;
    var overlayEl = overlay.firstChild;
    if (existingDialog) { existingDialog.appendChild(overlayEl); } else { doc.body.appendChild(overlayEl); }

    overlayEl.addEventListener('click', function(e) {
        e.stopPropagation();
        var thisOverlay = doc.querySelector('#pca-confirm-overlay');
        var target = e.target;
        while (target && target !== thisOverlay) {
            if (target.getAttribute && target.getAttribute('data-pca-action')) break;
            target = target.parentElement;
        }
        if (!target) return;
        var action = target.getAttribute('data-pca-action');
        if (action === 'confirm-yes') { thisOverlay.remove(); callback(true); }
        else if (action === 'confirm-no') { thisOverlay.remove(); callback(false); }
        else if (target === thisOverlay) { thisOverlay.remove(); callback(false); }
    });
}

// ============ 编辑器（新增功能） ============

function pcaCloseEditor(force) {
    var doc = pcaGetDoc();
    var ov = doc.querySelector('#pca-editor-overlay');
    if (!ov) return;
    var es = pcaState.editorState;
    if (es && !force) {
        // 同步当前textarea内容到草稿
        var ta = doc.querySelector('#pca-ed-textarea');
        if (ta && es.activeVersion) {
            pcaState.editorDrafts[es.entryId] = pcaState.editorDrafts[es.entryId] || {};
            pcaState.editorDrafts[es.entryId][es.activeVersion] = ta.value;
        }
        // 检查是否有未保存修改
        var dirty = pcaEditorIsDirty();
        if (dirty) {
            pcaShowConfirm(
                '⚠️ 编辑内容尚未提交，关闭后将丢失所有修改<br><br>确定丢弃修改并关闭吗？',
                function(confirmed) { if (confirmed) { pcaState.editorState=null; ov.remove(); var __mr2=pcaGetDoc().querySelector('#pca-ed-linemirror'); if(__mr2)__mr2.remove(); } },
                { yesText:'丢弃并关闭', noText:'继续编辑', yesColor:pcaC.danger, yesColorDim:'#a04050' }
            );
            return;
        }
    }
    pcaState.editorState = null;
    ov.remove();
    var __mr = pcaGetDoc().querySelector('#pca-ed-linemirror');
    if (__mr) __mr.remove();
}

function pcaEditorIsDirty() {
    var es = pcaState.editorState;
    if (!es) return false;
    var drafts = pcaState.editorDrafts[es.entryId] || {};
    if (drafts.left !== undefined && drafts.left !== es.originalLeft) return true;
    if (drafts.right !== undefined && drafts.right !== (es.originalRight || '')) return true;
    return false;
}

// ========== 字段编辑（二级面板）辅助 ==========
// ST 预设条目的可识别字段及取值
var PCA_FIELD_ROLES = ['system', 'user', 'assistant'];
var PCA_FIELD_POSITIONS = [
    { v: 0, label: 'Relative（相对位置）' },
    { v: 1, label: 'In-chat（按深度注入）' }
];
var PCA_FIELD_TRIGGERS = ['normal', 'continue', 'impersonate', 'swipe', 'regenerate', 'quiet'];
var PCA_RESERVED_IDS = ['main', 'nsfw', 'jailbreak', 'enhanceDefinitions', 'worldInfoBefore', 'worldInfoAfter', 'charDescription', 'charPersonality', 'scenario', 'personaDescription', 'dialogueExamples', 'chatHistory'];

function pcaIsReservedId(id) {
    if (!id) return false;
    return PCA_RESERVED_IDS.indexOf(id) >= 0;
}

// 从源预设找原始 prompt（保留所有字段）
function pcaEditorPickRawFields(entry) {
    var raw = null;
    try {
        var leftPreset = pcaState.leftPresetData;
        if (!leftPreset || !Array.isArray(leftPreset.prompts)) return null;
        var origId = entry._origId || null;
        if (origId) {
            for (var i = 0; i < leftPreset.prompts.length; i++) {
                if (leftPreset.prompts[i] && leftPreset.prompts[i].identifier === origId) { raw = leftPreset.prompts[i]; break; }
            }
        }
        if (!raw) {
            for (var j = 0; j < leftPreset.prompts.length; j++) {
                var pp = leftPreset.prompts[j];
                if (pp && (pp.identifier === entry.id || pp.name === entry.name)) { raw = pp; break; }
            }
        }
    } catch(_e) {}
    return raw;
}

// 构造编辑器面板的字段默认值（合并：原始 raw → entry → existingOverrides）
function pcaEditorBuildFieldDefaults(raw, entry, existing) {
    raw = raw || {};
    existing = existing || {};
    function pick(key, fallback) {
        if (existing && Object.prototype.hasOwnProperty.call(existing, key)) return existing[key];
        if (raw && Object.prototype.hasOwnProperty.call(raw, key)) return raw[key];
        return fallback;
    }
    return {
        identifier: pick('identifier', entry.id || ''),
        name: pick('name', entry.name || ''),
        role: pick('role', entry.role || 'system'),
        injection_position: pick('injection_position', 0),
        injection_depth: pick('injection_depth', 4),
        injection_order: pick('injection_order', 100),
        injection_trigger: (function(){
            var v = pick('injection_trigger', null);
            if (v === null || v === undefined) return null;
            if (Array.isArray(v)) return v.slice();
            return null;
        })(),
        system_prompt: !!pick('system_prompt', false),
        marker: !!pick('marker', !!entry.marker),
        forbid_overrides: !!pick('forbid_overrides', false),
    };
}

function pcaOpenEditor(entry, options) {
    options = options || {};
    var doc = pcaGetDoc();
    if (doc.querySelector('#pca-editor-overlay')) return;

    // 找右侧匹配（用于参考栏 + 版本切换）
    var rightMatch = null;
    pcaState.rightEntries.forEach(function(re) {
        if (re.id === entry.id || re.name === entry.name) rightMatch = re;
    });

    // 队列已有项的覆盖：如果是从队列里再编辑，初始内容用队列里那份
    var pendingItem = null;
    pcaState.migratePending.forEach(function(p) { if (p.entry.id === entry.id) pendingItem = p; });

    var leftContent = entry.content || '';
    var rightContent = rightMatch ? (rightMatch.content || '') : '';
    var hasRight = !!rightMatch;
    var hasDiff = hasRight && (leftContent !== rightContent);

    // 默认选中版本
    var defaultVersion = 'left';
    if (pendingItem && pendingItem._editedFrom) {
        defaultVersion = pendingItem._editedFrom;
    }

    // 初始化草稿（如果是从队列再编辑，用队列里的内容覆盖对应版本草稿）
    if (!pcaState.editorDrafts[entry.id]) pcaState.editorDrafts[entry.id] = {};
    if (pendingItem) {
        pcaState.editorDrafts[entry.id][defaultVersion] = pendingItem.entry.content || '';
    }

    // 从源预设取原始 prompt 字段（用于字段编辑面板初值），匹配优先 _origId（复制为新条目时） → identifier → name
    var rawFields = pcaEditorPickRawFields(entry);
    // 已有的字段覆写（来自 pending 或 entry._fieldOverrides）
    var existingOverrides = (pendingItem && pendingItem.fieldOverrides) || entry._fieldOverrides || null;
    var fieldOverrides = pcaEditorBuildFieldDefaults(rawFields, entry, existingOverrides);
    pcaState.editorState = {
        entryId: entry.id,
        entryName: entry.name,
        leftEntry: entry,
        rightEntry: rightMatch,
        hasRight: hasRight,
        hasDiff: hasDiff,
        activeVersion: defaultVersion,
        originalLeft: leftContent,
        originalRight: rightContent,
        referenceVisible: hasRight,
        fromPendingIdx: pendingItem ? pcaState.migratePending.indexOf(pendingItem) : -1,
        // 字段编辑：当前生效值（用户改过的 + 源原始值）
        fieldOverrides: fieldOverrides,
        rawFields: rawFields,
        fieldsView: false,
        // 条目编辑模式：true 时保存进 editPending（自改 / 反向），false 时走 migrate 流程
        isEditTarget: !!options.isEditTarget,
        // 条目编辑模式下，记录"目标在哪一侧"，仅用于标题展示（与 activeVersion 解耦）
        editTargetSide: !!options.isEditTarget ? (pcaState.editTarget || 'right') : '',
    };

    var ov = doc.createElement('div');
    ov.id = 'pca-editor-overlay';
    ov.className = 'pca-modal-overlay';
    ov.innerHTML = pcaBuildEditorHTML();

    var existingDialog = doc.querySelector('dialog.popup:has(#pca-root)');
    if (existingDialog) existingDialog.appendChild(ov); else doc.body.appendChild(ov);

    pcaBindEditor();
    pcaEditorRefreshPasteHint();
    pcaEditorRefreshContent();
}

function pcaBuildFieldsPanelHTML() {
    var es = pcaState.editorState;
    var fo = es.fieldOverrides;
    var idLocked = pcaIsReservedId(fo.identifier);
    var pad = 'padding:6px 8px;background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:6px;color:'+pcaC.text+';font-size:12px;font-family:inherit;outline:none;width:100%;box-sizing:border-box;';
    var rowLabel = 'font-size:11px;color:'+pcaC.dim+';margin-bottom:4px;font-weight:600;';
    var section = 'margin-bottom:14px;';
    var hint = 'font-size:10px;color:'+pcaC.dim+';margin-top:3px;line-height:1.4;';
    var h = '';
    h += '<div id="pca-ed-fields-panel" style="flex:1;min-height:0;overflow-y:auto;padding:14px 18px 8px;">';
    h += '<div style="font-size:11px;color:'+pcaC.gold+';margin-bottom:14px;line-height:1.5;background:rgba(212,168,83,0.08);border-left:3px solid '+pcaC.goldDim+';padding:8px 10px;border-radius:4px;">⚙ 这里编辑的是「<b>迁移到目标预设时</b>」该条目的字段。修改不影响源预设。点「✓ 保存字段」生效，再回正文编辑。</div>';

    // 基础区
    h += '<div style="'+section+'"><div style="'+rowLabel+'">📛 名称（name）</div>';
    h += '<input id="pca-fld-name" type="text" value="'+pcaAttr(fo.name||'')+'" style="'+pad+'" />';
    h += '</div>';

    h += '<div style="'+section+'"><div style="'+rowLabel+'">🆔 ID（identifier）</div>';
    if (idLocked) {
        h += '<input id="pca-fld-id" type="text" value="'+pcaAttr(fo.identifier||'')+'" style="'+pad+'opacity:0.7;cursor:not-allowed;" readonly />';
        h += '<div style="'+hint+';color:'+pcaC.danger+';">⚠ 「'+pcaEsc(fo.identifier)+'」是 ST 保留 ID，不能修改（修改后 ST 找不到主入口）</div>';
    } else {
        h += '<div style="display:flex;gap:6px;">';
        h += '<input id="pca-fld-id" type="text" value="'+pcaAttr(fo.identifier||'')+'" style="'+pad+'flex:1;" />';
        h += '<button data-pca-action="ed-fields-newid" class="pca-modal-btn" style="padding:5px 12px;font-size:11px;flex-shrink:0;" title="生成新 UUID">🎲 新 ID</button>';
        h += '</div>';
        h += '<div style="'+hint+'">改 ID 后等同新建一个条目；如目标预设已存在该 ID 的条目，会被本条覆盖</div>';
    }
    h += '</div>';

    h += '<div style="'+section+'"><div style="'+rowLabel+'">🎭 角色（role）</div>';
    h += '<select id="pca-fld-role" style="'+pad+'">';
    PCA_FIELD_ROLES.forEach(function(r){
        var sel = (fo.role === r) ? ' selected' : '';
        h += '<option value="'+pcaAttr(r)+'"'+sel+'>'+pcaEsc(r)+'</option>';
    });
    h += '</select>';
    h += '</div>';

    // 注入位置区
    h += '<div style="'+section+'border-top:1px dashed '+pcaC.border+';padding-top:14px;">';
    h += '<div style="'+rowLabel+'">📍 注入位置（injection_position）</div>';
    h += '<select id="pca-fld-pos" style="'+pad+'">';
    PCA_FIELD_POSITIONS.forEach(function(p){
        var sel = (Number(fo.injection_position) === p.v) ? ' selected' : '';
        h += '<option value="'+p.v+'"'+sel+'>'+pcaEsc(p.label)+'</option>';
    });
    h += '</select>';
    h += '<div style="'+hint+'">Relative：跟随条目顺序；In-chat：按下方深度插入到聊天历史中</div>';
    h += '</div>';

    h += '<div style="'+section+'display:flex;gap:10px;">';
    h += '<div style="flex:1;"><div style="'+rowLabel+'">🌊 深度（depth）</div>';
    h += '<input id="pca-fld-depth" type="number" min="0" max="100" value="'+(fo.injection_depth!=null?fo.injection_depth:4)+'" style="'+pad+'" />';
    h += '<div style="'+hint+'">In-chat 模式下生效</div></div>';
    h += '<div style="flex:1;"><div style="'+rowLabel+'">🔢 顺序（order）</div>';
    h += '<input id="pca-fld-order" type="number" min="0" value="'+(fo.injection_order!=null?fo.injection_order:100)+'" style="'+pad+'" />';
    h += '<div style="'+hint+'">同位置时按 order 排序</div></div>';
    h += '</div>';

    // 触发器
    h += '<div style="'+section+'border-top:1px dashed '+pcaC.border+';padding-top:14px;">';
    h += '<div style="'+rowLabel+'">⚡ 触发器（injection_trigger）</div>';
    var trigEnabled = Array.isArray(fo.injection_trigger);
    h += '<label style="display:flex;align-items:center;gap:6px;font-size:12px;color:'+pcaC.text+';margin-bottom:8px;cursor:pointer;">';
    h += '<input type="checkbox" id="pca-fld-trig-enable"'+(trigEnabled?' checked':'')+' style="cursor:pointer;" /> 启用触发器限制（不勾 = 任何时候都注入）';
    h += '</label>';
    h += '<div id="pca-fld-trig-list" style="display:'+(trigEnabled?'flex':'none')+';flex-wrap:wrap;gap:6px;padding:8px;background:'+pcaC.card+';border-radius:6px;border:1px solid '+pcaC.border+';">';
    PCA_FIELD_TRIGGERS.forEach(function(t){
        var checked = trigEnabled && fo.injection_trigger.indexOf(t) >= 0;
        h += '<label style="display:flex;align-items:center;gap:4px;font-size:11px;color:'+pcaC.text+';cursor:pointer;padding:3px 8px;background:'+(checked?pcaC.migrateBg:pcaC.input)+';border:1px solid '+(checked?pcaC.migrateBorder:pcaC.border)+';border-radius:4px;">';
        h += '<input type="checkbox" data-pca-trig="'+pcaAttr(t)+'"'+(checked?' checked':'')+' style="cursor:pointer;" /> '+pcaEsc(t);
        h += '</label>';
    });
    h += '</div>';
    h += '<div style="'+hint+'">勾选后：仅在所选场景触发；如你的 ST 版本不支持此字段，保持不勾即可</div>';
    h += '</div>';

    // 布尔开关
    h += '<div style="'+section+'border-top:1px dashed '+pcaC.border+';padding-top:14px;">';
    h += '<div style="display:flex;flex-direction:column;gap:8px;">';
    function bool(id, label, val, tip) {
        var rh = '';
        rh += '<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:'+pcaC.text+';cursor:pointer;">';
        rh += '<input type="checkbox" id="'+id+'"'+(val?' checked':'')+' style="cursor:pointer;width:14px;height:14px;" />';
        rh += '<span>'+pcaEsc(label)+'</span>';
        if (tip) rh += '<span style="font-size:10px;color:'+pcaC.dim+';">'+pcaEsc(tip)+'</span>';
        rh += '</label>';
        return rh;
    }
    h += bool('pca-fld-syspr', '系统主入口（system_prompt）', fo.system_prompt, '保留 ID 通常为 true');
    h += bool('pca-fld-marker', '标记条目（marker）', fo.marker, '占位符，无 content');
    h += bool('pca-fld-forbid', '禁止覆盖（forbid_overrides）', fo.forbid_overrides, '');
    h += '</div></div>';

    h += '</div>'; // panel

    // 底部按钮（独立 div，ID 化方便切显隐，全用 modal 类保证样式生效）
    h += '<div id="pca-ed-fields-bottom" style="padding:10px 18px;border-top:1px solid '+pcaC.border+';display:flex;gap:8px;justify-content:space-between;flex-shrink:0;flex-wrap:wrap;">';
    h += '<button data-pca-action="ed-fields-reset" class="pca-modal-btn" style="color:'+pcaC.danger+';border-color:rgba(224,96,112,0.3);">↺ 重置为源预设值</button>';
    h += '<div style="display:flex;gap:8px;">';
    h += '<button data-pca-action="ed-fields-cancel" class="pca-modal-btn">取消</button>';
    h += '<button data-pca-action="ed-fields-save" class="pca-modal-btn-primary">✓ 保存字段</button>';
    h += '</div>';
    h += '</div>';

    return h;
}

function pcaBuildEditorHTML() {
    var es = pcaState.editorState;
    var h = '';
    h += '<div class="pca-ed-modal" style="background:'+pcaC.bg+';border:1px solid '+pcaC.border+';border-radius:14px;width:780px;max-width:96vw;max-height:92vh;max-height:92dvh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.6);">';

    // 头部
    h += '<div style="padding:12px 18px;border-bottom:1px solid '+pcaC.border+';display:flex;align-items:center;justify-content:space-between;flex-shrink:0;gap:10px;">';
    h += '<div style="flex:1;min-width:0;">';
    h += '<div style="font-size:14px;font-weight:700;color:'+pcaC.migrate+';margin-bottom:3px;">✏️ 编辑后迁移</div>';
    h += '<div style="font-size:12px;color:'+pcaC.text+';overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+pcaEsc(es.entryName)+' <span style="font-size:10px;color:'+pcaC.dim+';">('+pcaEsc(es.entryId)+')</span></div>';
    h += '</div>';
    h += '<div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">';
    var fieldsActive = !!es.fieldsView;
    h += '<span data-pca-action="ed-toggle-fields" class="pca-ed-btn" style="'+(fieldsActive?'color:'+pcaC.gold+';border-color:'+pcaC.goldDim+';':'')+'" title="编辑此条目的字段（name/id/role/位置/触发器等）">⚙ 字段</span>';
    h += '<span data-pca-action="ed-close" style="color:'+pcaC.dim+';font-size:20px;padding:4px 8px;cursor:pointer;">✕</span>';
    h += '</div>';
    h += '</div>';

    // 版本切换 tabs（仅当目标已有时显示）
    if (es.hasRight) {
        h += '<div id="pca-ed-tabs-bar" style="padding:8px 18px 0;border-bottom:1px solid '+pcaC.border+';display:flex;gap:4px;align-items:flex-end;flex-shrink:0;flex-wrap:wrap;">';
        h += '<span data-pca-action="ed-switch-ver" data-pca-ver="left" class="pca-ed-tab'+(es.activeVersion==='left'?' active':'')+'">📁 旧版（左）'+(es.hasDiff?' ⚡':'')+'</span>';
        h += '<span data-pca-action="ed-switch-ver" data-pca-ver="right" class="pca-ed-tab'+(es.activeVersion==='right'?' active':'')+'">📂 新版（右）'+(es.hasDiff?' ⚡':'')+'</span>';
        h += '<span style="font-size:10px;color:'+pcaC.dim+';margin-left:auto;padding:0 4px 6px;">'+(es.hasDiff?'⚡ 两版本内容有差异':'两版本内容相同')+'</span>';
        h += '</div>';
    }

    // 工具栏
    h += '<div id="pca-ed-toolbar" style="padding:8px 18px;border-bottom:1px solid '+pcaC.border+';display:flex;gap:6px;flex-wrap:wrap;flex-shrink:0;align-items:center;">';
    h += '<span data-pca-action="ed-tool" data-pca-tool="selectall" class="pca-ed-btn">全选</span>';
    h += '<span data-pca-action="ed-tool" data-pca-tool="copy" class="pca-ed-btn">📋 复制</span>';
    h += '<span id="pca-ed-paste-btn" data-pca-action="ed-tool" data-pca-tool="paste" class="pca-ed-btn" title="点击粘贴；优先系统剪贴板，否则使用脚本暗存内容">📥 粘贴</span>';
    h += '<span id="pca-ed-paste-hint" style="font-size:10px;color:'+pcaC.dim+';align-self:center;display:none;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>';
    h += '<span data-pca-action="ed-tool" data-pca-tool="undo" class="pca-ed-btn">↶ 撤销</span>';
    h += '<span data-pca-action="ed-tool" data-pca-tool="redo" class="pca-ed-btn">↷ 重做</span>';
    h += '<span data-pca-action="ed-tool" data-pca-tool="reset" class="pca-ed-btn" style="color:'+pcaC.danger+';border-color:rgba(224,96,112,0.3);">↺ 还原本版</span>';
    var wrapOn = pcaState.editorWrap !== false;
    var wrapLabel = wrapOn ? '🔁 自动换行' : '📐 不换行';
    h += '<span data-pca-action="ed-toggle-wrap" class="pca-ed-btn" title="切换长行是否软换行；不影响实际行数">'+wrapLabel+'</span>';
    if (es.hasRight) {
        var refLabel = es.referenceVisible ? '🙈 隐藏参考' : '👁 显示参考';
        h += '<span data-pca-action="ed-toggle-ref" class="pca-ed-btn" style="margin-left:auto;color:'+pcaC.gold+';border-color:'+pcaC.goldDim+';">'+refLabel+'</span>';
    }
    h += '</div>';

    // 主体（编辑区 + 参考区，各占一半，可上下滚动）
    h += '<div id="pca-ed-body" style="flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;">';

    // 编辑区
    h += '<div style="flex:'+(es.hasRight?'1':'1 1 100%')+';min-height:140px;padding:10px 18px;display:flex;flex-direction:column;overflow:hidden;">';
    h += '<div style="font-size:11px;color:'+pcaC.dim+';margin-bottom:4px;display:flex;justify-content:space-between;flex-shrink:0;">';
    h += '<span id="pca-ed-active-label">正在编辑</span>';
    h += '<span id="pca-ed-stats" style="font-size:10px;"></span>';
    h += '</div>';
    // textarea + 行号容器
    h += '<div style="flex:1;min-height:120px;display:flex;background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:6px;overflow:hidden;">';
    h += '<div id="pca-ed-linenums" style="flex-shrink:0;background:'+pcaC.card+';color:'+pcaC.off+';font-family:Consolas,Menlo,monospace;font-size:14px;line-height:1.6;padding:10px 6px 24px 10px;text-align:right;user-select:none;overflow:hidden;min-width:36px;max-height:100%;border-right:1px solid '+pcaC.border+';white-space:pre;box-sizing:border-box;align-self:stretch;"></div>';
    var taWrapAttr = (pcaState.editorWrap !== false) ? 'soft' : 'off';
    var taWhite = (pcaState.editorWrap !== false) ? 'pre-wrap' : 'pre';
    var taOverflowX = (pcaState.editorWrap !== false) ? 'hidden' : 'auto';
    var taWordBreak = (pcaState.editorWrap !== false) ? 'break-word' : 'normal';
    h += '<textarea id="pca-ed-textarea" wrap="'+taWrapAttr+'" style="flex:1;min-width:0;border:none!important;border-radius:0!important;background:transparent!important;line-height:1.6!important;padding:10px 12px!important;font-size:14px!important;font-family:Consolas,Menlo,monospace!important;white-space:'+taWhite+'!important;overflow-x:'+taOverflowX+'!important;overflow-y:auto!important;word-break:'+taWordBreak+'!important;"></textarea>';
    h += '</div>';
    h += '</div>';

    // 参考区
    if (es.hasRight) {
        h += '<div id="pca-ed-ref-container" style="flex:'+(es.referenceVisible?'1':'0 0 0')+';min-height:'+(es.referenceVisible?'120px':'0')+';border-top:1px solid '+pcaC.border+';display:'+(es.referenceVisible?'flex':'none')+';flex-direction:column;overflow:hidden;">';
        h += '<div style="padding:8px 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:'+pcaC.card+';flex-wrap:wrap;gap:6px;">';
        h += '<span id="pca-ed-ref-label" style="font-size:12px;font-weight:600;color:'+pcaC.gold+';">📖 另一版本（参考）</span>';
        h += '</div>';
        h += '<div id="pca-ed-ref-content" style="flex:1;overflow-y:auto;padding:6px 18px 10px;min-height:0;"></div>';
        h += '</div>';
    }

    h += '</div>';

    // 底部按钮
    h += '<div id="pca-ed-bottom-bar" style="padding:10px 18px;border-top:1px solid '+pcaC.border+';display:flex;gap:8px;justify-content:flex-end;flex-shrink:0;flex-wrap:wrap;">';
    h += '<button data-pca-action="ed-cancel" class="pca-modal-btn">取消</button>';
    h += '<button data-pca-action="ed-confirm" class="pca-modal-btn-primary">确认并加入队列</button>';
    h += '</div>';

    h += '</div>';
    return h;
}

function pcaEditorGetCurrentDraft() {
    var es = pcaState.editorState;
    if (!es) return '';
    var drafts = pcaState.editorDrafts[es.entryId] || {};
    if (es.activeVersion === 'left') {
        return drafts.left !== undefined ? drafts.left : es.originalLeft;
    } else {
        return drafts.right !== undefined ? drafts.right : es.originalRight;
    }
}

function pcaEditorUpdateStats() {
    var doc = pcaGetDoc();
    var ta = doc.querySelector('#pca-ed-textarea');
    var st = doc.querySelector('#pca-ed-stats');
    var ln = doc.querySelector('#pca-ed-linenums');
    if (!ta) return;
    var v = ta.value || '';
    var lineCount = 1;
    for (var ci = 0; ci < v.length; ci++) { if (v.charCodeAt(ci) === 10) lineCount++; }
    if (st) st.textContent = v.length + ' 字 / ' + lineCount + ' 行';
    if (ln) {
        var inner = ln.firstChild;
        if (!inner || inner.id !== 'pca-ed-linenums-inner') {
            ln.textContent = '';
            inner = doc.createElement('div');
            inner.id = 'pca-ed-linenums-inner';
            inner.style.cssText = 'font:inherit;color:inherit;line-height:1.6;white-space:pre;padding:0;margin:0;';
            ln.appendChild(inner);
        }
        var wrapOn = (pcaState.editorWrap !== false);
        var nums = '';
        if (!wrapOn) {
            // 不换行模式：每个逻辑行 = 一个视觉行，行号 1:1
            for (var i = 1; i <= lineCount; i++) { nums += i + (i < lineCount ? '\n' : ''); }
        } else {
            // 软换行模式：用镜像 div 测每个逻辑行的视觉行数
            var mirror = doc.querySelector('#pca-ed-linemirror');
            if (!mirror) {
                mirror = doc.createElement('div');
                mirror.id = 'pca-ed-linemirror';
                mirror.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;left:-99999px;top:0;';
                doc.body.appendChild(mirror);
            }
            // 同步关键样式：宽度（textarea 内容宽度 = clientWidth - paddingLeft - paddingRight）、字体、行高、padding、wrap 等
            var cs = ta.ownerDocument.defaultView.getComputedStyle(ta);
            var contentW = ta.clientWidth - parseFloat(cs.paddingLeft||0) - parseFloat(cs.paddingRight||0);
            if (contentW < 10) contentW = 10;
            mirror.style.width = contentW + 'px';
            mirror.style.fontFamily = cs.fontFamily;
            mirror.style.fontSize = cs.fontSize;
            mirror.style.fontWeight = cs.fontWeight;
            mirror.style.lineHeight = cs.lineHeight;
            mirror.style.letterSpacing = cs.letterSpacing;
            mirror.style.tabSize = cs.tabSize || '4';
            mirror.style.whiteSpace = 'pre-wrap';
            mirror.style.wordBreak = cs.wordBreak || 'break-word';
            mirror.style.overflowWrap = cs.overflowWrap || 'anywhere';
            mirror.style.boxSizing = 'content-box';
            mirror.style.padding = '0';
            mirror.style.margin = '0';
            mirror.style.border = '0';
            // 计算单视觉行高度（拿一个空格量）
            mirror.textContent = ' ';
            var oneLineH = mirror.getBoundingClientRect().height || (parseFloat(cs.fontSize) * 1.6);
            // 按 \n 拆每个逻辑行，逐行测高度，转成视觉行数
            var logicalLines = v.split('\n');
            var parts = [];
            for (var li = 0; li < logicalLines.length; li++) {
                var ltext = logicalLines[li];
                if (ltext.length === 0) {
                    parts.push(String(li + 1));
                } else {
                    // 用一个不会被 trim 的占位避免 width 为 0
                    mirror.textContent = ltext + '\u200B';
                    var h = mirror.getBoundingClientRect().height;
                    var visRows = Math.max(1, Math.round(h / oneLineH));
                    var seg = String(li + 1);
                    for (var k = 1; k < visRows; k++) seg += '\n';
                    parts.push(seg);
                }
            }
            nums = parts.join('\n');
        }
        inner.textContent = nums;
        var maxDigits = String(lineCount).length;
        if (maxDigits < 2) maxDigits = 2;
        ln.style.minWidth = (maxDigits * 9 + 16) + 'px';
        ln.scrollTop = ta.scrollTop;
    }
}

function pcaEditorSyncLinenumScroll() {
    var doc = pcaGetDoc();
    var ta = doc.querySelector('#pca-ed-textarea');
    var ln = doc.querySelector('#pca-ed-linenums');
    if (ta && ln) ln.scrollTop = ta.scrollTop;
}

function pcaEditorRefreshContent() {
    var doc = pcaGetDoc();
    var es = pcaState.editorState;
    if (!es) return;
    var ta = doc.querySelector('#pca-ed-textarea');
    var lbl = doc.querySelector('#pca-ed-active-label');
    if (ta) {
        ta.value = pcaEditorGetCurrentDraft();
        pcaEditorUpdateStats();
    }
    if (lbl) {
        // 条目编辑模式下，按 editTargetSide 决定标题，让新建/编辑的条目显示真正的目标预设
        if (es.isEditTarget) {
            if (es.editTargetSide === 'left') {
                lbl.innerHTML = '<span style="color:'+pcaC.text+';font-weight:600;">正在编辑：</span><span style="color:'+pcaC.pink+';font-weight:600;">📁 '+pcaEsc(pcaState.leftName||'旧预设')+'（左）</span>';
            } else {
                lbl.innerHTML = '<span style="color:'+pcaC.text+';font-weight:600;">正在编辑：</span><span style="color:'+pcaC.gold+';font-weight:600;">📂 '+pcaEsc(pcaState.rightName||'新预设')+'（右）</span>';
            }
        } else if (es.activeVersion === 'left') {
            lbl.innerHTML = '<span style="color:'+pcaC.text+';font-weight:600;">正在编辑：</span><span style="color:'+pcaC.pink+';font-weight:600;">📁 旧版（左）</span>';
        } else {
            lbl.innerHTML = '<span style="color:'+pcaC.text+';font-weight:600;">正在编辑：</span><span style="color:'+pcaC.gold+';font-weight:600;">📂 新版（右）</span>';
        }
    }
    pcaEditorRefreshReference();
}

function pcaEditorRefreshReference() {
    var doc = pcaGetDoc();
    var es = pcaState.editorState;
    if (!es || !es.hasRight) return;
    var refEl = doc.querySelector('#pca-ed-ref-content');
    var refLbl = doc.querySelector('#pca-ed-ref-label');
    if (!refEl) return;
    var otherContent = es.activeVersion === 'left' ? es.originalRight : es.originalLeft;
    if (refLbl) {
        refLbl.innerHTML = es.activeVersion === 'left'
            ? '<span style="color:'+pcaC.text+';">📖 参考：</span><span style="color:'+pcaC.gold+';">📂 新版（右）</span>'
            : '<span style="color:'+pcaC.text+';">📖 参考：</span><span style="color:'+pcaC.pink+';">📁 旧版（左）</span>';
    }
    var html = '';
    if (!otherContent) {
        html = '<div style="padding:14px;color:'+pcaC.dim+';font-size:12px;text-align:center;">（另一版本为空）</div>';
    } else if (!es.hasDiff) {
        // 内容相同：纯文本+行号，点击跳转到编辑框对应行
        var lines = otherContent.split('\n');
        html += '<div style="background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:6px;padding:6px 0;font-size:12px;line-height:1.7;font-family:Consolas,monospace;">';
        lines.forEach(function(ln, idx) {
            html += '<div data-pca-action="ed-jump-line" data-pca-jumpline="'+(idx+1)+'" style="padding:1px 10px;color:'+pcaC.dim+';white-space:pre-wrap;word-break:break-all;display:flex;gap:8px;cursor:pointer;">';
            html += '<span style="color:'+pcaC.off+';flex-shrink:0;min-width:32px;text-align:right;user-select:none;">'+(idx+1)+'</span>';
            html += '<span style="flex:1;min-width:0;">'+pcaEsc(ln||' ')+'</span>';
            html += '</div>';
        });
        html += '</div>';
        html += '<div style="margin-top:6px;font-size:10px;color:'+pcaC.dim+';">点击行可跳转到编辑器对应行</div>';
    } else {
        // 有差异：构建 diff，每行显示，并标记行号在编辑器中应该跳转的行
        var aText = pcaEditorGetCurrentDraft();
        var bText = otherContent;
        var diff = pcaDiffLines(aText, bText);

        // 计算每个 diff 项在 A（编辑器）中的"目标跳转行"
        // - same 行：直接对应A中的行号
        // - add 行（B独有）：跳到前面最近一个 same 行（即在A中的位置）的下一行
        var aLineCounter = 0;  // A中行号（1-based）
        var refLineNum = 0;
        var entries = [];
        diff.forEach(function(d) {
            if (d.type === 'same') {
                aLineCounter++;
                entries.push({ d:d, jumpA:aLineCounter });
            } else if (d.type === 'del') {
                aLineCounter++;
                // del 不显示在参考里
            } else if (d.type === 'add') {
                // add 行（B独有）：跳到"它前面最近的 same 行"在 A 中的位置；
                // 若它出现在文件最开头（前面没有 same），则跳到第 1 行
                entries.push({ d:d, jumpA: aLineCounter > 0 ? aLineCounter : 1 });
            }
        });

        html += '<div style="background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:6px;padding:6px 0;font-size:12px;line-height:1.7;font-family:Consolas,monospace;">';
        entries.forEach(function(item) {
            var d = item.d;
            if (d.type === 'del') return;
            refLineNum++;
            var isAdd = d.type === 'add';
            var bg = isAdd ? pcaC.diffAdd : 'transparent';
            var color = isAdd ? pcaC.diffAddText : pcaC.dim;
            var prefix = isAdd ? '+' : ' ';
            var lineHtml = '<div class="pca-ed-ref-line" data-pca-action="ed-jump-line" data-pca-jumpline="'+item.jumpA+'" data-pca-add="'+(isAdd?'1':'0')+'" data-pca-text="'+pcaAttr(d.text)+'" style="background:'+bg+';padding:1px 10px;color:'+color+';white-space:pre-wrap;word-break:break-all;display:flex;align-items:flex-start;gap:6px;cursor:pointer;">';
            lineHtml += '<span style="color:'+pcaC.off+';flex-shrink:0;min-width:32px;text-align:right;user-select:none;">'+refLineNum+'</span>';
            lineHtml += '<span style="display:inline-block;width:12px;opacity:0.6;user-select:none;flex-shrink:0;">'+prefix+'</span>';
            lineHtml += '<span style="flex:1;min-width:0;">'+pcaEsc(d.text||' ')+'</span>';
            if (isAdd) {
                lineHtml += '<span data-pca-action="ed-append-line" data-pca-text="'+pcaAttr(d.text)+'" title="追加到编辑末尾" style="cursor:pointer;flex-shrink:0;color:'+pcaC.migrate+';font-size:13px;padding:0 4px;">➕</span>';
                lineHtml += '<span data-pca-action="ed-copy-text" data-pca-text="'+pcaAttr(d.text)+'" title="复制此行" style="cursor:pointer;flex-shrink:0;color:'+pcaC.gold+';font-size:13px;padding:0 4px;">📋</span>';
            }
            lineHtml += '</div>';
            html += lineHtml;
        });
        html += '</div>';
        html += '<div style="margin-top:6px;font-size:10px;color:'+pcaC.dim+';">点击行＝跳转到编辑器对应位置；<span style="color:'+pcaC.migrate+';">➕</span>追加；<span style="color:'+pcaC.gold+';">📋</span>复制</div>';
    }
    refEl.innerHTML = html;
}

function pcaBindEditor() {
    var doc = pcaGetDoc();
    var ov = doc.querySelector('#pca-editor-overlay');
    if (!ov) return;

    // 字段面板视图时只绑字段联动
    if (pcaState.editorState && pcaState.editorState.fieldsView) {
        pcaEditorBindFieldsPanel();
        return;
    }

    var ta = doc.querySelector('#pca-ed-textarea');
    if (ta) {
        ta.addEventListener('input', function() {
            var es = pcaState.editorState;
            if (!es) return;
            pcaState.editorDrafts[es.entryId] = pcaState.editorDrafts[es.entryId] || {};
            pcaState.editorDrafts[es.entryId][es.activeVersion] = ta.value;
            pcaEditorUpdateStats();
            pcaEditorSyncLinenumScroll();
        });
        ta.addEventListener('scroll', function() {
            pcaEditorSyncLinenumScroll();
        });
        // 记录最近一次 selection，工具栏点击后焦点会被夺走，但 selection 仍然保留在 ta 上；
        // 这里多做一层保险，用于 "复制" 兜底
        var saveSel = function() {
            try {
                ta._pcaLastSelStart = ta.selectionStart;
                ta._pcaLastSelEnd = ta.selectionEnd;
            } catch(_e) {}
        };
        ta.addEventListener('keyup', saveSel);
        ta.addEventListener('mouseup', saveSel);
        ta.addEventListener('select', saveSel);
        ta.addEventListener('blur', saveSel);
        // textarea 尺寸变化（窗口 resize / 横竖屏切换）时重算行号映射
        try {
            if (typeof ResizeObserver !== 'undefined') {
                var ro = new ResizeObserver(function(){ pcaEditorUpdateStats(); });
                ro.observe(ta);
                ta._pcaResizeObserver = ro;
            }
        } catch(_e) {}
    }

    // 工具栏按钮 mousedown 时记录 textarea 当前 selection（此刻焦点仍在 textarea 上），
    // 但不要 preventDefault —— 否则部分浏览器会吞掉随后的 click 事件
    var toolBar = ov.querySelectorAll('[data-pca-action]');
    for (var ti = 0; ti < toolBar.length; ti++) {
        toolBar[ti].addEventListener('mousedown', function() {
            try {
                var taX = doc.querySelector('#pca-ed-textarea');
                if (taX) {
                    taX._pcaLastSelStart = taX.selectionStart;
                    taX._pcaLastSelEnd = taX.selectionEnd;
                }
            } catch(_e) {}
        });
    }

    ov.addEventListener('click', function(e) {
        e.stopPropagation();
        var target = e.target;
        while (target && target !== ov) {
            if (target.getAttribute && target.getAttribute('data-pca-action')) break;
            target = target.parentElement;
        }
        if (!target || target === ov) return;
        var action = target.getAttribute('data-pca-action');

        switch(action) {
            case 'ed-close':
            case 'ed-cancel':
                pcaCloseEditor(false);
                break;
            case 'ed-switch-ver':
                var newVer = target.getAttribute('data-pca-ver');
                var es1 = pcaState.editorState;
                if (!es1 || es1.activeVersion === newVer) break;
                var ta1 = doc.querySelector('#pca-ed-textarea');
                if (ta1) {
                    pcaState.editorDrafts[es1.entryId] = pcaState.editorDrafts[es1.entryId] || {};
                    pcaState.editorDrafts[es1.entryId][es1.activeVersion] = ta1.value;
                }
                es1.activeVersion = newVer;
                ov.querySelectorAll('.pca-ed-tab').forEach(function(t) {
                    t.classList.toggle('active', t.getAttribute('data-pca-ver') === newVer);
                });
                pcaEditorRefreshContent();
                break;
            case 'ed-toggle-ref':
                var es2 = pcaState.editorState;
                if (!es2) break;
                es2.referenceVisible = !es2.referenceVisible;
                var refC = doc.querySelector('#pca-ed-ref-container');
                if (refC) {
                    refC.style.display = es2.referenceVisible ? 'flex' : 'none';
                    refC.style.flex = es2.referenceVisible ? '1' : '0 0 0';
                    refC.style.minHeight = es2.referenceVisible ? '120px' : '0';
                }
                target.textContent = es2.referenceVisible ? '🙈 隐藏参考' : '👁 显示参考';
                if (es2.referenceVisible) pcaEditorRefreshReference();
                break;
            case 'ed-toggle-wrap':
                pcaState.editorWrap = !(pcaState.editorWrap !== false);
                try { localStorage.setItem(PCA_EDITOR_WRAP_KEY, pcaState.editorWrap ? '1' : '0'); } catch(e3) {}
                var ta_w = doc.querySelector('#pca-ed-textarea');
                if (ta_w) {
                    var wrapNow = pcaState.editorWrap !== false;
                    ta_w.setAttribute('wrap', wrapNow ? 'soft' : 'off');
                    ta_w.style.setProperty('white-space', wrapNow ? 'pre-wrap' : 'pre', 'important');
                    ta_w.style.setProperty('overflow-x', wrapNow ? 'hidden' : 'auto', 'important');
                    ta_w.style.setProperty('word-break', wrapNow ? 'break-word' : 'normal', 'important');
                }
                target.textContent = (pcaState.editorWrap !== false) ? '🔁 自动换行' : '📐 不换行';
                pcaEditorUpdateStats();
                break;
            case 'ed-toggle-fields':
                pcaEditorToggleFieldsView();
                break;
            case 'ed-fields-newid':
                var fldId = doc.querySelector('#pca-fld-id');
                if (fldId && !fldId.readOnly) fldId.value = pcaGenEntryId();
                break;
            case 'ed-fields-reset':
                pcaShowConfirm('重置为源预设原始字段值？当前未保存的字段修改会丢失。', function(ok){
                    if (!ok) return;
                    var es_r = pcaState.editorState; if (!es_r) return;
                    es_r.fieldOverrides = pcaEditorBuildFieldDefaults(es_r.rawFields, es_r.leftEntry, null);
                    pcaEditorRefreshFieldsPanelUI();
                }, { yesText:'重置', noText:'取消', yesColor:pcaC.danger, yesColorDim:'#a04050' });
                break;
            case 'ed-fields-cancel':
                pcaEditorToggleFieldsView();
                break;
            case 'ed-fields-save':
                pcaEditorSaveFields();
                break;
            case 'ed-tool':
                pcaEditorTool(target.getAttribute('data-pca-tool'));
                break;
            case 'ed-append-line':
                e.stopPropagation();
                var txt1 = target.getAttribute('data-pca-text') || '';
                var dec1 = doc.createElement('div'); dec1.innerHTML = txt1;
                pcaEditorAppendToTextarea(dec1.textContent);
                break;
            case 'ed-copy-text':
                e.stopPropagation();
                e.preventDefault();
                var txt2 = target.getAttribute('data-pca-text') || '';
                var lineText = '';
                if (txt2) {
                    var dec2 = doc.createElement('textarea'); dec2.innerHTML = txt2;
                    lineText = dec2.value;
                }
                // 兜底：从父级 .pca-ed-ref-line 直接取最后一段 textContent（去掉行号、+ 号、按钮符号）
                if (!lineText) {
                    var parentLine = target.parentElement;
                    while (parentLine && !parentLine.classList.contains('pca-ed-ref-line')) parentLine = parentLine.parentElement;
                    if (parentLine) {
                        var contentSpan = parentLine.querySelector('span[style*="flex:1"]');
                        if (contentSpan) lineText = contentSpan.textContent || '';
                    }
                }
                pcaLog('[ed-copy-text] len=' + (lineText ? lineText.length : 0));
                if (!lineText) { pcaShowToast('warning', '该行内容为空'); break; }
                // 暗存为编辑器粘贴源，让粘贴按钮可联动
                pcaState.editorClipText = lineText;
                pcaState.editorClipFrom = 'ref-line';
                pcaCopyToClipboard(lineText, '已复制此行（可点📥粘贴）');
                pcaEditorRefreshPasteHint();
                break;
            case 'ed-jump-line':
                var jumpLine = parseInt(target.getAttribute('data-pca-jumpline')||'1', 10);
                pcaEditorJumpToLine(jumpLine);
                break;
            case 'ed-confirm':
                pcaEditorConfirm();
                break;
        }
    });
}

// 刷新"粘贴按钮"高亮 + 来源提示文案（暗存内容变化时调）
function pcaEditorRefreshPasteHint() {
    try {
        var doc = pcaGetDoc();
        var btn = doc.querySelector('#pca-ed-paste-btn');
        var hint = doc.querySelector('#pca-ed-paste-hint');
        if (!btn || !hint) return;
        var stash = pcaState.editorClipText || '';
        if (stash) {
            btn.style.background = 'linear-gradient(135deg,'+pcaC.migrate+','+pcaC.migrateDim+')';
            btn.style.color = '#fff';
            btn.style.borderColor = pcaC.migrateBorder || pcaC.migrate;
            btn.style.fontWeight = '600';
            var src = pcaState.editorClipFrom === 'ref-line' ? '参考行' :
                      (pcaState.editorClipFrom === 'editor-sel' ? '编辑选区' :
                      (pcaState.editorClipFrom === 'editor-all' ? '编辑全文' : '暗存'));
            hint.style.display = '';
            hint.textContent = '✓ 已暗存「' + src + '」' + stash.length + '字';
            hint.style.color = pcaC.migrate;
        } else {
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
            btn.style.fontWeight = '';
            hint.style.display = 'none';
            hint.textContent = '';
        }
    } catch(_e) {}
}

// 切换到字段视图 / 切回正文视图（原地显隐，避免重建 textarea / 行号镜像 / 监听器）
function pcaEditorToggleFieldsView() {
    var es = pcaState.editorState;
    if (!es) return;
    es.fieldsView = !es.fieldsView;
    var doc = pcaGetDoc();
    var ov = doc.querySelector('#pca-editor-overlay');
    if (!ov) return;
    var bodyEl = ov.querySelector('#pca-ed-body');
    var tabsEl = ov.querySelector('#pca-ed-tabs-bar');
    var toolEl = ov.querySelector('#pca-ed-toolbar');
    var bottomEl = ov.querySelector('#pca-ed-bottom-bar');
    var fieldsEl = ov.querySelector('#pca-ed-fields-panel');
    var fieldsBottomEl = ov.querySelector('#pca-ed-fields-bottom');
    // 切到字段视图：首次进入懒构建
    if (es.fieldsView) {
        if (!fieldsEl) {
            // 从源 prompt 重新装填默认值（保证显示最新数据）
            es.fieldOverrides = pcaEditorBuildFieldDefaults(es.rawFields, es.leftEntry, es.fieldOverrides);
            // 字段面板 HTML 包含 panel + bottom bar 两块；插到 modal 末尾
            var modal = ov.querySelector('.pca-ed-modal');
            if (modal) {
                var tmp = doc.createElement('div');
                tmp.innerHTML = pcaBuildFieldsPanelHTML();
                while (tmp.firstChild) modal.appendChild(tmp.firstChild);
                pcaEditorBindFieldsPanel();
            }
            fieldsEl = ov.querySelector('#pca-ed-fields-panel');
            fieldsBottomEl = ov.querySelector('#pca-ed-fields-bottom');
        } else {
            // 二次进入：刷新 UI 表现的初值（对齐 fieldOverrides）
            pcaEditorRefreshFieldsPanelUI();
        }
        if (bodyEl) bodyEl.style.display = 'none';
        if (tabsEl) tabsEl.style.display = 'none';
        if (toolEl) toolEl.style.display = 'none';
        if (bottomEl) bottomEl.style.display = 'none';
        if (fieldsEl) fieldsEl.style.display = '';
        if (fieldsBottomEl) fieldsBottomEl.style.display = '';
    } else {
        if (bodyEl) bodyEl.style.display = '';
        if (tabsEl) tabsEl.style.display = '';
        if (toolEl) toolEl.style.display = '';
        if (bottomEl) bottomEl.style.display = '';
        if (fieldsEl) fieldsEl.style.display = 'none';
        if (fieldsBottomEl) fieldsBottomEl.style.display = 'none';
    }
    // 高亮按钮状态
    var btn = ov.querySelector('[data-pca-action="ed-toggle-fields"]');
    if (btn) {
        if (es.fieldsView) { btn.style.color = pcaC.gold; btn.style.borderColor = pcaC.goldDim; }
        else { btn.style.color = ''; btn.style.borderColor = ''; }
    }
}

// 刷新字段面板表单的当前值（不重建 DOM）
function pcaEditorRefreshFieldsPanelUI() {
    var es = pcaState.editorState; if (!es) return;
    var fo = es.fieldOverrides; if (!fo) return;
    var doc = pcaGetDoc(); var ov = doc.querySelector('#pca-editor-overlay'); if (!ov) return;
    function setVal(sel, v){ var el=ov.querySelector(sel); if(el && el.value!==undefined) el.value=v; }
    function setCk(sel, v){ var el=ov.querySelector(sel); if(el && 'checked' in el) el.checked=!!v; }
    setVal('#pca-fld-name', fo.name||'');
    setVal('#pca-fld-id', fo.identifier||'');
    setVal('#pca-fld-role', fo.role||'system');
    setVal('#pca-fld-pos', String(fo.injection_position||0));
    setVal('#pca-fld-depth', fo.injection_depth!=null?fo.injection_depth:4);
    setVal('#pca-fld-order', fo.injection_order!=null?fo.injection_order:100);
    var trigEnabled = Array.isArray(fo.injection_trigger);
    setCk('#pca-fld-trig-enable', trigEnabled);
    var list = ov.querySelector('#pca-fld-trig-list');
    if (list) list.style.display = trigEnabled ? 'flex' : 'none';
    ov.querySelectorAll('input[data-pca-trig]').forEach(function(cb){
        cb.checked = trigEnabled && fo.injection_trigger.indexOf(cb.getAttribute('data-pca-trig')) >= 0;
    });
    setCk('#pca-fld-syspr', fo.system_prompt);
    setCk('#pca-fld-marker', fo.marker);
    setCk('#pca-fld-forbid', fo.forbid_overrides);
}

// 字段面板的"启用触发器"checkbox 联动 + 标签 checkbox 高亮联动
function pcaEditorBindFieldsPanel() {
    var doc = pcaGetDoc();
    var ov = doc.querySelector('#pca-editor-overlay');
    if (!ov) return;
    var enable = ov.querySelector('#pca-fld-trig-enable');
    var list = ov.querySelector('#pca-fld-trig-list');
    if (enable && list) {
        enable.addEventListener('change', function() {
            list.style.display = enable.checked ? 'flex' : 'none';
        });
    }
}

// 读取 DOM 表单 → 写回 editorState.fieldOverrides → 切回正文视图
function pcaEditorSaveFields() {
    var es = pcaState.editorState;
    if (!es) return;
    var doc = pcaGetDoc();
    var ov = doc.querySelector('#pca-editor-overlay');
    if (!ov) return;
    var fo = es.fieldOverrides;
    var nameEl = ov.querySelector('#pca-fld-name');
    var idEl = ov.querySelector('#pca-fld-id');
    var roleEl = ov.querySelector('#pca-fld-role');
    var posEl = ov.querySelector('#pca-fld-pos');
    var depthEl = ov.querySelector('#pca-fld-depth');
    var orderEl = ov.querySelector('#pca-fld-order');
    var trigEnable = ov.querySelector('#pca-fld-trig-enable');
    var sysEl = ov.querySelector('#pca-fld-syspr');
    var markerEl = ov.querySelector('#pca-fld-marker');
    var forbidEl = ov.querySelector('#pca-fld-forbid');

    if (nameEl) {
        var nv = (nameEl.value || '').trim();
        if (!nv) { toastr.warning('名称不能为空'); return; }
        fo.name = nv;
    }
    if (idEl && !idEl.readOnly) {
        var iv = (idEl.value || '').trim();
        if (!iv) { toastr.warning('ID 不能为空'); return; }
        fo.identifier = iv;
    }
    if (roleEl) fo.role = roleEl.value;
    if (posEl) fo.injection_position = parseInt(posEl.value, 10);
    if (depthEl) {
        var dv = parseInt(depthEl.value, 10);
        if (isNaN(dv) || dv < 0) dv = 0;
        fo.injection_depth = dv;
    }
    if (orderEl) {
        var ov2 = parseInt(orderEl.value, 10);
        if (isNaN(ov2)) ov2 = 100;
        fo.injection_order = ov2;
    }
    if (trigEnable) {
        if (trigEnable.checked) {
            var arr = [];
            ov.querySelectorAll('input[data-pca-trig]').forEach(function(cb){
                if (cb.checked) arr.push(cb.getAttribute('data-pca-trig'));
            });
            fo.injection_trigger = arr;
        } else {
            fo.injection_trigger = null;
        }
    }
    if (sysEl) fo.system_prompt = !!sysEl.checked;
    if (markerEl) fo.marker = !!markerEl.checked;
    if (forbidEl) fo.forbid_overrides = !!forbidEl.checked;

    // 同步到 entry（本地编辑器视图）+ pending 项（如有）
    es.leftEntry._fieldOverrides = JSON.parse(JSON.stringify(fo));
    es.leftEntry.name = fo.name;
    es.leftEntry.role = fo.role;
    if (es.fromPendingIdx >= 0 && pcaState.migratePending[es.fromPendingIdx]) {
        var p = pcaState.migratePending[es.fromPendingIdx];
        p.fieldOverrides = JSON.parse(JSON.stringify(fo));
        if (p.entry) {
            p.entry._fieldOverrides = JSON.parse(JSON.stringify(fo));
            p.entry.name = fo.name;
            p.entry.role = fo.role;
            // ID 改了 → 同步 entry.id（但保留 _origId 以便从源取字段）
            if (idEl && !idEl.readOnly && p.entry.id !== fo.identifier) {
                if (!p.entry._origId) p.entry._origId = p.entry.id;
                p.entry.id = fo.identifier;
            }
        }
    }
    es.entryName = fo.name;
    toastr.success('字段已保存');
    // 同步标题文字（若 modal 头部显示了 entryName）
    var titleEl = ov.querySelector('.pca-ed-modal > div:first-child div:nth-child(2)');
    // 直接切回正文视图，使用原地显隐
    es.fieldsView = true; // 让 toggle 把它切到 false
    pcaEditorToggleFieldsView();
}

function pcaEditorTool(tool) {
    var doc = pcaGetDoc();
    var ta = doc.querySelector('#pca-ed-textarea');
    if (!ta) return;
    switch(tool) {
        case 'selectall':
            ta.focus();
            ta.select();
            break;
        case 'copy':
            try {
                // 优先使用 mousedown 时记录的 selection（按钮 click 后焦点已转移）
                var s0 = (typeof ta._pcaLastSelStart === 'number') ? ta._pcaLastSelStart : ta.selectionStart;
                var e0 = (typeof ta._pcaLastSelEnd === 'number') ? ta._pcaLastSelEnd : ta.selectionEnd;
                var hasSel = (s0 !== e0);
                var textToCopy = hasSel ? ta.value.substring(s0, e0) : ta.value;
                if (!textToCopy) { try { pcaShowToast('info', '无内容可复制'); } catch(_e2){} break; }
                pcaState.editorClipText = textToCopy;
                pcaState.editorClipFrom = hasSel ? 'editor-sel' : 'editor-all';
                pcaCopyToClipboard(textToCopy, hasSel ? ('已复制选中文本（' + textToCopy.length + ' 字）') : ('已复制全部（' + textToCopy.length + ' 字）'));
                pcaEditorRefreshPasteHint();
                // 复制后把焦点和选区还原到 textarea，让用户继续看到"自己的选区"
                setTimeout(function() {
                    try {
                        ta.focus({ preventScroll: true });
                        ta.setSelectionRange(s0, e0);
                        ta._pcaLastSelStart = s0;
                        ta._pcaLastSelEnd = e0;
                    } catch(_e4) {}
                }, 0);
            } catch(e) {
                try { pcaShowToast('warning', '复制失败，请用 Ctrl+C'); } catch(_e3) {}
            }
            break;
        case 'paste':
            // 把光标先还原到记录的位置（手机用户尤其需要）
            try {
                var ps = (typeof ta._pcaLastSelStart === 'number') ? ta._pcaLastSelStart : ta.selectionStart;
                var pe = (typeof ta._pcaLastSelEnd === 'number') ? ta._pcaLastSelEnd : ta.selectionEnd;
                ta.focus({ preventScroll: true });
                ta.setSelectionRange(ps, pe);
            } catch(_ep) { ta.focus(); }
            var winP = pcaGetWin();
            var canReadClip = false;
            try { canReadClip = !!(winP && winP.isSecureContext && winP.navigator && winP.navigator.clipboard && winP.navigator.clipboard.readText); } catch(_e) {}
            var stash = pcaState.editorClipText || '';
            var pasteFromStash = function(reason) {
                if (stash) {
                    pcaEditorInsertAtCursor(stash);
                    pcaShowToast('success', '已粘贴脚本暗存内容（' + stash.length + ' 字）');
                } else {
                    pcaShowToast('info', reason || '剪贴板读取受限，请用 Ctrl+V 粘贴');
                }
            };
            if (canReadClip) {
                winP.navigator.clipboard.readText().then(function(text) {
                    if (text && text.length) {
                        pcaEditorInsertAtCursor(text);
                        pcaShowToast('success', '已粘贴系统剪贴板（' + text.length + ' 字）');
                    } else {
                        pasteFromStash('剪贴板为空');
                    }
                }).catch(function() {
                    pasteFromStash('剪贴板被拒，已用脚本暗存');
                });
            } else {
                pasteFromStash('HTTP 环境无法读剪贴板，已用脚本暗存');
            }
            break;
        case 'undo':
            ta.focus();
            try { doc.execCommand('undo'); } catch(e) {}
            break;
        case 'redo':
            ta.focus();
            try { doc.execCommand('redo'); } catch(e) {}
            break;
        case 'reset':
            var es = pcaState.editorState;
            if (!es) return;
            pcaShowConfirm('还原当前版本到原始内容？<br><br>当前在编辑器内的修改将丢失。', function(ok) {
                if (!ok) return;
                pcaState.editorDrafts[es.entryId] = pcaState.editorDrafts[es.entryId] || {};
                if (es.activeVersion === 'left') pcaState.editorDrafts[es.entryId].left = es.originalLeft;
                else pcaState.editorDrafts[es.entryId].right = es.originalRight;
                pcaEditorRefreshContent();
                toastr.info('已还原');
            }, { yesText:'还原', noText:'取消', yesColor:pcaC.danger, yesColorDim:'#a04050' });
            break;
    }
}

// 置信度说明气泡（点 × 或点空白处关闭）
function pcaShowConfHelpPopover(anchorEl) {
    var doc = pcaGetDoc();
    var existing = doc.querySelector('#pca-conf-help-popover');
    if (existing) { existing.remove(); return; }

    var rect = anchorEl.getBoundingClientRect();
    var pop = doc.createElement('div');
    pop.id = 'pca-conf-help-popover';
    pop.style.cssText = 'position:fixed;z-index:2147483647;background:'+pcaC.bg+';border:1px solid '+pcaC.goldDim+';border-radius:10px;padding:14px 18px;box-shadow:0 8px 32px rgba(0,0,0,0.6);width:min(340px,92vw);font-size:12px;color:'+pcaC.text+';line-height:1.7;pointer-events:auto;';

    var html = '';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">';
    html += '<span style="font-size:13px;font-weight:700;color:'+pcaC.gold+';">📍 智能定位置信度说明</span>';
    html += '<span data-pca-action="conf-help-close" style="cursor:pointer;color:'+pcaC.dim+';font-size:16px;padding:0 4px;">×</span>';
    html += '</div>';
    html += '<div style="color:'+pcaC.dim+';margin-bottom:6px;">迁移条目时，脚本会根据"旧版前后邻居"在新版中的位置自动算出插入点：</div>';
    html += '<div style="margin-bottom:4px;"><span style="color:'+pcaC.success+';font-weight:600;">🟢 高</span> &nbsp;前后邻居都在新版且顺序一致，定位非常可信。</div>';
    html += '<div style="margin-bottom:4px;"><span style="color:'+pcaC.gold+';font-weight:600;">🟡 中</span> &nbsp;只有单边邻居，或前后邻居在新版中顺序与旧版冲突。建议复核。</div>';
    html += '<div style="margin-bottom:8px;"><span style="color:'+pcaC.danger+';font-weight:600;">🔴 低</span> &nbsp;旧新版无任何共有邻居，已回落到顶部 / 末尾，<b>强烈建议手工 📍 调位置</b>。</div>';
    html += '<div style="border-top:1px solid '+pcaC.border+';padding-top:8px;color:'+pcaC.dim+';font-size:11px;">点击队列项左侧的 📍 可手动选位置；点击行尾的 ✏️ 可编辑该条目内容；× 可移出队列。</div>';
    pop.innerHTML = html;

    // 关键修复：SillyTavern 的 popup 是 <dialog> 元素，使用浏览器 top-layer 渲染，
    // 任何普通 body 子元素都会被它遮挡。必须把气泡也挂到 dialog 内部才能在它上面显示。
    var hostDialog = doc.querySelector('dialog.popup[open]:has(#pca-root)')
        || doc.querySelector('dialog.popup:has(#pca-root)')
        || doc.querySelector('#pca-root');
    var host = hostDialog || doc.body;
    host.appendChild(pop);

    // 测量后定位（让气泡在按钮上方显示，超出视口则改下方）
    var ph = pop.offsetHeight, pw = pop.offsetWidth;
    var top = rect.top - ph - 10;
    if (top < 8) top = rect.bottom + 10;
    var left = rect.left + rect.width / 2 - pw / 2;
    if (left < 8) left = 8;
    var maxLeft = (doc.documentElement.clientWidth || window.innerWidth) - pw - 8;
    if (left > maxLeft) left = maxLeft;
    pop.style.top = top + 'px';
    pop.style.left = left + 'px';

    // 点击空白处关闭
    var closeHandler = function(e) {
        if (!pop.contains(e.target)) {
            pop.remove();
            doc.removeEventListener('click', closeHandler, true);
        }
    };
    setTimeout(function() { doc.addEventListener('click', closeHandler, true); }, 0);

    // × 按钮
    pop.addEventListener('click', function(e) {
        var t = e.target;
        if (t && t.getAttribute && t.getAttribute('data-pca-action') === 'conf-help-close') {
            e.stopPropagation();
            pop.remove();
            doc.removeEventListener('click', closeHandler, true);
        }
    });
}

function pcaShowToast(type, msg) {
    // 优先用顶层 window 的 toastr（因为脚本可能跑在 iframe 里，本地 window 可能没 toastr）
    try {
        var win = pcaGetWin();
        var t = (win && win.toastr) ? win.toastr : ((typeof toastr !== 'undefined') ? toastr : null);
        if (t && typeof t[type] === 'function') {
            t[type](msg, '', { timeOut: 1500 });
            return;
        }
    } catch(_e) {}
    // 兜底：自己造一个浮动提示（贴到顶层 document）
    try {
        var doc = pcaGetDoc();
        var box = doc.createElement('div');
        var color = type === 'success' ? '#6ecf8a' : (type === 'warning' ? '#e0a070' : (type === 'error' ? '#e06070' : '#8eb8e5'));
        box.textContent = msg;
        box.style.cssText = 'position:fixed!important;left:50%!important;top:14%!important;transform:translateX(-50%)!important;background:rgba(20,18,28,0.95)!important;color:#fff!important;border:1px solid '+color+'!important;border-radius:8px!important;padding:8px 18px!important;font-size:13px!important;z-index:2147483647!important;box-shadow:0 4px 16px rgba(0,0,0,0.4)!important;pointer-events:none!important;';
        doc.body.appendChild(box);
        setTimeout(function(){ try { box.remove(); } catch(_e){} }, 1500);
    } catch(_e2) {}
}

function pcaCopyToClipboard(text, successMsg) {
    var doc = pcaGetDoc();
    var win = pcaGetWin();
    var ov = doc.querySelector('#pca-editor-overlay');
    var container = ov || doc.body;
    var safeText = (text == null) ? '' : String(text);

    // 方法1：navigator.clipboard（HTTPS或localhost才行）
    var canUseModern = false;
    try {
        canUseModern = !!(win && win.isSecureContext && win.navigator && win.navigator.clipboard && win.navigator.clipboard.writeText);
    } catch(_e) { canUseModern = false; }
    if (canUseModern) {
        try {
            win.navigator.clipboard.writeText(safeText).then(function() {
                pcaShowToast('success', successMsg || '已复制');
            }).catch(function(err) {
                pcaLog('[clip] navigator.clipboard 失败: ' + (err && err.message) + '，回退');
                pcaCopyFallback(safeText, successMsg, container, doc);
            });
            return;
        } catch(_e) { pcaLog('[clip] navigator.clipboard 异常: ' + _e.message); }
    }
    pcaCopyFallback(safeText, successMsg, container, doc);
}

function pcaCopyFallback(text, successMsg, container, doc) {
    var safeText = (text == null) ? '' : String(text);

    // 方法 A：copy 事件 + clipboardData.setData —— 不依赖元素 focus，dialog 内成功率最高
    var okA = false;
    var handlerCalled = false;
    try {
        var handler = function(ev) {
            handlerCalled = true;
            try {
                if (ev.clipboardData) {
                    ev.clipboardData.setData('text/plain', safeText);
                    ev.preventDefault();
                    okA = true;
                }
            } catch(_e) {}
        };
        doc.addEventListener('copy', handler, true);
        try { doc.execCommand('copy'); } catch(_eX) {}
        doc.removeEventListener('copy', handler, true);
        if (!(handlerCalled && okA)) okA = false;
    } catch(_e) { okA = false; }

    if (okA) {
        pcaShowToast('success', successMsg || '已复制');
        return;
    }

    // 方法 B：临时 textarea + execCommand('copy')（兜底）
    var origTa = doc.querySelector('#pca-ed-textarea');
    var origSelStart = -1, origSelEnd = -1;
    if (origTa) {
        try { origSelStart = origTa.selectionStart; origSelEnd = origTa.selectionEnd; } catch(_e) {}
    }

    var tryCopy = function(parent) {
        var tmp = doc.createElement('textarea');
        tmp.value = safeText;
        tmp.setAttribute('readonly', '');
        tmp.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;padding:0;border:0;margin:0;opacity:0.01;z-index:2147483647;';
        parent.appendChild(tmp);
        var ok2 = false;
        try {
            tmp.focus({ preventScroll: true });
            tmp.select();
            tmp.setSelectionRange(0, tmp.value.length);
            ok2 = doc.execCommand && doc.execCommand('copy');
        } catch(_e) { ok2 = false; }
        try { tmp.remove(); } catch(_e2) {}
        return !!ok2;
    };

    var ok = tryCopy(container || doc.body);
    if (!ok && container && container !== doc.body) {
        ok = tryCopy(doc.body);
    }

    // 恢复原编辑 textarea 的焦点与选区
    if (origTa && origSelStart >= 0) {
        try {
            origTa.focus({ preventScroll: true });
            origTa.setSelectionRange(origSelStart, origSelEnd);
        } catch(_e3) {}
    }

    if (ok) {
        pcaShowToast('success', successMsg || '已复制');
    } else {
        pcaShowToast('warning', '自动复制失败，请用 Ctrl+C 手动复制');
    }
}

function pcaEditorInsertAtCursor(text) {
    var doc = pcaGetDoc();
    var ta = doc.querySelector('#pca-ed-textarea');
    if (!ta) return;
    var s = ta.selectionStart, e = ta.selectionEnd;
    ta.value = ta.value.substring(0, s) + text + ta.value.substring(e);
    ta.selectionStart = ta.selectionEnd = s + text.length;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
}

function pcaEditorAppendToTextarea(text) {
    var doc = pcaGetDoc();
    var ta = doc.querySelector('#pca-ed-textarea');
    if (!ta) return;
    var sep = (ta.value && !ta.value.endsWith('\n')) ? '\n' : '';
    ta.value = ta.value + sep + text;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.focus();
    ta.selectionStart = ta.selectionEnd = ta.value.length;
    toastr.success('已追加 1 行', '', { timeOut: 1500 });
}

function pcaEditorJumpToLine(lineNum) {
    var doc = pcaGetDoc();
    var ta = doc.querySelector('#pca-ed-textarea');
    if (!ta) return;
    var lines = ta.value.split('\n');
    if (lineNum < 1) lineNum = 1;
    if (lineNum > lines.length) lineNum = lines.length;

    // 计算光标位置（行首）
    var pos = 0;
    for (var i = 0; i < lineNum - 1; i++) {
        pos += lines[i].length + 1; // +1 是 \n
    }
    var lineEnd = pos + (lines[lineNum-1] || '').length;

    ta.focus();
    ta.setSelectionRange(pos, lineEnd);

    // 滚动到目标行：估算 line-height * 行号
    var lineHeight = 14 * 1.6; // font-size 14, line-height 1.6
    var targetScroll = (lineNum - 1) * lineHeight - ta.clientHeight / 3;
    ta.scrollTop = Math.max(0, targetScroll);

    // 同步行号滚动
    var ln = doc.querySelector('#pca-ed-linenums');
    if (ln) ln.scrollTop = ta.scrollTop;

    toastr.info('已跳转到第 ' + lineNum + ' 行', '', {timeOut:1000});
}

function pcaEditorConfirm() {
    var doc = pcaGetDoc();
    var es = pcaState.editorState;
    if (!es) return;
    var ta = doc.querySelector('#pca-ed-textarea');
    if (!ta) return;

    // 同步最新草稿
    pcaState.editorDrafts[es.entryId] = pcaState.editorDrafts[es.entryId] || {};
    pcaState.editorDrafts[es.entryId][es.activeVersion] = ta.value;

    var finalContent = ta.value;
    var sourceEntry = JSON.parse(JSON.stringify(es.leftEntry));
    sourceEntry.content = finalContent;

    // 判断 edited 标志（相对于 left 原内容是否变化）
    var edited = (finalContent !== es.originalLeft);

    // 条目编辑模式：保存到 editPending（覆盖／新建），不走 migrate 流程
    if (es.isEditTarget) {
        var fo_e = es.fieldOverrides || null;
        if (es.leftEntry._isNew) {
            // 这是「新建空白条目」流程
            pcaEditAddPending({
                action:'new',
                targetId: sourceEntry.id,
                entryId: sourceEntry.id,
                entryName: (fo_e && fo_e.name) || sourceEntry.name,
                entry: sourceEntry,
                fieldOverrides: fo_e,
                insertIndex: pcaGetEditTargetEntries().length,
            });
        } else {
            pcaEditAddPending({
                action:'overwrite',
                targetId: sourceEntry.id,
                entryId: sourceEntry.id,
                entryName: (fo_e && fo_e.name) || sourceEntry.name,
                entry: sourceEntry,
                fieldOverrides: fo_e,
            });
        }
        pcaCloseEditor(true);
        pcaRenderEdit();
        toastr.success('已加入待修改队列：' + ((fo_e && fo_e.name) || sourceEntry.name));
        return;
    }

    var pendingItem = es.fromPendingIdx >= 0 ? pcaState.migratePending[es.fromPendingIdx] : null;

    if (pendingItem) {
        // 更新已有队列项
        pcaState.migrateUndoStack.push({
            action: 'edit',
            index: es.fromPendingIdx,
            prevItem: JSON.parse(JSON.stringify(pendingItem))
        });
        pendingItem.entry.content = finalContent;
        pendingItem._edited = edited;
        pendingItem._editedFrom = es.activeVersion;
        pcaCloseEditor(true);
        pcaRenderMigrate();
        toastr.success('已更新队列项：' + es.entryName);
        return;
    }

    // 新加入队列
    if (es.hasRight) {
        // 目标已有：覆盖
        pcaState.migrateUndoStack.push({ action:'add', index:pcaState.migratePending.length });
        pcaState.migratePending.push({
            action: 'overwrite',
            entry: sourceEntry,
            targetId: es.rightEntry.id,
            _edited: edited,
            _editedFrom: es.activeVersion,
        });
        pcaCloseEditor(true);
        pcaRenderMigrate();
        toastr.success('已加入队列（覆盖·已编辑）：' + es.entryName);
    } else {
        // 目标未有：要选位置
        pcaShowInsertPositionPicker(sourceEntry, function(pos, afterName) {
            if (pos < 0) return;
            pcaState.migrateUndoStack.push({ action:'add', index:pcaState.migratePending.length });
            pcaState.migratePending.push({
                action: 'new',
                entry: sourceEntry,
                insertIndex: pos,
                insertAfterName: afterName,
                _edited: edited,
                _editedFrom: es.activeVersion,
            });
            pcaCloseEditor(true);
            pcaRenderMigrate();
            toastr.success('已加入队列（新建·已编辑）：' + es.entryName);
        });
    }
}

// ============ 编辑器 END ============

function pcaAddNote() {
    var doc = pcaGetDoc();
    var input = doc.querySelector('#pca-note-input');
    if (!input) return;
    var val = input.value.trim();
    if (!val) return;
    var gid = pcaState.activeFavGroupId || '';
    var groupName = '未分组';
    var existingArr;
    if (gid) {
        pcaLoadFavGroups();
        var g = pcaState.migrateFavGroups[gid];
        if (!g) { toastr.error('分组已不存在'); pcaState.activeFavGroupId = ''; pcaRenderMigrate(); return; }
        groupName = g.name;
        existingArr = g.notes || [];
    } else {
        existingArr = pcaState.migrateNotes || [];
    }
    var exists = false;
    existingArr.forEach(function(n) { if (n === val) exists = true; });
    if (exists) { toastr.warning('「'+groupName+'」中已存在'); return; }
    pcaAddToFavGroup([val], gid);
    input.value = '';
    pcaRenderMigrate();
    toastr.success('已收藏到「'+groupName+'」：' + val);
}

function pcaRefreshDebug() { var el=pcaQ('#pca-debug-log'); if(el){el.textContent=pcaLogs.join('\n');el.scrollTop=el.scrollHeight;} }

async function pcaDoCompare() {
    var doc=pcaGetDoc();
    var leftSel=doc.querySelector('#pca-sel-left'),rightSel=doc.querySelector('#pca-sel-right');
    if(!leftSel||!rightSel)return;
    var ln=leftSel.value,rn=rightSel.value;
    if(!ln||!rn){toastr.warning('请先选择左右两个预设');return;}
    if(ln===rn){toastr.warning('不能选同一个预设');return;}
    pcaLog('对比: "'+ln+'" vs "'+rn+'"');
    var content=doc.querySelector('#pca-content');
    if(content)content.innerHTML='<div style="text-align:center;padding:30px;color:'+pcaC.dim+';">⏳ 获取中…</div>';
    var all=await pcaFetchAllPresets(); pcaRefreshDebug();
    if(!all){if(content)content.innerHTML='<div style="text-align:center;padding:30px;color:'+pcaC.danger+';">❌ 获取失败</div>';return;}
    pcaState.allPresets=all;
    var leftData=pcaFindPreset(all,ln),rightData=pcaFindPreset(all,rn); pcaRefreshDebug();
    if(!leftData){if(content)content.innerHTML='<div style="text-align:center;padding:30px;color:'+pcaC.danger+';">❌ 找不到左侧「'+pcaEsc(ln)+'」</div>';return;}
    if(!rightData){if(content)content.innerHTML='<div style="text-align:center;padding:30px;color:'+pcaC.danger+';">❌ 找不到右侧「'+pcaEsc(rn)+'」</div>';return;}

    var le=pcaExtract(leftData),re=pcaExtract(rightData);
    var result=pcaCompare(le,re);

    pcaState.leftName=ln;pcaState.rightName=rn;
    pcaState.leftEntries=le;pcaState.rightEntries=re;
    pcaState.diffs=result.diffs;pcaState.newItems=result.newItems;
    pcaState.rightPresetData=rightData;
    pcaState.leftPresetData=leftData;
    pcaState.originalValues={};pcaState.compared=true;
    pcaState.migratePending=[];pcaState.migrateUndoStack=[];
    pcaState.migrateSearch='';pcaState.migrateSelected={};
    pcaState.migrateFavActive=false;
    pcaState.activeFavGroupId='';
    pcaState.migrateFilterStatus='all';
    pcaState.migrateFilterDiff='all';
    pcaState.migrateQueueExpanded=false;
    pcaState.editorDrafts={};
    pcaState.editorState=null;

    var tabs=doc.querySelector('#pca-tabs'),footer=doc.querySelector('#pca-footer');
    if(tabs)tabs.style.display='flex';if(footer)footer.style.display='flex';
    doc.querySelector('#pca-tab-diff').textContent='开关差异 ('+result.diffs.length+')';
    pcaSwitchTab('diff');pcaRefreshDebug();
    toastr.success('对比完成：'+result.diffs.length+' 差异，'+result.newItems.length+' 新增');
}

function pcaSwitchTab(tab) {
    pcaState.activeTab=tab;var doc=pcaGetDoc();
    var td=doc.querySelector('#pca-tab-diff'),tm=doc.querySelector('#pca-tab-migrate'),te=doc.querySelector('#pca-tab-edit');
    if(td){td.style.borderBottomColor=tab==='diff'?pcaC.pink:'transparent';td.style.color=tab==='diff'?pcaC.pink:pcaC.dim;}
    if(tm){tm.style.borderBottomColor=tab==='migrate'?pcaC.migrate:'transparent';tm.style.color=tab==='migrate'?pcaC.migrate:pcaC.dim;}
    if(te){te.style.borderBottomColor=tab==='edit'?pcaC.gold:'transparent';te.style.color=tab==='edit'?pcaC.gold:pcaC.dim;}
    var footer = doc.querySelector('#pca-footer');
    if (footer) footer.style.display = (tab === 'migrate' || tab === 'edit') ? 'none' : 'flex';
    var existingDock = doc.querySelector('#pca-queue-dock');
    if (existingDock && tab !== 'migrate') existingDock.remove();
    var existingEditDock = doc.querySelector('#pca-edit-dock');
    if (existingEditDock && tab !== 'edit') existingEditDock.remove();
    if(tab==='diff')pcaRenderDiffs();else if(tab==='migrate')pcaRenderMigrate();else if(tab==='edit')pcaRenderEdit();
}

async function pcaDoSave() {
    if(!pcaState.compared){toastr.warning('请先对比');return;}
    var name = pcaState.rightName;
    var ok = await pcaSyncAndSave(pcaState.rightPresetData, name);
    if (!ok) { toastr.error('保存失败'); pcaRefreshDebug(); return; }
    toastr.success('已覆盖保存「'+name+'」✓');
    pcaRefreshDebug();
}

async function pcaDoSaveAs() {
    if(!pcaState.compared){toastr.warning('请先对比');return;}
    var n=prompt('请输入新预设名称：',pcaState.rightName+'_修改版');
    if(!n||!n.trim())return;
    var ok=await pcaSavePresetToFile(pcaState.rightPresetData,n.trim());
    if(ok){toastr.success('已另存为「'+n.trim()+'」');toastr.info('如列表未刷新请手动刷新页面');}
    else toastr.error('保存失败');
    pcaRefreshDebug();
}

function pcaDoSyncAll() {
    if(!pcaState.compared)return;var c=0;
    pcaState.diffs.forEach(function(d){
        var cur=pcaGetEnabled(pcaState.rightPresetData,d.right.id);
        if(cur!==d.left.enabled){
            if(pcaState.originalValues[d.right.id]===undefined)pcaState.originalValues[d.right.id]=d.right.enabled;
            pcaSetEnabled(pcaState.rightPresetData,d.right.id,d.left.enabled);c++;
        }
    });
    pcaRenderDiffs();toastr.success('已同步 '+c+' 个');
}

function pcaDoMigrateAdd(entryIdx, opts) {
    opts = opts || {};
    if (entryIdx < 0 || entryIdx >= pcaState.leftEntries.length) { toastr.error('索引无效'); return; }
    var entry = pcaState.leftEntries[entryIdx];
    var alreadyPending = false;
    pcaState.migratePending.forEach(function(p) { if (p.entry.id === entry.id) alreadyPending = true; });
    if (alreadyPending) { if (!opts.silent) toastr.warning('已在队列中'); return; }

    var rightEntries = pcaExtract(pcaState.rightPresetData);
    var sameNameEntry = null;
    rightEntries.forEach(function(re) { if (re.name === entry.name) sameNameEntry = re; });

    if (sameNameEntry) {
        // forceManualPos === true 时跳过覆盖判断，强制让用户挑位置（高级入口）
        if (opts.forceManualPos) {
            pcaShowInsertPositionPicker(entry, function(pos, afterName) {
                if (pos < 0) return;
                pcaState.migrateUndoStack.push({ action:'add', index:pcaState.migratePending.length });
                pcaState.migratePending.push({ action:'new', entry:JSON.parse(JSON.stringify(entry)), insertIndex:pos, insertAfterName:afterName, confidence:'high', posWarn:'' });
                pcaRenderMigrate();
                toastr.success('已添加新建：' + entry.name);
            });
            return;
        }
        pcaShowConfirm(
            '⚠️ 目标预设中已存在同名条目：<br><br><span style="color:'+pcaC.gold+';font-weight:600;">「'+pcaEsc(entry.name)+'」</span><br><br>是否加入覆盖到队列？（需点击「应用并保存」才真正生效）',
            function(confirmed) {
                if (confirmed) {
                    pcaState.migrateUndoStack.push({ action:'add', index:pcaState.migratePending.length });
                    pcaState.migratePending.push({ action:'overwrite', entry:JSON.parse(JSON.stringify(entry)), targetId:sameNameEntry.id });
                    pcaRenderMigrate();
                    toastr.success('已添加覆盖：' + entry.name);
                }
            },
            { yesText:'加入覆盖队列', noText:'取消' }
        );
        return;
    }

    // 没有同名条目：默认走"智能定位"，不再弹位置选择器
    if (opts.forceManualPos) {
        pcaShowInsertPositionPicker(entry, function(pos, afterName) {
            if (pos < 0) return;
            pcaState.migrateUndoStack.push({ action:'add', index:pcaState.migratePending.length });
            pcaState.migratePending.push({ action:'new', entry:JSON.parse(JSON.stringify(entry)), insertIndex:pos, insertAfterName:afterName, confidence:'high', posWarn:'' });
            pcaRenderMigrate();
            toastr.success('已添加新建：' + entry.name);
        });
        return;
    }
    var resolved = pcaResolveSamePosition(entry, pcaState.leftEntries, rightEntries);
    pcaState.migrateUndoStack.push({ action:'add', index:pcaState.migratePending.length });
    pcaState.migratePending.push({
        action:'new',
        entry: JSON.parse(JSON.stringify(entry)),
        insertIndex: resolved.insertIndex,
        insertAfterName: resolved.insertAfterName || '',
        insertBeforeName: resolved.insertBeforeName || '',
        confidence: resolved.confidence,
        posWarn: resolved.warn || ''
    });
    pcaRenderMigrate();
    if (!opts.silent) {
        var msg = '已添加：' + entry.name;
        if (resolved.confidence === 'low') msg += '（位置不确定）';
        toastr.success(msg);
    }
}

// 复制为新条目：保留目标已有那条，再生成新 ID 作为独立新条目入队列
function pcaDoMigrateAddAsNew(entryIdx) {
    if (entryIdx < 0 || entryIdx >= pcaState.leftEntries.length) { toastr.error('索引无效'); return; }
    var entry = pcaState.leftEntries[entryIdx];
    // 深拷贝并替换 ID（保留所有其他字段，记录原 ID 方便后续从源预设取完整字段）
    var clone = JSON.parse(JSON.stringify(entry));
    clone._origId = entry.id;
    clone.id = pcaGenEntryId();
    // 入队列前确认 id 不冲突（已在 pending 或 right）
    var rightEntries = pcaExtract(pcaState.rightPresetData);
    var conflict = false;
    rightEntries.forEach(function(re){ if (re.id === clone.id) conflict = true; });
    pcaState.migratePending.forEach(function(p){ if (p.entry.id === clone.id) conflict = true; });
    var safeGuard = 0;
    while (conflict && safeGuard < 5) {
        clone.id = pcaGenEntryId();
        conflict = false;
        rightEntries.forEach(function(re){ if (re.id === clone.id) conflict = true; });
        pcaState.migratePending.forEach(function(p){ if (p.entry.id === clone.id) conflict = true; });
        safeGuard++;
    }
    if (conflict) { toastr.error('生成 ID 冲突，请重试'); return; }
    // 智能定位（按原条目在左侧的相对位置推导）
    var resolved = pcaResolveSamePosition(entry, pcaState.leftEntries, rightEntries);
    pcaState.migrateUndoStack.push({ action:'add', index:pcaState.migratePending.length });
    pcaState.migratePending.push({
        action:'new',
        entry: clone,
        insertIndex: resolved.insertIndex,
        insertAfterName: resolved.insertAfterName || '',
        insertBeforeName: resolved.insertBeforeName || '',
        confidence: resolved.confidence,
        posWarn: resolved.warn || ''
    });
    pcaRenderMigrate();
    toastr.success('已添加为新条目（新 ID）：' + clone.name);
}

// ========== 批量智能迁移 ==========
// 弹出"同名冲突一次性确认"对话框
function pcaShowBatchConflictDialog(conflicts, callback) {
    var doc = pcaGetDoc();
    var existingDialog = doc.querySelector('dialog.popup:has(#pca-root)');
    var html = '<div class="pca-modal-overlay" id="pca-batch-conflict-overlay">';
    html += '<div style="background:'+pcaC.bg+';border:1px solid '+pcaC.border+';border-radius:14px;width:560px;max-width:96vw;max-height:80vh;max-height:80dvh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.6);">';
    html += '<div style="padding:14px 20px;border-bottom:1px solid '+pcaC.border+';flex-shrink:0;">';
    html += '<div style="font-size:15px;font-weight:700;color:'+pcaC.gold+';margin-bottom:4px;">⚠ 检测到 '+conflicts.length+' 个同名条目</div>';
    html += '<div style="font-size:12px;color:'+pcaC.dim+';">勾选要"覆盖"目标的条目，未勾选的将被"跳过"</div>';
    html += '</div>';
    html += '<div style="flex:1;overflow-y:auto;padding:10px 16px;">';
    html += '<div style="display:flex;gap:8px;margin-bottom:10px;">';
    html += '<span data-pca-action="bcf-all-yes" style="font-size:11px;color:'+pcaC.gold+';border:1px solid '+pcaC.goldDim+';border-radius:6px;padding:3px 10px;">全部覆盖</span>';
    html += '<span data-pca-action="bcf-all-no" style="font-size:11px;color:'+pcaC.dim+';border:1px solid '+pcaC.border+';border-radius:6px;padding:3px 10px;">全部跳过</span>';
    html += '</div>';
    conflicts.forEach(function(c, ci) {
        html += '<div data-pca-action="bcf-toggle" data-pca-idx="'+ci+'" id="pca-bcf-row-'+ci+'" style="display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid '+pcaC.border+';border-radius:6px;margin-bottom:5px;background:'+pcaC.card+';">';
        html += '<span id="pca-bcf-mark-'+ci+'" style="font-size:16px;color:'+pcaC.gold+';flex-shrink:0;">☑</span>';
        html += '<span style="font-size:12px;color:'+pcaC.text+';flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+pcaEsc(c.entry.name)+'</span>';
        html += '<span style="font-size:10px;color:'+pcaC.dim+';flex-shrink:0;">目标已存在</span>';
        html += '</div>';
    });
    html += '</div>';
    html += '<div style="padding:12px 20px;border-top:1px solid '+pcaC.border+';display:flex;justify-content:flex-end;gap:10px;flex-shrink:0;">';
    html += '<button data-pca-action="bcf-cancel" class="pca-modal-btn">取消整批</button>';
    html += '<button data-pca-action="bcf-confirm" class="pca-modal-btn-primary">确认批量迁移</button>';
    html += '</div></div></div>';

    var overlay = doc.createElement('div');
    overlay.innerHTML = html;
    var overlayEl = overlay.firstChild;
    if (existingDialog) existingDialog.appendChild(overlayEl); else doc.body.appendChild(overlayEl);

    var states = conflicts.map(function() { return true; }); // 默认全部覆盖
    function refreshRow(ci) {
        var mark = doc.querySelector('#pca-bcf-mark-' + ci);
        var row = doc.querySelector('#pca-bcf-row-' + ci);
        if (!mark || !row) return;
        if (states[ci]) {
            mark.textContent = '☑'; mark.style.color = pcaC.gold;
            row.style.background = 'rgba(212,168,83,0.06)';
        } else {
            mark.textContent = '☐'; mark.style.color = pcaC.dim;
            row.style.background = pcaC.card;
        }
    }

    overlayEl.addEventListener('click', function(e) {
        e.stopPropagation();
        var thisOverlay = doc.querySelector('#pca-batch-conflict-overlay');
        var t = e.target;
        while (t && t !== thisOverlay) {
            if (t.getAttribute && t.getAttribute('data-pca-action')) break;
            t = t.parentElement;
        }
        if (!t) return;
        var act = t.getAttribute('data-pca-action');
        if (act === 'bcf-cancel') { thisOverlay.remove(); callback(null); return; }
        if (act === 'bcf-confirm') {
            thisOverlay.remove();
            var decisions = states.map(function(s, i) { return { entry: conflicts[i].entry, targetId: conflicts[i].targetId, overwrite: s }; });
            callback(decisions);
            return;
        }
        if (act === 'bcf-all-yes') { for (var i = 0; i < states.length; i++) { states[i] = true; refreshRow(i); } return; }
        if (act === 'bcf-all-no') { for (var j = 0; j < states.length; j++) { states[j] = false; refreshRow(j); } return; }
        if (act === 'bcf-toggle') {
            var idx = parseInt(t.getAttribute('data-pca-idx'), 10);
            if (!isNaN(idx) && idx >= 0 && idx < states.length) {
                states[idx] = !states[idx];
                refreshRow(idx);
            }
        }
    });
}

// 批量智能迁移：对当前已选条目按"每个独立智能定位"处理
function pcaDoBatchMigrate() {
    var sel = pcaState.migrateSelected || {};
    var selectedIds = Object.keys(sel).filter(function(k) { return sel[k]; });
    if (selectedIds.length === 0) { toastr.warning('请先勾选条目'); return; }

    // 收集已经在队列里的，跳过
    var pendingIds = {};
    pcaState.migratePending.forEach(function(p) { pendingIds[p.entry.id] = true; });

    // 把已选项映射回 leftEntries 索引
    var queue = []; // { entry, leftIdx, sameNameTarget|null }
    var rightEntries = pcaExtract(pcaState.rightPresetData);
    var rightByName = {};
    rightEntries.forEach(function(re) { rightByName[re.name] = re; });

    selectedIds.forEach(function(eid) {
        for (var li = 0; li < pcaState.leftEntries.length; li++) {
            var le = pcaState.leftEntries[li];
            if (le.id !== eid) continue;
            if (pendingIds[le.id]) return; // 已在队列
            var sameName = rightByName[le.name] || null;
            queue.push({ entry: le, leftIdx: li, sameName: sameName });
            break;
        }
    });

    if (queue.length === 0) { toastr.info('没有需要新增的条目（可能都已在队列中）'); return; }

    // 拆分：同名冲突 vs 直接新建
    var conflicts = [];
    var newOnes = [];
    queue.forEach(function(q) {
        if (q.sameName) conflicts.push({ entry: q.entry, targetId: q.sameName.id });
        else newOnes.push(q);
    });

    function applyNewOnes(extraOverwrites) {
        var addedNew = 0, addedOver = 0, lowConf = 0;
        // 先处理覆盖
        if (extraOverwrites && extraOverwrites.length) {
            extraOverwrites.forEach(function(d) {
                pcaState.migrateUndoStack.push({ action:'add', index: pcaState.migratePending.length });
                pcaState.migratePending.push({ action:'overwrite', entry: JSON.parse(JSON.stringify(d.entry)), targetId: d.targetId });
                addedOver++;
            });
        }
        // 处理新建：用智能定位
        newOnes.forEach(function(q) {
            var resolved = pcaResolveSamePosition(q.entry, pcaState.leftEntries, rightEntries);
            if (resolved.confidence === 'low') lowConf++;
            pcaState.migrateUndoStack.push({ action:'add', index: pcaState.migratePending.length });
            pcaState.migratePending.push({
                action: 'new',
                entry: JSON.parse(JSON.stringify(q.entry)),
                insertIndex: resolved.insertIndex,
                insertAfterName: resolved.insertAfterName || '',
                insertBeforeName: resolved.insertBeforeName || '',
                confidence: resolved.confidence,
                posWarn: resolved.warn || ''
            });
            addedNew++;
        });
        // 清空选择
        pcaState.migrateSelected = {};
        pcaRenderMigrate();
        var msg = '已加入队列：' + addedNew + ' 新建';
        if (addedOver) msg += '、' + addedOver + ' 覆盖';
        if (lowConf) msg += '（其中 ' + lowConf + ' 项位置不确定，请检查队列）';
        toastr.success(msg);
    }

    if (conflicts.length === 0) {
        applyNewOnes([]);
        return;
    }
    pcaShowBatchConflictDialog(conflicts, function(decisions) {
        if (decisions === null) { toastr.info('已取消批量迁移'); return; }
        var overwrites = decisions.filter(function(d) { return d.overwrite; });
        applyNewOnes(overwrites);
    });
}

async function pcaDoMigrateApply() {
    if (pcaState.migratePending.length === 0) { toastr.warning('队列为空'); return; }
    pcaLog('应用迁移 ' + pcaState.migratePending.length + ' 个');
    var preset = pcaState.rightPresetData;
    var appliedCount = 0;

    pcaState.migratePending.forEach(function(p) {
        if (p.action === 'overwrite') {
            var prompts = preset.prompts || [];
            for (var i = 0; i < prompts.length; i++) {
                if (prompts[i].name === p.entry.name || prompts[i].identifier === p.targetId) {
                    prompts[i].content = p.entry.content || '';
                    prompts[i].role = p.entry.role || prompts[i].role;
                    // 应用字段编辑覆写（仅写明确改动的字段，避免破坏目标其他字段）
                    var foOv = p.fieldOverrides || (p.entry && p.entry._fieldOverrides) || null;
                    if (foOv) {
                        if (typeof foOv.name === 'string' && foOv.name) prompts[i].name = foOv.name;
                        if (typeof foOv.role === 'string') prompts[i].role = foOv.role;
                        if (typeof foOv.injection_position === 'number') prompts[i].injection_position = foOv.injection_position;
                        if (typeof foOv.injection_depth === 'number') prompts[i].injection_depth = foOv.injection_depth;
                        if (typeof foOv.injection_order === 'number') prompts[i].injection_order = foOv.injection_order;
                        if (Array.isArray(foOv.injection_trigger)) {
                            prompts[i].injection_trigger = foOv.injection_trigger.slice();
                        } else if (foOv.injection_trigger === null && Object.prototype.hasOwnProperty.call(prompts[i], 'injection_trigger')) {
                            delete prompts[i].injection_trigger;
                        }
                        if (typeof foOv.system_prompt === 'boolean') prompts[i].system_prompt = foOv.system_prompt;
                        if (typeof foOv.marker === 'boolean') prompts[i].marker = foOv.marker;
                        if (typeof foOv.forbid_overrides === 'boolean') prompts[i].forbid_overrides = foOv.forbid_overrides;
                    }
                    break;
                }
            }
            var order = pcaGetOrder(preset.prompt_order);
            for (var j = 0; j < order.length; j++) {
                if (order[j].identifier === p.targetId) { order[j].enabled = p.entry.enabled; break; }
            }
            appliedCount++;
        }
    });

    var newEntries = [];
    pcaState.migratePending.forEach(function(p) { if (p.action === 'new') newEntries.push(p); });
    newEntries.sort(function(a, b) { return b.insertIndex - a.insertIndex; });
    newEntries.forEach(function(p) {
        pcaMigrateInsertEntry(preset, p.entry, p.insertIndex);
        appliedCount++;
    });

    var name = pcaState.rightName;
    var ok = await pcaSyncAndSave(preset, name);
    if (!ok) { toastr.error('保存失败'); pcaRefreshDebug(); return; }

    toastr.success('已迁移 ' + appliedCount + ' 个条目到「' + name + '」✓');
    pcaState.migratePending = [];
    pcaState.migrateUndoStack = [];
    pcaState.rightEntries = pcaExtract(preset);
    var result = pcaCompare(pcaState.leftEntries, pcaState.rightEntries);
    pcaState.diffs = result.diffs;
    pcaState.newItems = result.newItems;
    var doc = pcaGetDoc();
    if (doc.querySelector('#pca-tab-diff')) doc.querySelector('#pca-tab-diff').textContent = '开关差异 ('+result.diffs.length+')';
    pcaRenderMigrate();
    pcaRefreshDebug();
}

// ========== 条目编辑模块：应用并保存 ==========
async function pcaDoEditApply() {
    if (pcaState.editPending.length === 0) { toastr.warning('队列为空'); return; }
    var preset = pcaGetEditTargetPreset();
    if (!preset) { toastr.error('找不到目标预设'); return; }
    var presetName = pcaGetEditTargetName();
    pcaLog('应用编辑 ' + pcaState.editPending.length + ' 个 to ' + presetName);
    var appliedCount = 0;
    var prompts = preset.prompts || (preset.prompts = []);
    var order = pcaGetOrder(preset.prompt_order);

    // 顺序执行：toggle / overwrite / delete / new / reorder
    pcaState.editPending.forEach(function(p) {
        try {
            if (p.action === 'toggle') {
                for (var i = 0; i < order.length; i++) {
                    if (order[i].identifier === p.targetId) { order[i].enabled = !!p.enabled; appliedCount++; break; }
                }
            } else if (p.action === 'overwrite') {
                for (var k = 0; k < prompts.length; k++) {
                    if (prompts[k].identifier === p.targetId) {
                        prompts[k].content = (p.entry && p.entry.content) || '';
                        var fo = p.fieldOverrides || null;
                        if (fo) {
                            if (typeof fo.name === 'string' && fo.name) prompts[k].name = fo.name;
                            if (typeof fo.role === 'string') prompts[k].role = fo.role;
                            if (typeof fo.injection_position === 'number') prompts[k].injection_position = fo.injection_position;
                            if (typeof fo.injection_depth === 'number') prompts[k].injection_depth = fo.injection_depth;
                            if (typeof fo.injection_order === 'number') prompts[k].injection_order = fo.injection_order;
                            if (Array.isArray(fo.injection_trigger)) prompts[k].injection_trigger = fo.injection_trigger.slice();
                            else if (fo.injection_trigger === null && Object.prototype.hasOwnProperty.call(prompts[k], 'injection_trigger')) delete prompts[k].injection_trigger;
                            if (typeof fo.system_prompt === 'boolean') prompts[k].system_prompt = fo.system_prompt;
                            if (typeof fo.marker === 'boolean') prompts[k].marker = fo.marker;
                            if (typeof fo.forbid_overrides === 'boolean') prompts[k].forbid_overrides = fo.forbid_overrides;
                        }
                        appliedCount++;
                        break;
                    }
                }
            } else if (p.action === 'delete') {
                for (var di = prompts.length - 1; di >= 0; di--) {
                    if (prompts[di].identifier === p.targetId) { prompts.splice(di, 1); break; }
                }
                for (var dj = order.length - 1; dj >= 0; dj--) {
                    if (order[dj].identifier === p.targetId) { order.splice(dj, 1); break; }
                }
                appliedCount++;
            } else if (p.action === 'new') {
                var fo2 = p.fieldOverrides || null;
                var newPrompt = {
                    identifier: (fo2 && fo2.identifier) || p.entry.id,
                    name: (fo2 && fo2.name) || p.entry.name || '新条目',
                    content: (p.entry && p.entry.content) || '',
                    role: (fo2 && fo2.role) || (p.entry && p.entry.role) || 'system',
                    marker: false,
                    system_prompt: false,
                    forbid_overrides: false,
                };
                if (fo2) {
                    if (typeof fo2.injection_position === 'number') newPrompt.injection_position = fo2.injection_position;
                    if (typeof fo2.injection_depth === 'number') newPrompt.injection_depth = fo2.injection_depth;
                    if (typeof fo2.injection_order === 'number') newPrompt.injection_order = fo2.injection_order;
                    if (Array.isArray(fo2.injection_trigger)) newPrompt.injection_trigger = fo2.injection_trigger.slice();
                    if (typeof fo2.system_prompt === 'boolean') newPrompt.system_prompt = fo2.system_prompt;
                    if (typeof fo2.marker === 'boolean') newPrompt.marker = fo2.marker;
                    if (typeof fo2.forbid_overrides === 'boolean') newPrompt.forbid_overrides = fo2.forbid_overrides;
                }
                prompts.push(newPrompt);
                var insIdx = (typeof p.insertIndex === 'number') ? p.insertIndex : order.length;
                if (insIdx < 0) insIdx = 0;
                if (insIdx > order.length) insIdx = order.length;
                order.splice(insIdx, 0, { identifier: newPrompt.identifier, enabled: !!(p.entry && p.entry.enabled) });
                appliedCount++;
            } else if (p.action === 'reorder') {
                var fromI = -1;
                for (var ri = 0; ri < order.length; ri++) {
                    if (order[ri].identifier === p.targetId) { fromI = ri; break; }
                }
                if (fromI >= 0) {
                    var item = order.splice(fromI, 1)[0];
                    var to = p.newIndex;
                    if (to < 0) to = 0;
                    if (to > order.length) to = order.length;
                    order.splice(to, 0, item);
                    appliedCount++;
                }
            }
        } catch (err) {
            pcaLog('应用单项失败: ' + (err && err.message));
        }
    });

    preset.prompts = prompts;
    if (preset.prompt_order && Array.isArray(preset.prompt_order)) {
        preset.prompt_order.forEach(function(po) { if (po && Array.isArray(po.order)) {} });
    }

    var ok = await pcaSyncAndSave(preset, presetName);
    pcaRefreshDebug();
    if (!ok) { toastr.error('保存失败'); return; }

    toastr.success('已应用 ' + appliedCount + ' 个修改到「' + presetName + '」✓');
    pcaState.editPending = [];
    pcaState.editUndoStack = [];
    // 刷新条目列表（左/右）
    if (pcaState.editTarget === 'left') pcaState.leftEntries = pcaExtract(preset);
    else pcaState.rightEntries = pcaExtract(preset);
    var result = pcaCompare(pcaState.leftEntries, pcaState.rightEntries);
    pcaState.diffs = result.diffs;
    pcaState.newItems = result.newItems;
    var doc = pcaGetDoc();
    if (doc.querySelector('#pca-tab-diff')) doc.querySelector('#pca-tab-diff').textContent = '开关差异 ('+result.diffs.length+')';
    pcaRenderEdit();
}

function pcaOpenPanel() {
    pcaInjectCSS();
    pcaLoadNotes();
    pcaLoadFavGroups();
    var names=pcaGetPresetNames();
    var html=pcaBuildHTML(names);
    var savedNotes = pcaState.migrateNotes || [];
    pcaState={leftName:'',rightName:'',leftEntries:[],rightEntries:[],diffs:[],newItems:[],rightPresetData:null,leftPresetData:null,originalValues:{},activeTab:'diff',compared:false,allPresets:null,migrateSearch:'',migrateSelected:{},migrateNotes:savedNotes,migrateFavActive:false,migratePending:[],migrateUndoStack:[],migrateFilterStatus:'all',migrateFilterDiff:'all',migrateQueueExpanded:false,migrateFavGroups:(pcaState&&pcaState.migrateFavGroups)||{},activeFavGroupId:(pcaState&&pcaState.activeFavGroupId)||'',confHelpExpanded:false,editorClipText:(pcaState&&pcaState.editorClipText)||'',editorClipFrom:(pcaState&&pcaState.editorClipFrom)||'',editorState:null,editorDrafts:{},editorWrap:(pcaState&&typeof pcaState.editorWrap==='boolean')?pcaState.editorWrap:true,editTarget:'right',editPending:[],editUndoStack:[],editSearch:'',editOnlyNew:false,editQueueExpanded:false};
    try {
        var popup=new SillyTavern.Popup(html,SillyTavern.POPUP_TYPE.TEXT,'',{large:true,wide:true,allowVerticalScrolling:true});
        popup.show();
        setTimeout(function(){pcaBindPanel();},200);
        return;
    } catch(e) {}
    var doc=pcaGetDoc();var old=doc.querySelector('#pca-overlay');if(old)old.remove();
    var ov=doc.createElement('div');ov.id='pca-overlay';
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;';
    ov.innerHTML=html;ov.addEventListener('click',function(e){if(e.target===ov)ov.remove();});
    doc.body.appendChild(ov);pcaBindPanel();
}

function pcaBindPanel() {
    var doc=pcaGetDoc();var root=doc.querySelector('#pca-root');if(!root)return;
    if(root.getAttribute('data-pca-bound'))return;
    root.setAttribute('data-pca-bound','1');

    // 主题切换
    var themeSel = root.querySelector('#pca-theme-select');
    if (themeSel) {
        themeSel.addEventListener('change', function(){
            var v = themeSel.value;
            // 重新打开面板让所有内联样式重新计算（最简单可靠的方式）
            pcaApplyTheme(v, { rerender:false });
            // 关闭当前面板再打开
            var dlg = doc.querySelector('dialog.popup:has(#pca-root)');
            var savedState = pcaState;
            // 关闭可能存在的子浮层（编辑器、收藏夹、确认框、说明气泡），避免孤儿引用
            var stale = ['#pca-editor-overlay','#pca-fav-picker-overlay','#pca-fav-mgr-overlay','#pca-insert-overlay','#pca-confirm-overlay','#pca-conf-help-popover'];
            stale.forEach(function(sel){ var el = doc.querySelector(sel); if (el) el.remove(); });
            if (savedState) savedState.editorState = null;
            if (dlg) { try { dlg.close(); } catch(ex) {} dlg.remove(); }
            var ov = doc.querySelector('#pca-overlay'); if (ov) ov.remove();
            // 重新打开
            pcaInjectCSS();
            var names = pcaGetPresetNames();
            var html = pcaBuildHTML(names);
            try {
                var popup = new SillyTavern.Popup(html, SillyTavern.POPUP_TYPE.TEXT, '', {large:true, wide:true, allowVerticalScrolling:true});
                popup.show();
                setTimeout(function(){
                    // 还原 state 与 UI
                    pcaState = savedState;
                    pcaBindPanel();
                    if (pcaState.compared) {
                        // 还原下拉选择
                        var ls = doc.querySelector('#pca-sel-left'); if (ls && pcaState.leftName) ls.value = pcaState.leftName;
                        var rs = doc.querySelector('#pca-sel-right'); if (rs && pcaState.rightName) rs.value = pcaState.rightName;
                        var tabs = doc.querySelector('#pca-tabs'); if (tabs) tabs.style.display = 'block';
                        var footer = doc.querySelector('#pca-footer'); if (footer) footer.style.display = 'flex';
                        pcaSwitchTab(pcaState.activeTab || 'diff');
                    }
                }, 200);
            } catch(e) {}
        });
    }

    root.addEventListener('click', function(e) {
        var currentRoot=doc.querySelector('#pca-root');
        var target=e.target;
        while(target&&target!==currentRoot){if(target.getAttribute&&target.getAttribute('data-pca-action'))break;target=target.parentElement;}
        if(!target||target===currentRoot)return;

        var action=target.getAttribute('data-pca-action');
        var idx=parseInt(target.getAttribute('data-pca-idx')||'-1',10);
        var side=target.getAttribute('data-pca-side')||'';

        switch(action){
            case 'close':
                var doClose = function() {
                    var edOv = doc.querySelector('#pca-editor-overlay');
                    if (edOv) edOv.remove();
                    pcaState.editorState = null;
                    var dlg=doc.querySelector('dialog.popup:has(#pca-root)');
                    if(dlg){try{dlg.close();}catch(ex){}dlg.remove();return;}
                    var ov=doc.querySelector('#pca-overlay');if(ov)ov.remove();
                };
                if (pcaState.migratePending.length > 0) {
                    pcaShowConfirm(
                        '⚠️ 待迁移队列中还有 <span style="color:'+pcaC.migrate+';font-weight:600;">'+pcaState.migratePending.length+'</span> 个未保存的条目<br><br>关闭后将丢失这些待迁移项，确定关闭吗？',
                        function(confirmed) { if (confirmed) doClose(); },
                        { yesText:'丢弃并关闭', noText:'继续编辑', yesColor:pcaC.danger, yesColorDim:'#a04050' }
                    );
                } else {
                    doClose();
                }
                break;
            case 'compare':pcaDoCompare();break;
            case 'debug-toggle':
                var area=doc.querySelector('#pca-debug-area');
                if(area){area.style.display=area.style.display==='none'?'block':'none';pcaRefreshDebug();}
                break;
            case 'tab-diff':pcaSwitchTab('diff');break;
            case 'tab-edit':pcaSwitchTab('edit');break;
            case 'edit-target':
                var sd = target.getAttribute('data-pca-side');
                if (sd === 'left' || sd === 'right') {
                    if (pcaState.editTarget !== sd && pcaState.editPending.length > 0) {
                        pcaShowConfirm('切换目标会清空当前「待修改队列」（'+pcaState.editPending.length+' 项），确定？', function(ok){
                            if (!ok) return;
                            pcaState.editTarget = sd;
                            pcaState.editPending = [];
                            pcaState.editUndoStack = [];
                            pcaRenderEdit();
                        }, { yesText:'切换并清空', noText:'取消', yesColor:pcaC.danger, yesColorDim:'#a04050' });
                    } else {
                        pcaState.editTarget = sd;
                        pcaRenderEdit();
                    }
                }
                break;
            case 'edit-new-entry': pcaEditDoNewEntry(); break;
            case 'edit-toggle': if (idx >= 0) pcaEditDoToggle(idx); break;
            case 'edit-edit': if (idx >= 0) pcaEditDoEdit(idx); break;
            case 'edit-delete': if (idx >= 0) pcaEditDoDelete(idx); break;
            case 'edit-move':
                if (idx >= 0) {
                    var dir = target.getAttribute('data-pca-dir');
                    var entries_em = pcaGetEditTargetEntries();
                    var to = (dir === 'up') ? idx - 1 : idx + 1;
                    if (to >= 0 && to < entries_em.length) pcaEditMoveTo(idx, to);
                }
                break;
            case 'edit-pending-remove':
                if (idx >= 0 && idx < pcaState.editPending.length) {
                    pcaState.editPending.splice(idx, 1);
                    pcaRenderEdit();
                }
                break;
            case 'edit-undo':
                if (pcaState.editUndoStack.length > 0) {
                    var last = pcaState.editUndoStack.pop();
                    if (last.action === 'add' && last.index < pcaState.editPending.length) {
                        pcaState.editPending.splice(last.index, 1);
                    }
                    pcaRenderEdit();
                }
                break;
            case 'edit-clear':
                pcaShowConfirm('清空整个待修改队列？', function(ok){
                    if (!ok) return;
                    pcaState.editPending = [];
                    pcaState.editUndoStack = [];
                    pcaRenderEdit();
                }, { yesText:'清空', noText:'取消', yesColor:pcaC.danger, yesColorDim:'#a04050' });
                break;
            case 'edit-apply':
                pcaDoEditApply();
                break;
            case 'edit-queue-toggle':
                pcaState.editQueueExpanded = !pcaState.editQueueExpanded;
                pcaRenderEdit();
                break;
            case 'tab-migrate':pcaSwitchTab('migrate');break;
            case 'syncall':pcaDoSyncAll();break;
            case 'save':pcaDoSave();break;
            case 'saveas':pcaDoSaveAs();break;

            case 'sync':
                if(idx>=0&&pcaState.diffs[idx]){
                    var d=pcaState.diffs[idx];
                    if(pcaState.originalValues[d.right.id]===undefined)pcaState.originalValues[d.right.id]=d.right.enabled;
                    pcaSetEnabled(pcaState.rightPresetData,d.right.id,d.left.enabled);
                    pcaRenderDiffs();
                }
                break;
            case 'revert':
                if(idx>=0&&pcaState.diffs[idx]){
                    var dr=pcaState.diffs[idx];
                    pcaSetEnabled(pcaState.rightPresetData,dr.right.id,dr.right.enabled);
                    delete pcaState.originalValues[dr.right.id];
                    pcaRenderDiffs();
                }
                break;
            case 'toggle':
                if(idx>=0&&pcaState.diffs[idx]){
                    var dt=pcaState.diffs[idx];
                    if(pcaState.originalValues[dt.right.id]===undefined)pcaState.originalValues[dt.right.id]=dt.right.enabled;
                    var cur=pcaGetEnabled(pcaState.rightPresetData,dt.right.id);
                    pcaSetEnabled(pcaState.rightPresetData,dt.right.id,!cur);
                    pcaRenderDiffs();
                }
                break;
            case 'toggle-new':
                // 兼容老入口；新逻辑在条目编辑面板里
                if(idx>=0&&pcaState.newItems[idx]){
                    var ni=pcaState.newItems[idx];
                    var cn=pcaGetEnabled(pcaState.rightPresetData,ni.right.id);
                    pcaSetEnabled(pcaState.rightPresetData,ni.right.id,!cn);
                }
                break;

            case 'view':
                if(idx>=0&&pcaState.diffs[idx]){
                    var el=doc.querySelector('#pca-pv-'+idx);if(!el)break;
                    if(el.style.display!=='none'&&el.getAttribute('data-side')===side){el.style.display='none';break;}
                    var dv=pcaState.diffs[idx];
                    el.setAttribute('data-side',side);el.style.display='block';
                    if(side==='diff'){
                        el.innerHTML=pcaRenderDiffHTML(dv.left.content,dv.right.content);
                    } else {
                        var cnt=side==='left'?dv.left.content:dv.right.content;
                        var lbl=side==='left'?'左侧(旧)':'右侧(新)';
                        el.innerHTML='<div style="background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:8px;padding:10px 14px;max-height:250px;overflow-y:auto;font-size:12px;line-height:1.6;color:'+pcaC.dim+';white-space:pre-wrap;word-break:break-all;"><div style="color:'+pcaC.gold+';font-size:11px;margin-bottom:6px;font-weight:600;">['+lbl+'] 内容：</div>'+(cnt?pcaEsc(cnt):'<span style="color:#555;">（空内容）</span>')+'</div>';
                    }
                }
                break;
            case 'view-new':
                if(idx>=0&&pcaState.newItems[idx]){
                    var elN=doc.querySelector('#pca-pvn-'+idx);if(!elN)break;
                    if(elN.style.display!=='none'){elN.style.display='none';break;}
                    var cntN=pcaState.newItems[idx].right.content;
                    elN.style.display='block';
                    elN.innerHTML='<div style="background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:8px;padding:10px 14px;max-height:250px;overflow-y:auto;font-size:12px;line-height:1.6;color:'+pcaC.dim+';white-space:pre-wrap;word-break:break-all;"><div style="color:'+pcaC.gold+';font-size:11px;margin-bottom:6px;font-weight:600;">内容：</div>'+(cntN?pcaEsc(cntN):'<span style="color:#555;">（空内容 / 标记类条目）</span>')+'</div>';
                }
                break;

            case 'migrate-edit':
                if (idx >= 0 && idx < pcaState.leftEntries.length) {
                    pcaOpenEditor(pcaState.leftEntries[idx]);
                }
                break;
            case 'migrate-edit-pending':
                if (idx >= 0 && idx < pcaState.migratePending.length) {
                    var pendingP = pcaState.migratePending[idx];
                    // 找到对应的 leftEntry 作为编辑基准
                    var srcEntry = null;
                    for (var spi = 0; spi < pcaState.leftEntries.length; spi++) {
                        if (pcaState.leftEntries[spi].id === pendingP.entry.id) {
                            srcEntry = pcaState.leftEntries[spi];
                            break;
                        }
                    }
                    if (srcEntry) pcaOpenEditor(srcEntry);
                    else toastr.error('找不到原始条目');
                }
                break;

            case 'migrate-add':
                if (idx >= 0) pcaDoMigrateAdd(idx);
                break;
            case 'migrate-add-as-new':
                if (idx >= 0) pcaDoMigrateAddAsNew(idx);
                break;
            case 'batch-toggle':
                var btId = target.getAttribute('data-pca-entry-id');
                if (btId) {
                    if (!pcaState.migrateSelected) pcaState.migrateSelected = {};
                    if (pcaState.migrateSelected[btId]) delete pcaState.migrateSelected[btId];
                    else pcaState.migrateSelected[btId] = true;
                    pcaRenderMigrate();
                }
                break;
            case 'batch-select-all':
                if (!pcaState.migrateSelected) pcaState.migrateSelected = {};
                var visIds = pcaGetVisibleLeftEntryIds();
                visIds.forEach(function(id) { pcaState.migrateSelected[id] = true; });
                pcaRenderMigrate();
                break;
            case 'batch-invert':
                if (!pcaState.migrateSelected) pcaState.migrateSelected = {};
                var visIds2 = pcaGetVisibleLeftEntryIds();
                visIds2.forEach(function(id) {
                    if (pcaState.migrateSelected[id]) delete pcaState.migrateSelected[id];
                    else pcaState.migrateSelected[id] = true;
                });
                pcaRenderMigrate();
                break;
            case 'batch-clear':
                pcaState.migrateSelected = {};
                pcaRenderMigrate();
                break;
            case 'batch-migrate':
                pcaDoBatchMigrate();
                break;
            case 'conf-help-popover':
                pcaShowConfHelpPopover(target);
                break;
            case 'batch-fav':
                // P4 预留：调用收藏夹分组选择器
                var bfSel = pcaState.migrateSelected || {};
                var bfNames = [];
                Object.keys(bfSel).forEach(function(eid) {
                    if (!bfSel[eid]) return;
                    for (var bi = 0; bi < pcaState.leftEntries.length; bi++) {
                        if (pcaState.leftEntries[bi].id === eid) { bfNames.push(pcaState.leftEntries[bi].name); break; }
                    }
                });
                if (bfNames.length === 0) { toastr.warning('请先勾选条目'); break; }
                pcaRenderFavGroupPicker(bfNames, function(_groupId) {});
                break;
            case 'migrate-repos':
                if (idx >= 0 && idx < pcaState.migratePending.length) {
                    var pItem = pcaState.migratePending[idx];
                    if (pItem.action !== 'new') { toastr.info('覆盖类条目无需选位置'); break; }
                    pcaShowInsertPositionPicker(pItem.entry, function(pos, afterName) {
                        if (pos < 0) return;
                        pcaState.migrateUndoStack.push({ action:'edit', index:idx, prevItem: JSON.parse(JSON.stringify(pItem)) });
                        pItem.insertIndex = pos;
                        pItem.insertAfterName = afterName || '';
                        pItem.insertBeforeName = '';
                        pItem.confidence = 'high';
                        pItem.posWarn = '';
                        pcaRenderMigrate();
                        toastr.success('位置已更新');
                    });
                }
                break;
            case 'migrate-remove':
                if (idx >= 0 && pcaState.migratePending[idx]) {
                    pcaState.migrateUndoStack.push({ action:'remove', item:JSON.parse(JSON.stringify(pcaState.migratePending[idx])), index:idx });
                    pcaState.migratePending.splice(idx, 1);
                    pcaRenderMigrate();
                }
                break;
            case 'migrate-undo':
                if (pcaState.migrateUndoStack.length > 0) {
                    var undoItem = pcaState.migrateUndoStack.pop();
                    if (undoItem.action === 'add') {
                        if (undoItem.index < pcaState.migratePending.length) pcaState.migratePending.splice(undoItem.index, 1);
                    } else if (undoItem.action === 'remove') {
                        pcaState.migratePending.splice(undoItem.index, 0, undoItem.item);
                    } else if (undoItem.action === 'edit') {
                        if (undoItem.index < pcaState.migratePending.length) {
                            pcaState.migratePending[undoItem.index] = undoItem.prevItem;
                        }
                    }
                    pcaRenderMigrate();
                    toastr.info('已撤销');
                }
                break;
            case 'migrate-clear':
                pcaState.migrateUndoStack = [];
                pcaState.migratePending = [];
                pcaRenderMigrate();
                toastr.info('已清空队列');
                break;
            case 'migrate-apply':
                pcaDoMigrateApply();
                break;
            case 'migrate-preview':
                if (idx >= 0 && idx < pcaState.leftEntries.length) {
                    var mpEl = doc.querySelector('#pca-mpv-' + idx);
                    if (!mpEl) break;
                    if (mpEl.style.display !== 'none') { mpEl.style.display = 'none'; break; }
                    var mEntry = pcaState.leftEntries[idx];
                    mpEl.style.display = 'block';
                    mpEl.innerHTML = '<div style="background:'+pcaC.input+';border:1px solid '+pcaC.border+';border-radius:8px;padding:10px 14px;max-height:200px;overflow-y:auto;font-size:12px;line-height:1.6;color:'+pcaC.dim+';white-space:pre-wrap;word-break:break-all;"><div style="color:'+pcaC.gold+';font-size:11px;margin-bottom:6px;font-weight:600;">内容：</div>'+(mEntry.content?pcaEsc(mEntry.content):'<span style="color:#555;">（空内容）</span>')+'</div>';
                }
                break;
            case 'migrate-clear-filter':
                pcaState.migrateSearch = '';
                pcaState.migrateFavActive = false;
                pcaState.migrateFilterStatus = 'all';
                pcaState.migrateFilterDiff = 'all';
                pcaState.activeFavGroupId = '';
                pcaRenderMigrate();
                break;

            case 'note-add':
                pcaAddNote();
                break;
            case 'note-del':
                (function() {
                    var gidD = pcaState.activeFavGroupId || '';
                    var arrD;
                    if (gidD) {
                        pcaLoadFavGroups();
                        var gD = pcaState.migrateFavGroups[gidD];
                        if (!gD) return;
                        arrD = gD.notes || [];
                    } else {
                        arrD = pcaState.migrateNotes || [];
                    }
                    if (idx < 0 || idx >= arrD.length) return;
                    var nameD = arrD[idx];
                    pcaRemoveFromFavGroup(nameD, gidD);
                    pcaRenderMigrate();
                    toastr.info('已移除：' + nameD);
                })();
                break;
            case 'note-find':
                (function() {
                    var gidF = pcaState.activeFavGroupId || '';
                    var arrF;
                    if (gidF) {
                        pcaLoadFavGroups();
                        var gF = pcaState.migrateFavGroups[gidF];
                        if (!gF) return;
                        arrF = gF.notes || [];
                    } else {
                        arrF = pcaState.migrateNotes || [];
                    }
                    if (idx < 0 || idx >= arrF.length) return;
                    pcaState.migrateSearch = arrF[idx];
                    pcaState.migrateFavActive = false;
                    pcaRenderMigrate();
                })();
                break;
            case 'fav-tab-pick':
                pcaState.activeFavGroupId = target.getAttribute('data-pca-gid') || '';
                pcaRenderMigrate();
                break;
            case 'fav-mgr-open':
                pcaRenderFavGroupManager();
                break;
            case 'queue-toggle':
                pcaState.migrateQueueExpanded = !pcaState.migrateQueueExpanded;
                pcaRenderMigrate();
                break;
            case 'filter-status':
                pcaState.migrateFilterStatus = target.getAttribute('data-pca-val') || 'all';
                pcaRenderMigrate();
                break;
            case 'filter-diff':
                pcaState.migrateFilterDiff = target.getAttribute('data-pca-val') || 'all';
                pcaRenderMigrate();
                break;
            case 'migrate-diff':
                if (idx >= 0 && idx < pcaState.leftEntries.length) {
                    var dEl = doc.querySelector('#pca-mpv-' + idx);
                    if (!dEl) break;
                    if (dEl.style.display !== 'none' && dEl.getAttribute('data-mode') === 'diff') { dEl.style.display = 'none'; break; }
                    var lEnt = pcaState.leftEntries[idx];
                    var rEnt = null;
                    pcaState.rightEntries.forEach(function(re) { if (re.id === lEnt.id || re.name === lEnt.name) rEnt = re; });
                    dEl.setAttribute('data-mode', 'diff');
                    dEl.style.display = 'block';
                    // 第一参=旧（左），第二参=新（右）；之前两参传反了导致红绿颠倒、左右标签错位
                    dEl.innerHTML = pcaRenderDiffHTML(lEnt.content, rEnt ? rEnt.content : '');
                }
                break;
            case 'fav-toggle-all':
                pcaState.migrateFavActive = !pcaState.migrateFavActive;
                if (pcaState.migrateFavActive) pcaState.migrateSearch = '';
                pcaRenderMigrate();
                if (pcaState.migrateFavActive) {
                    var favNamesNow = pcaGetActiveFavNames();
                    var favLabel = pcaState.activeFavGroupId
                        ? ((pcaState.migrateFavGroups[pcaState.activeFavGroupId] && pcaState.migrateFavGroups[pcaState.activeFavGroupId].name) || '?')
                        : '未分组';
                    toastr.info('已按「'+favLabel+'」筛选 ' + favNamesNow.length + ' 个条目');
                }
                break;
        }
    });
}

pcaSetupButton();
pcaLoadNotes();
pcaLoadFavGroups();
pcaLog('v2.7 就绪');


