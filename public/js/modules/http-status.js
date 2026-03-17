const HTTP_CODES = [
  // 1xx
  { code:100, name:'Continue', cat:'1xx',
    desc:  'The server has received the request headers and the client should proceed to send the request body.',
    desc_id:'Server telah menerima header permintaan dan klien harus melanjutkan pengiriman body permintaan.' },
  { code:101, name:'Switching Protocols', cat:'1xx',
    desc:  'The requester has asked the server to switch protocols and the server has agreed to do so.',
    desc_id:'Pemohon meminta server untuk beralih protokol dan server telah menyetujuinya.' },
  // 2xx
  { code:200, name:'OK', cat:'2xx',
    desc:  'Standard response for successful HTTP requests. The actual response will depend on the request method used.',
    desc_id:'Respons standar untuk permintaan HTTP yang berhasil. Respons aktual bergantung pada metode permintaan yang digunakan.' },
  { code:201, name:'Created', cat:'2xx',
    desc:  'The request has been fulfilled, resulting in the creation of a new resource.',
    desc_id:'Permintaan telah dipenuhi dan menghasilkan pembuatan sumber daya baru.' },
  { code:202, name:'Accepted', cat:'2xx',
    desc:  'The request has been accepted for processing, but the processing has not been completed.',
    desc_id:'Permintaan telah diterima untuk diproses, namun pemrosesan belum selesai.' },
  { code:204, name:'No Content', cat:'2xx',
    desc:  'The server successfully processed the request, and is not returning any content.',
    desc_id:'Server berhasil memproses permintaan, tetapi tidak mengembalikan konten apapun.' },
  { code:206, name:'Partial Content', cat:'2xx',
    desc:  'The server is delivering only part of the resource due to a range header sent by the client.',
    desc_id:'Server hanya mengirimkan sebagian sumber daya karena header range yang dikirim klien.' },
  // 3xx
  { code:301, name:'Moved Permanently', cat:'3xx',
    desc:  'This and all future requests should be directed to the given URI.',
    desc_id:'Permintaan ini dan semua permintaan berikutnya harus diarahkan ke URI yang diberikan.' },
  { code:302, name:'Found', cat:'3xx',
    desc:  'Tells the client to look at (browse to) another URL. Temporary redirect.',
    desc_id:'Memberitahu klien untuk mengakses URL lain. Pengalihan sementara.' },
  { code:304, name:'Not Modified', cat:'3xx',
    desc:  'Indicates that the resource has not been modified since the version specified by the request headers.',
    desc_id:'Menunjukkan bahwa sumber daya belum diubah sejak versi yang ditentukan di header permintaan.' },
  { code:307, name:'Temporary Redirect', cat:'3xx',
    desc:  'The request should be repeated with another URI, but future requests should still use the original URI.',
    desc_id:'Permintaan harus diulang ke URI lain, tetapi permintaan berikutnya tetap menggunakan URI asli.' },
  { code:308, name:'Permanent Redirect', cat:'3xx',
    desc:  'The request and all future requests should be repeated using another URI.',
    desc_id:'Permintaan ini dan semua permintaan berikutnya harus diulang menggunakan URI lain.' },
  // 4xx
  { code:400, name:'Bad Request', cat:'4xx',
    desc:  'The server cannot or will not process the request due to an apparent client error.',
    desc_id:'Server tidak dapat memproses permintaan karena kesalahan yang jelas dari sisi klien.' },
  { code:401, name:'Unauthorized', cat:'4xx',
    desc:  'Authentication is required and has failed or has not yet been provided.',
    desc_id:'Autentikasi diperlukan namun gagal atau belum diberikan.' },
  { code:403, name:'Forbidden', cat:'4xx',
    desc:  'The request was valid, but the server is refusing action. The user might not have the necessary permissions.',
    desc_id:'Permintaan valid, tetapi server menolak untuk memprosesnya. Pengguna mungkin tidak memiliki izin yang diperlukan.' },
  { code:404, name:'Not Found', cat:'4xx',
    desc:  'The requested resource could not be found but may be available in the future.',
    desc_id:'Sumber daya yang diminta tidak ditemukan, tetapi mungkin tersedia di masa mendatang.' },
  { code:405, name:'Method Not Allowed', cat:'4xx',
    desc:  'A request method is not supported for the requested resource.',
    desc_id:'Metode permintaan tidak didukung untuk sumber daya yang diminta.' },
  { code:408, name:'Request Timeout', cat:'4xx',
    desc:  'The server timed out waiting for the request.',
    desc_id:'Server kehabisan waktu menunggu permintaan dari klien.' },
  { code:409, name:'Conflict', cat:'4xx',
    desc:  'Indicates that the request could not be processed because of conflict in the current state of the resource.',
    desc_id:'Permintaan tidak dapat diproses karena konflik pada kondisi sumber daya saat ini.' },
  { code:410, name:'Gone', cat:'4xx',
    desc:  'Indicates that the resource requested is no longer available and will not be available again.',
    desc_id:'Sumber daya yang diminta sudah tidak tersedia dan tidak akan tersedia lagi.' },
  { code:413, name:'Payload Too Large', cat:'4xx',
    desc:  'The request is larger than the server is willing or able to process.',
    desc_id:'Ukuran permintaan melebihi batas yang bersedia atau mampu diproses server.' },
  { code:415, name:'Unsupported Media Type', cat:'4xx',
    desc:  'The request entity has a media type which the server or resource does not support.',
    desc_id:'Entitas permintaan memiliki tipe media yang tidak didukung oleh server atau sumber daya.' },
  { code:422, name:'Unprocessable Entity', cat:'4xx',
    desc:  'The request was well-formed but was unable to be followed due to semantic errors.',
    desc_id:'Permintaan sudah terformat dengan benar, tetapi tidak dapat diproses karena kesalahan semantik.' },
  { code:429, name:'Too Many Requests', cat:'4xx',
    desc:  'The user has sent too many requests in a given amount of time (rate limiting).',
    desc_id:'Pengguna telah mengirim terlalu banyak permintaan dalam waktu tertentu (pembatasan laju).' },
  // 5xx
  { code:500, name:'Internal Server Error', cat:'5xx',
    desc:  'A generic error message, given when an unexpected condition was encountered.',
    desc_id:'Pesan kesalahan umum yang diberikan ketika kondisi tak terduga terjadi di server.' },
  { code:501, name:'Not Implemented', cat:'5xx',
    desc:  'The server either does not recognize the request method, or it lacks the ability to fulfil the request.',
    desc_id:'Server tidak mengenali metode permintaan atau tidak memiliki kemampuan untuk memenuhi permintaan.' },
  { code:502, name:'Bad Gateway', cat:'5xx',
    desc:  'The server was acting as a gateway or proxy and received an invalid response from the upstream server.',
    desc_id:'Server bertindak sebagai gateway atau proxy dan menerima respons tidak valid dari server upstream.' },
  { code:503, name:'Service Unavailable', cat:'5xx',
    desc:  'The server is currently unavailable (overloaded or down for maintenance).',
    desc_id:'Server saat ini tidak tersedia karena kelebihan beban atau sedang dalam pemeliharaan.' },
  { code:504, name:'Gateway Timeout', cat:'5xx',
    desc:  'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.',
    desc_id:'Server bertindak sebagai gateway atau proxy dan tidak menerima respons tepat waktu dari server upstream.' },
  { code:505, name:'HTTP Version Not Supported', cat:'5xx',
    desc:  'The server does not support the HTTP protocol version used in the request.',
    desc_id:'Server tidak mendukung versi protokol HTTP yang digunakan dalam permintaan.' },
];

