const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const port = 3000;
const aabPath = path.join(__dirname, 'android', 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
const apkPath = path.join(__dirname, 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');

// Helper to compute SHA-256 of the file dynamically
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
  // ROUTE: Download APK File
  if (req.url === '/download-apk') {
    if (fs.existsSync(apkPath)) {
      const stat = fs.statSync(apkPath);
      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename=app-release.apk',
        'Content-Length': stat.size,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private'
      });
      const readStream = fs.createReadStream(apkPath);
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
              <h2 class="text-2xl font-bold text-red-500 mb-4 font-sans">APK 파일을 찾을 수 없습니다</h2>
              <p class="text-sm text-gray-400 mb-6 font-sans">아직 안드로이드 앱 빌드가 완료되지 않았거나 APK 파일이 누락되었습니다.</p>
              <a href="/" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block font-sans">대시보드로 가기</a>
            </div>
          </body>
        </html>
      `);
      return;
    }
  }

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
              <h2 class="text-2xl font-bold text-red-500 mb-4 font-sans">AAB 파일을 찾을 수 없습니다</h2>
              <p class="text-sm text-gray-400 mb-6 font-sans">아직 안드로이드 앱 빌드가 완료되지 않았거나 파일이 누락되었습니다.</p>
              <a href="/" class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-block font-sans">대시보드로 가기</a>
            </div>
          </body>
        </html>
      `);
      return;
    }
  }

  // ROUTE: Download Center UI Dashboard (Root)
  if (req.url === '/' || req.url === '/index.html') {
    let aabExists = false;
    let aabSize = 'Unknown Size';
    let aabModified = 'N/A';
    let aabSha = 'N/A';

    if (fs.existsSync(aabPath)) {
      aabExists = true;
      const stat = fs.statSync(aabPath);
      aabSize = formatBytes(stat.size);
      const date = new Date(stat.mtime);
      aabModified = date.getFullYear() + '년 ' + 
                   (date.getMonth() + 1) + '월 ' + 
                   date.getDate() + '일 ' + 
                   String(date.getHours()).padStart(2, '0') + ':' + 
                   String(date.getMinutes()).padStart(2, '0') + ':' + 
                   String(date.getSeconds()).padStart(2, '0');
      aabSha = getFileChecksum(aabPath);
    }

    let apkExists = false;
    let apkSize = 'Unknown Size';
    let apkModified = 'N/A';
    let apkSha = 'N/A';

    if (fs.existsSync(apkPath)) {
      apkExists = true;
      const stat = fs.statSync(apkPath);
      apkSize = formatBytes(stat.size);
      const date = new Date(stat.mtime);
      apkModified = date.getFullYear() + '년 ' + 
                   (date.getMonth() + 1) + '월 ' + 
                   date.getDate() + '일 ' + 
                   String(date.getHours()).padStart(2, '0') + ':' + 
                   String(date.getMinutes()).padStart(2, '0') + ':' + 
                   String(date.getSeconds()).padStart(2, '0');
      apkSha = getFileChecksum(apkPath);
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>청춘필름 안드로이드 모바일 통합 빌드 센터</title>
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
<body class="bg-[#0b0c10] text-[#c5c6c7] min-h-screen flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-300">

  <!-- Background Decorative Orbs -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/5 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-teal-500/5 blur-[150px] rounded-full"></div>
  </div>

  <!-- Header -->
  <header class="w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
    <div class="flex items-center gap-3">
      <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent space-font">CHEONGCHUN FILM</span>
      <span class="bg-gray-800/80 border border-gray-700/50 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">통합 빌드 서버</span>
    </div>
    <a href="https://cheongchun.cloud" target="_blank" class="text-sm text-gray-400 hover:text-emerald-400 font-medium transition-colors flex items-center gap-1">
      메인 웹사이트 방문 <span class="text-xs">↗</span>
    </a>
  </header>

  <!-- Main Content -->
  <main class="flex-1 w-full max-w-5xl mx-auto px-6 py-8 flex flex-col justify-center items-center relative z-10">
    <div class="w-full max-w-3xl bg-[#12141c]/90 border border-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/80 flex flex-col gap-8 transition-transform duration-300">
      
      <!-- Top Section: App info and build status -->
      <div class="text-center flex flex-col items-center gap-3">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-extrabold text-2xl tracking-tighter">
          청춘
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight mt-2 font-sans">청춘필름 모바일 앱 다운로드</h1>
          <p class="text-gray-400 text-sm mt-1 font-sans">직접 다운로드하여 설치하는 APK 파일 및 원스토어 신규 등록용 AAB 통합 패키지</p>
        </div>
        
        <!-- Status Badges -->
        <div class="mt-2 flex flex-wrap justify-center gap-2">
          ${apkExists ? `
            <span class="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> APK 준비 완료
            </span>
          ` : `
            <span class="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span> APK 빌드 중...
            </span>
          `}
          ${aabExists ? `
            <span class="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> AAB 준비 완료
            </span>
          ` : `
            <span class="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span> AAB 빌드 중...
            </span>
          `}
        </div>
      </div>

      <!-- Main Action Panels (Dual Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- APK Sideload Direct Download Card -->
        <div class="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.02] p-6 flex flex-col justify-between gap-5 h-full relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none"></div>
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20 font-bold uppercase tracking-wider">추천 (기기 설치용)</span>
            </div>
            <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
              모바일 직접 설치 (APK)
            </h2>
            <p class="text-xs text-gray-400 leading-relaxed mb-4">스마트폰(안드로이드)에 무선으로 직접 다운로드하여 즉시 앱을 설치하고 사용해볼 수 있습니다.</p>
            
            <div class="flex flex-col gap-1.5 text-xs text-[#a0a5b8]">
              <div class="flex justify-between border-b border-white/[0.03] pb-1.5"><span class="text-gray-500">파일명</span><span class="font-mono text-white">app-release.apk</span></div>
              <div class="flex justify-between border-b border-white/[0.03] pb-1.5"><span class="text-gray-500">파일 크기</span><span class="font-semibold text-emerald-400 font-mono">${apkSize}</span></div>
              <div class="flex justify-between pb-1.5"><span class="text-gray-500">마지막 빌드</span><span class="text-[#c5c6c7] font-mono select-none">${apkModified}</span></div>
            </div>
          </div>
          
          <div>
            ${apkExists ? `
              <a href="/download-apk" class="group w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/20 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5">
                <svg class="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                APK 즉시 다운로드
              </a>
            ` : `
              <div class="w-full bg-gray-900/80 border border-white/5 text-center py-3 px-4 rounded-xl text-xs text-[#a0a3b3]">
                <div class="flex items-center justify-center gap-1.5 mb-1">
                  <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                  <span class="font-semibold text-yellow-500">APK 빌드 파일 검증 중...</span>
                </div>
                약 1~2분 뒤 페이지를 새로고침 해주세요.
              </div>
            `}
          </div>
        </div>

        <!-- AAB App Bundle OneStore Upload Card -->
        <div class="rounded-2xl border border-white/5 bg-white/[0.01] p-6 flex flex-col justify-between gap-5 h-full relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 blur-2xl rounded-full pointer-events-none"></div>
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-teal-400 text-xs px-2 py-0.5 rounded bg-teal-400/10 border border-teal-400/20 font-bold uppercase tracking-wider">스토어 출시용</span>
            </div>
            <h2 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              원스토어 등록용 (AAB)
            </h2>
            <p class="text-xs text-gray-400 leading-relaxed mb-4">구글, 원스토어 등 공식 앱 스토어 판매 승인 및 정규 릴리즈 등록 목적으로 제출할 때 사용합니다.</p>
            
            <div class="flex flex-col gap-1.5 text-xs text-[#a0a5b8]">
              <div class="flex justify-between border-b border-white/[0.03] pb-1.5"><span class="text-gray-500">파일명</span><span class="font-mono text-white">app-release.aab</span></div>
              <div class="flex justify-between border-b border-white/[0.03] pb-1.5"><span class="text-gray-500">파일 크기</span><span class="font-semibold text-teal-400 font-mono">${aabSize}</span></div>
              <div class="flex justify-between pb-1.5"><span class="text-gray-500">마지막 빌드</span><span class="text-[#c5c6c7] font-mono select-none">${aabModified}</span></div>
            </div>
          </div>
          
          <div>
            ${aabExists ? `
              <a href="/download-aab" class="group w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg hover:shadow-teal-500/20 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5">
                <svg class="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                AAB 패키지 다운로드
              </a>
            ` : `
              <div class="w-full bg-gray-900/80 border border-white/5 text-center py-3 px-4 rounded-xl text-xs text-[#a0a3b3]">
                <div class="flex items-center justify-center gap-1.5 mb-1">
                  <span class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                  <span class="font-semibold text-yellow-500">AAB 빌드 파일 검증 중...</span>
                </div>
                약 1~2분 뒤 페이지를 새로고침 해주세요.
              </div>
            `}
          </div>
        </div>

      </div>

      <!-- APK Sideloading Instructions -->
      <div class="bg-gray-950/25 border border-emerald-500/10 rounded-2xl p-6 flex flex-col gap-4 text-sm">
        <h3 class="font-bold text-emerald-400 tracking-tight flex items-center gap-2 border-b border-white/[0.03] pb-2">
          📱 안드로이드 APK 직접 설치 방법 (가이드)
        </h3>
        <ol class="flex flex-col gap-3 text-[#b0b3b8] list-decimal list-inside pl-1 text-[13px] leading-relaxed">
          <li>
            <strong class="text-white font-medium">안드로이드 스마트폰으로 브라우저 접속:</strong> 본 다운로드 페이지 링크를 모바일 기기 브라우저에서 엽니다.
          </li>
          <li>
            <strong class="text-white font-medium">APK 다운로드:</strong> 왼쪽의 <span class="text-emerald-400 font-semibold">[APK 즉시 다운로드]</span> 버튼을 터치하여 내 장치에 저장합니다.
          </li>
          <li>
            <strong class="text-white font-medium">무선 파일 설치 실행:</strong> 다운로드가 완료되면 알림창이나 내 파일 등 파일 매니저에서 <code class="bg-[#1e2029] px-1.5 py-0.5 rounded text-white text-xs">app-release.apk</code> 파일을 터치해 실행합니다.
          </li>
          <li>
            <strong class="text-white font-medium">알 수 없는 앱 설치 동의:</strong> 보안 설정을 이유로 경고창 또는 "출처를 알 수 없는 앱 설치" 설정 화면이 뜰 경우, 스마트폰 환경 설정에서 <strong class="text-[#c5c6c7] font-semibold">"이 출처 허용"</strong> 또는 <strong class="text-[#c5c6c7] font-semibold">"허용"</strong>을 체크해 활성화해 주세요.
          </li>
          <li>
            <strong class="text-white font-medium">앱 설치 완료 및 사용:</strong> 설치 안내를 확인하고 동의하면 바로 청춘필름 앱이 실행되어 실제 휴대폰 화면에서 다운로드/사용이 가능합니다!
          </li>
        </ol>
      </div>

      <!-- File Hash Integrities -->
      <div class="bg-gray-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 text-sm">
        <h3 class="font-bold text-gray-300 tracking-tight flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          빌드 메타데이터 정보 (Metadata)
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1 text-[#b0b3b8]">
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-500">패키지 네임 (Package App ID)</span>
            <span class="font-mono text-white text-xs select-all">com.cheongchunfilm.app</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-500">서명 서티피케이션 (Owner CN)</span>
            <span class="font-mono text-white text-xs select-all">CheongchunFilm (KR)</span>
          </div>
          
          ${apkExists ? `
            <div class="flex flex-col col-span-1 sm:col-span-2 gap-1 border-t border-white/[0.03] pt-3">
              <span class="text-xs text-gray-500">APK SHA-256 전자 서명 해시 (Integrity Check)</span>
              <span class="font-mono text-[11px] text-emerald-400/90 break-all select-all py-1 px-2 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-lg">${apkSha}</span>
            </div>
          ` : ''}
          ${aabExists ? `
            <div class="flex flex-col col-span-1 sm:col-span-2 gap-1 border-t border-white/[0.03] pt-3">
              <span class="text-xs text-gray-500">AAB SHA-256 전자 서명 해시</span>
              <span class="font-mono text-[11px] text-[#2dd4bf]/90 break-all select-all py-1 px-2 bg-teal-500/[0.02] border border-teal-500/10 rounded-lg">${aabSha}</span>
            </div>
          ` : ''}
        </div>
      </div>

    </div>
  </main>

  <!-- Footer -->
  <footer class="w-full text-center py-6 text-xs text-gray-500 border-t border-white/[0.03] relative z-10 font-sans">
    <p>© 2026 청춘필름(Cheongchun Film). All Rights Reserved.</p>
  </footer>

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

