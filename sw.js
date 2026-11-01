const V='meu-caixa-v0.18',CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','vendor/pdfjs/pdf.mjs','vendor/pdfjs/pdf.worker.mjs','vendor/pdfjs/cmaps/UniJIS-UCS2-H.bcmap','vendor/fonts/hanken-300.woff2','vendor/fonts/hanken-400.woff2','vendor/fonts/hanken-500.woff2','vendor/fonts/hanken-600.woff2','vendor/fonts/hanken-700.woff2','vendor/fonts/hanken-800.woff2','vendor/fonts/caveat-500.woff2','vendor/fonts/caveat-700.woff2'];
// A nova versão NÃO assume sozinha: fica "esperando" até o usuário escolher "Atualizar agora" (mensagem SKIP_WAITING).
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)))});
// Novidades desta versão: o app pede (NOTAS) para mostrar no aviso e na aba Versões antes de a atualização ser aceita.
const NOTAS={versao:'0.18',
 resumo:['Cópia automática dos dados uma vez por dia (as 5 últimas)','Cópia de segurança antes de apagar tudo e antes de restaurar','Aviso antes de restaurar backup de versão mais nova'],
 itens:['Cópia automática dos dados uma vez por dia, com as 5 últimas guardadas em Dados e privacidade','Cópia de segurança antes de apagar tudo e antes de restaurar um backup','Aviso antes de restaurar um backup de versão mais nova, com a opção de continuar','Lista de cópias automáticas com botão de restaurar cada uma','Com senha, as cópias automáticas ficam criptografadas']};
self.addEventListener('message',e=>{if(!e.data)return;if(e.data.type==='SKIP_WAITING')self.skipWaiting();if(e.data.type==='NOTAS'&&e.source)e.source.postMessage({type:'NOTAS',...NOTAS})});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x.startsWith('meu-caixa-')).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 // Página principal: do cache enquanto o usuário não aceitar a atualização (assim "manter a atual" vale de fato).
 if(r.mode==='navigate'){e.respondWith(caches.match('index.html').then(h=>h||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put('index.html',cp))}return res}).catch(()=>caches.match('index.html'))));return}
 e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{if(res.ok&&new URL(r.url).origin===location.origin){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>h)))});