const CAT_COLORS = {
  '1xx': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  '2xx': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  '3xx': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  '4xx': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  '5xx': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const filterSelect = document.getElementById('filterSelect');
  const listEl = document.getElementById('codeList');
  const lang = (typeof LANG !== 'undefined' ? LANG : 'en');

  function getDesc(c) {
    return (lang === 'id' && c.desc_id) ? c.desc_id : c.desc;
  }

  function render() {
    const q = searchInput.value.toLowerCase();
    const cat = filterSelect.value;
    const filtered = HTTP_CODES.filter(c => {
      const matchCat = !cat || c.cat === cat;
      const matchQ = !q || c.code.toString().includes(q) || c.name.toLowerCase().includes(q) || getDesc(c).toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    listEl.innerHTML = filtered.map(c => `
      <div class="card p-4 space-y-1 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
        <div class="flex items-center gap-3">
          <span class="font-mono font-bold text-lg text-slate-900 dark:text-slate-100">${c.code}</span>
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${CAT_COLORS[c.cat]}">${c.cat}</span>
          <span class="font-medium text-sm text-slate-800 dark:text-slate-200">${c.name}</span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">${getDesc(c)}</p>
      </div>`).join('');
    if (!filtered.length) listEl.innerHTML = '<p class="text-sm text-slate-400 text-center py-8">No results</p>';
  }

  searchInput.addEventListener('input', render);
  filterSelect.addEventListener('change', render);
  render();
});
