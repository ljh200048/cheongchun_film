const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const port = 3000;
const aabPath = path.join(__dirname, 'android', 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');

// Helper to compute SHA-256 of the AAB file dynamically
function getFileChecksum(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (e) {
    return 'N/A';
  }
}

// Helper to format file size
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const server = http.createServer((req, res) => {
  // ROUTE: Download AAB File
  if (req.url === '/download-aab') {
    if (fs.existsSync(aabPath)) {
      const stat = fs.statSync(aabPath);
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=app-release.aab',
        'Content-Length': stat.size,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private'
      });
      const readStream = fs.createReadStream(aabPath);
      readStream.pipe(res);
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <html>
          <head>
            <title>File Not Found</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-[#0b0c10] text-[#c5c6c7] flex items-center justify-center min-h-screen">
            <div class="bg-[#1f2833] p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-500/30 text-center">
              <h2 class="text-2xl font-bold text-red-500 mb-4">AAB 파일을 찾을 수 없습니다</h2>
              <p class="text-sm text-gray-400 mb-6">아직 안드로이드 앱 빌드가 완료되지 않았거나 파일이 누락되었습니다.</p>
              <a href="/" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block">대시보드로 가기</a>
            </div>
          </body>
        </html>
      `);
      return;
    }
  }

  // ROUTE: Download Center UI Dashboard (Root)
  if (req.url === '/' || req.url === '/index.html') {
    let fileExists = false;
    let fileSize = 'Unknown Size';
    let fileModified = 'N/A';
    let fileSha = 'N/A';

    if (fs.existsSync(aabPath)) {
      fileExists = true;
      const stat = fs.statSync(aabPath);
      fileSize = formatBytes(stat.size);
      
      const date = new Date(stat.mtime);
      fileModified = date.getFullYear() + '년 ' + 
                     (date.getMonth() + 1) + '월 ' + 
                     date.getDate() + '일 ' + 
                     String(date.getHours()).padStart(2, '0') + ':' + 
                     String(date.getMinutes()).padStart(2, '0') + ':' + 
                     String(date.getSeconds()).padStart(2, '0');
                     
      fileSha = getFileChecksum(aabPath);
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>청춘필름 안드로이드 AAB 다운로드 센터</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Pretendard:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Pretendard', sans-serif;
    }
    .space-font {
      font-family: 'Space Grotesk', sans-serif;
    }
  </style>
</head>
<body class="bg-[#0b0c10] text-gray-150 min-h-screen flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300">

  <!-- Background Decorative Orbs -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/5 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-teal-500/5 blur-[150px] rounded-full"></div>
  </div>

  <!-- Header -->
  <header class="w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
    <div class="flex items-center gap-3">
      <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent space-font">CHEONGCHUN FILM</span>
      <span class="bg-gray-800/80 border border-gray-700/50 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">모바일 빌드 서버</span>
    </div>
    <a href="https://cheongchun.cloud" target="_blank" class="text-sm text-gray-400 hover:text-emerald-400 font-medium transition-colors flex items-center gap-1">
      메인 웹사이트 방문 <span class="text-xs">↗</span>
    </a>
  </header>

  <!-- Main Content -->
  <main class="flex-1 w-full max-w-5xl mx-auto px-6 py-8 flex flex-col justify-center items-center relative z-10">
    <div class="w-full max-w-2xl bg-[#12141c]/90 border border-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/80 flex flex-col gap-8 transition-transform duration-300">
      
      <!-- Top Section: App info and build status -->
      <div class="text-center flex flex-col items-center gap-3">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-extrabold text-2xl tracking-tighter">
          청춘
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight mt-2">청춘필름 모바일 앱</h1>
          <p class="text-gray-400 text-sm mt-1">원스토어 무선앱 등록 및 최종 출시를 위한 빌드 결과물</p>
        </div>
        
        <!-- Status Badge -->
        <div class="mt-2">
          ${fileExists ? `
            <span class="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm shadow-emerald-500/5">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> 빌드 성공 (Build Succeeded)
            </span>
          ` : `
            <span class="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              <span class="w-2 h-2 rounded-full bg-red-400"></span> 파일을 찾을 수 없음 (Not Found)
            </span>
          `}
        </div>
      </div>

      <!-- Action Button Area -->
      <div class="flex flex-col gap-3">
        ${fileExists ? `
          <a href="/download-aab" class="group relative bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 text-white font-semibold text-lg py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
            <svg class="w-6 h-6 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            <span>app-release.aab 다운로드 (Click to Download)</span>
          </a>
        ` : `
          <div class="bg-gray-950/50 border border-white/5 text-center p-6 rounded-2xl">
            <p class="text-sm text-red-500 font-semibold">대기 중: AAB 파일 컴파일이 감지되지 않았습니다.</p>
            <p class="text-xs text-gray-500 mt-1">서버 빌드가 진행 중이거나 실패했는지 확인이 필요합니다.</p>
          </div>
        `}
      </div>

      <!-- File Metadata Card -->
      <div class="bg-gray-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 text-sm">
        <h3 class="font-bold text-gray-300 tracking-tight flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          빌드 파일 원본 정보 (File Details)
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-2 text-[#b0b3b8]">
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-500">바이너리 파일 이름 (Filename)</span>
            <span class="font-mono text-white text-xs select-all">app-release.aab</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-500">패키지 고유 ID (App ID)</span>
            <span class="font-mono text-white text-xs select-all">com.cheongchunfilm.mobile</span>
          </div>
          <div class="flex flex-col gap-1 border-t border-white/[0.03] pt-3">
            <span class="text-xs text-gray-500">파일 크기 (File Size)</span>
            <span class="text-white font-semibold font-mono">${fileSize}</span>
          </div>
          <div class="flex flex-col gap-1 border-t border-white/[0.03] pt-3">
            <span class="text-xs text-gray-500">마지막 빌드 완료 (Last Compiled)</span>
            <span class="text-white font-medium">${fileModified}</span>
          </div>
          <div class="flex flex-col col-span-1 sm:col-span-2 gap-1 border-t border-white/[0.03] pt-3">
            <span class="text-xs text-gray-500 flex justify-between items-center">
              <span>SHA-256 암호화 서명 해시 (Integrity Check)</span>
              <button onclick="copyHash()" class="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 focus:outline-none">
                <span id="copy-text">복사하기</span>
              </button>
            </span>
            <span id="hash-string" class="font-mono text-[11px] text-emerald-400/90 break-all select-all py-1.5 px-2.5 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-lg">${fileSha}</span>
          </div>
        </div>
      </div>

      <!-- Instruction Guide for OneStore -->
      <div class="bg-gray-950/20 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 text-sm">
        <h3 class="font-bold text-gray-300 tracking-tight flex items-center gap-2 border-b border-white/[0.03] pb-2">
          📌 원스토어(OneStore) 업로드 가이드
        </h3>
        <ol class="flex flex-col gap-3 text-[#b0b3b8] list-decimal list-inside pl-1 text-[13px]">
          <li>
            <strong class="text-white font-medium">AAB 파일 저장:</strong> 위 의 다운로드 버튼을 눌러 로컬 저장소에 저장합니다.
          </li>
          <li>
            <strong class="text-white font-medium">원스토어 개발자 센터 로그인:</strong> <a href="https://dev.onestore.co.kr/" target="_blank" class="text-emerald-400 hover:underline inline-block font-semibold">dev.onestore.co.kr</a> 사이트에 접속하여 로그인합니다.
          </li>
          <li>
            <strong class="text-white font-medium">앱 신규 등록:</strong> <em>[어플리케이션 관리]</em> 에 진입하여 앱 정보, 아이콘, 스크린샷 등을 입력합니다.
          </li>
          <li>
            <strong class="text-white font-medium">바이너리 업로드:</strong> 바이너리 목록 화면에서 위에서 다운로드한 <code class="bg-[#1e2029] px-1.5 py-0.5 rounded text-white text-xs">app-release.aab</code> 파일을 끌어다 놓아 업로드합니다.
          </li>
          <li>
            <strong class="text-white font-medium">출시 신청:</strong> 바이너리 검증 완료 후, 원스토어 검수팀에 심사를 요청합니다.
          </li>
        </ol>
      </div>

    </div>
  </main>

  <!-- Footer -->
  <footer class="w-full text-center py-6 text-xs text-gray-500 border-t border-white/[0.03] relative z-10">
    <p>© 2026 청춘필름(Cheongchun Film). All Rights Reserved.</p>
  </footer>

  <script>
    function copyHash() {
      const hashText = document.getElementById('hash-string').innerText;
      navigator.clipboard.writeText(hashText).then(() => {
        const copyBtn = document.getElementById('copy-text');
        copyBtn.innerText = '복사 완료! ✔';
        copyBtn.classList.remove('text-emerald-400');
        copyBtn.classList.add('text-white');
        setTimeout(() => {
          copyBtn.innerText = '복사하기';
          copyBtn.classList.add('text-emerald-400');
          copyBtn.classList.remove('text-white');
        }, 2000);
      });
    }
  </script>

</body>
</html>
    `);
    return;
  }

  // Fallback for everything else
  const filePath = path.join(__dirname, 'dist', 'index.html');
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<html><head><script>window.location.href="https://cheongchun.cloud";</script></head><body>Redirecting to Cheongchun Film...</body></html>');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

