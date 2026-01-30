// Scroll detection for navbar and logo
let lastScrollTop = 0;
let scrollThreshold = 100;

window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  const logo = document.querySelector('.header-logo');
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  // At the very top of the page
  if (currentScroll <= 0) {
    header.classList.remove('navbar-hidden');
    logo.classList.remove('hidden');
  }
  // Scrolling down
  else if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
    header.classList.add('navbar-hidden');
    logo.classList.add('hidden'); // Logo juga hilang saat scroll down
  }
  // Scrolling up
  else if (currentScroll < lastScrollTop) {
    header.classList.remove('navbar-hidden');
    logo.classList.remove('hidden'); // Logo muncul kembali
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
}, false);

// Merchandise data
const merchandiseItems = [
  { 
    id: 1, 
    name: "Impactora's Tumbler", 
    price: 150000, 
    description: "Premium stainless steel tumbler dengan desain Elang Jawa eksklusif"
  },
  { 
    id: 2, 
    name: "Impactora's Keychain", 
    price: 50000,
    description: "Gantungan kunci metal berkualitas tinggi dengan logo Elang Jawa"
  },
  { 
    id: 3, 
    name: "Impactora's Adventure T-Shirt", 
    price: 200000,
    description: "Kaos katun combed 30s dengan desain Tora dan Elang Jawa"
  }
];

// Buy item functionality - Direct purchase with Xendit
function buyItem(itemId) {
  const modal = document.getElementById('checkout-modal');
  const item = merchandiseItems.find(m => m.id === itemId);

  if (!item) return;

  modal.style.display = 'block';
  modal.dataset.itemId = itemId;

  // Update modal title
  const modalTitle = modal.querySelector('h2');
  if (modalTitle) {
    modalTitle.innerHTML = `<i class="fas fa-shopping-bag"></i> Checkout - ${item.name}`;
  }
}

// Close modal
const modal = document.getElementById('checkout-modal');
const closeBtn = document.querySelector('.close');

if (closeBtn) {
  closeBtn.onclick = function() {
    modal.style.display = 'none';
  };
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

// Handle checkout form with Xendit
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const itemId = parseInt(modal.dataset.itemId);

    const selectedItem = merchandiseItems.find(item => item.id === itemId);

    if (!selectedItem) {
      alert('Item tidak ditemukan');
      return;
    }

    // Show loading state
    const submitBtn = checkoutForm.querySelector('.pay-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [selectedItem],
          customer: {
            name: name,
            email: email,
            phone: phone,
            address: address
          }
        })
      });

      const result = await response.json();

      if (result.invoiceUrl) {
        // Redirect to Xendit payment page
        window.location.href = result.invoiceUrl;
      } else if (result.message) {
        // For testing without Xendit
        alert(result.message);
        modal.style.display = 'none';
        checkoutForm.reset();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Contact form
function openContactForm() {
  const email = 'info@impactora-indonesia.org';
  const subject = 'Pertanyaan tentang Impactora Indonesia';
  const body = 'Halo Impactora Indonesia,%0D%0A%0D%0ASaya ingin bertanya tentang...';

  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}

// Smooth scroll to top when clicking logo
const headerLogo = document.querySelector('.header-logo');
if (headerLogo) {
  headerLogo.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Language translations
const translations = {
  id: {
    'nav.home': 'Beranda',
    'nav.about': 'Tentang Elang Jawa',
    'nav.threats': 'Ancaman',
    'nav.locations': 'Lokasi',
    'nav.impactora': 'Impactora',
    'nav.merchandise': 'Merchandise',
    'hero.title': 'Elang Jawa',
    'hero.subtitle': 'Nisaetus bartelsi',
    'hero.description': 'Simbol kebanggaan Indonesia yang terancam punah',
    'hero.cta': 'Pelajari Lebih Lanjut',
    'about.title': 'Apa itu Elang Jawa?',
    'about.description1': 'Elang Jawa (Nisaetus bartelsi) adalah burung pemangsa endemik Pulau Jawa yang menjadi maskot fauna Indonesia. Burung megah ini merupakan simbol kebanggaan nasional dan lambang kekuatan dalam budaya Indonesia.',
    'about.description2': 'Pertama kali dideskripsikan oleh ahli burung Belanda, Dr. Salomon Müller pada tahun 1924, Elang Jawa telah menjadi ikon konservasi satwa liar Indonesia. Keberadaannya yang terbatas hanya di Pulau Jawa menjadikannya salah satu spesies burung paling langka di dunia.',
    'about.description3': 'Sebagai predator puncak di ekosistem hutan Jawa, Elang Jawa memainkan peran vital dalam menjaga keseimbangan alam dengan mengendalikan populasi hewan-hewan kecil seperti tikus, tupai, dan burung-burung kecil.',
    'about.caption': 'Elang Jawa dewasa dengan jambul khas',
    'characteristics.title': 'Keunikan & Karakteristik',
    'characteristics.body': 'Panjang tubuh 60-70 cm dengan rentang sayap mencapai 110-130 cm. Berat tubuh 1,2-1,8 kg.',
    'characteristics.crest': 'Jambul Khas',
    'characteristics.crest_desc': 'Memiliki jambul tegak di kepala yang menjadi ciri khas utama, terutama saat merasa terancam atau bersemangat.',
    'characteristics.color': 'Warna Bulu',
    'characteristics.color_desc': 'Bulu cokelat kemerahan di bagian atas, putih dengan garis-garis cokelat di bagian bawah, dan ekor bergaris-garis.',
    'characteristics.vision': 'Penglihatan Tajam',
    'characteristics.vision_desc': 'Mata kuning cerah dengan penglihatan 8x lebih tajam dari manusia untuk berburu mangsa dari ketinggian.',
    'characteristics.call': 'Suara Khas',
    'characteristics.call_desc': 'Memiliki panggilan keras "klii-iiw" yang dapat terdengar hingga jarak 1 km di hutan.',
    'characteristics.habitat': 'Habitat',
    'characteristics.habitat_desc': 'Hidup di hutan primer dan sekunder pada ketinggian 300-3000 mdpl di seluruh Pulau Jawa.',
    'threats.title': 'Mengapa Elang Jawa Terancam Punah?',
    'threats.intro': 'Populasi Elang Jawa diperkirakan hanya tersisa 300-500 ekor di alam liar. Status konservasi: <strong>Endangered (Terancam Punah)</strong> menurut IUCN Red List.',
    'threats.deforestation': 'Deforestasi',
    'threats.deforestation_desc': 'Kehilangan habitat akibat pembukaan lahan untuk pertanian, perkebunan, dan pemukiman. Lebih dari 70% hutan Jawa telah hilang dalam 100 tahun terakhir.',
    'threats.poaching': 'Perburuan Liar',
    'threats.poaching_desc': 'Perburuan untuk diperdagangkan sebagai hewan peliharaan ilegal atau untuk bagian tubuhnya yang dianggap memiliki nilai mistis. Harga satu ekor di pasar gelap bisa mencapai puluhan juta rupiah.',
    'threats.poison': 'Racun & Perangkap',
    'threats.poison_desc': 'Penggunaan pestisida dan racun tikus yang mencemari rantai makanan, serta pemasangan perangkap yang tidak sengaja menangkap elang.',
    'threats.powerlines': 'Kabel Listrik',
    'threats.powerlines_desc': 'Banyak elang mati tersengat listrik atau bertabrakan dengan kabel transmisi dan menara telekomunikasi.',
    'threats.alert': 'Fakta Mengkhawatirkan: Jika tidak ada upaya konservasi serius, Elang Jawa diprediksi akan punah dalam 50 tahun ke depan!',
    'facts.title': 'Fun Facts Elang Jawa',
    'facts.garuda': 'Lambang Garuda',
    'facts.garuda_desc': 'Elang Jawa menjadi inspirasi utama desain Garuda Pancasila, lambang negara Indonesia.',
    'facts.monogamy': 'Monogami Setia',
    'facts.monogamy_desc': 'Pasangan Elang Jawa setia seumur hidup dan berburu bersama untuk memberi makan anak-anaknya.',
    'facts.nest': 'Sarang Megah',
    'facts.nest_desc': 'Membangun sarang berdiameter hingga 1,5 meter di pohon tertinggi dan digunakan bertahun-tahun.',
    'facts.flight': 'Terbang Tinggi',
    'facts.flight_desc': 'Dapat terbang hingga ketinggian 3000 meter di atas permukaan laut dengan kecepatan 80 km/jam.',
    'facts.longevity': 'Usia Panjang',
    'facts.longevity_desc': 'Di alam liar dapat hidup hingga 20-30 tahun, di penangkaran bisa mencapai 40 tahun.',
    'facts.endemic': 'Hanya di Jawa',
    'facts.endemic_desc': 'Satu-satunya tempat di dunia dimana Elang Jawa dapat ditemukan adalah Pulau Jawa, Indonesia.',
    'locations.title': 'Dimana Menemukan Elang Jawa?',
    'locations.intro': 'Berikut adalah lokasi-lokasi terbaik untuk melihat Elang Jawa di habitat aslinya:',
    'locations.loji': 'Suaka Elang Jawa Loji',
    'locations.loji_desc': 'Pusat konservasi dan penelitian Elang Jawa terbesar di Indonesia. Tempat terbaik untuk melihat elang dari dekat dan belajar tentang upaya pelestariannya.',
    'locations.halimun': 'Taman Nasional Gunung Halimun Salak',
    'locations.halimun_desc': 'Salah satu habitat alami terbesar Elang Jawa dengan hutan hujan tropis yang masih terjaga. Populasi elang cukup stabil di kawasan ini.',
    'locations.gede': 'Taman Nasional Gunung Gede Pangrango',
    'locations.gede_desc': 'Kawasan konservasi dengan ekosistem lengkap dari hutan hujan hingga hutan pegunungan, menjadi rumah bagi berbagai satwa termasuk Elang Jawa.',
    'locations.note': 'Catatan Penting: Selalu ikuti aturan kawasan konservasi, jangan memberi makan atau mengganggu satwa liar, dan gunakan jasa pemandu lokal yang berpengalaman.',
    'impactora.title': 'Tentang Impactora Indonesia',
    'impactora.description': 'Impactora Indonesia adalah organisasi non-profit yang berdedikasi untuk pelestarian Elang Jawa dan habitatnya. Kami percaya bahwa melalui edukasi, penelitian, dan aksi nyata, kita dapat menyelamatkan spesies ikonik ini dari kepunahan.',
    'impactora.mission': 'Misi Kami',
    'impactora.mission1': 'Melindungi dan melestarikan populasi Elang Jawa di alam liar',
    'impactora.mission2': 'Mengedukasi masyarakat tentang pentingnya konservasi',
    'impactora.mission3': 'Melakukan penelitian untuk mendukung upaya pelestarian',
    'impactora.mission4': 'Bekerja sama dengan komunitas lokal dan pemerintah',
    'impactora.vision': 'Visi Kami',
    'impactora.vision_desc': 'Mewujudkan Indonesia dimana Elang Jawa dan satwa liar lainnya dapat hidup berkelanjutan di habitat alaminya, dengan masyarakat yang peduli dan aktif dalam pelestarian alam.',
    'founders.title': 'Tim Pendiri Kami',
    'founders.budi': 'Dr. Budi Santoso',
    'founders.budi_role': 'Founder & CEO',
    'founders.budi_bio': 'Ahli ornitologi dengan 15 tahun pengalaman dalam konservasi burung pemangsa Indonesia.',
    'founders.siti': 'Siti Nurhaliza, M.Si',
    'founders.siti_role': 'Co-Founder & Director of Research',
    'founders.siti_bio': 'Peneliti ekologi dengan fokus pada habitat dan perilaku Elang Jawa di alam liar.',
    'founders.ahmad': 'Ahmad Hidayat',
    'founders.ahmad_role': 'Co-Founder & Community Outreach Manager',
    'founders.ahmad_bio': 'Aktivis lingkungan yang berpengalaman dalam program edukasi dan pemberdayaan masyarakat.',
    'mascot.title': 'Kenalan dengan Tora!',
    'mascot.name': 'Tora - Maskot Impactora Indonesia',
    'mascot.description1': 'Tora adalah Elang Jawa muda yang ceria dan penuh semangat! Namanya diambil dari kata "Impac<strong>TORA</strong>".',
    'mascot.description2': 'Dengan jambul khasnya yang selalu tegak dan mata yang berbinar, Tora menjadi simbol harapan untuk masa depan Elang Jawa. Ia mengajak semua orang, terutama generasi muda, untuk peduli dan ikut menjaga kelestarian alam Indonesia.',
    'mascot.friendly': 'Ramah & Ceria',
    'mascot.nature': 'Pecinta Alam',
    'mascot.learning': 'Suka Belajar',
    'mascot.quote': '"Ayo jaga hutan kita bersama-sama! Karena hutan yang sehat = Elang Jawa yang bahagia!" - Tora',
    'merch.title': 'Merchandise Impactora',
    'merch.intro': 'Dukung pelestarian Elang Jawa dengan membeli merchandise kami. 100% keuntungan untuk program konservasi!',
    'merch.tumbler': "Impactora's Tumbler",
    'merch.tumbler_desc': 'Tumbler stainless steel premium dengan desain Elang Jawa eksklusif. Tahan panas & dingin hingga 12 jam.',
    'merch.keychain': "Impactora's Keychain",
    'merch.keychain_desc': 'Gantungan kunci metal berkualitas tinggi dengan logo Elang Jawa. Cocok untuk kado atau koleksi pribadi.',
    'merch.tshirt': "Impactora's Adventure T-Shirt",
    'merch.tshirt_desc': 'Kaos katun combed 30s dengan desain Tora dan Elang Jawa. Nyaman untuk petualangan outdoor!',
    'merch.buy': 'Beli Sekarang',
    'cta.title': 'Mari Jaga Alam Kita Bersama!',
    'cta.description': 'Setiap tindakan kecil kita berdampak besar untuk masa depan Elang Jawa dan keanekaragaman hayati Indonesia.',
    'cta.donate': 'Donasi',
    'cta.donate_desc': 'Dukung program konservasi kami',
    'cta.volunteer': 'Volunteer',
    'cta.volunteer_desc': 'Bergabung sebagai relawan',
    'cta.share': 'Sebarkan',
    'cta.share_desc': 'Bagikan informasi ini',
    'cta.contact': 'Hubungi Kami',
    'footer.about': 'Bersama melestarikan Elang Jawa untuk generasi mendatang.',
    'footer.contact': 'Kontak'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About Javan Hawk-Eagle',
    'nav.threats': 'Threats',
    'nav.locations': 'Locations',
    'nav.impactora': 'Impactora',
    'nav.merchandise': 'Merchandise',
    'hero.title': 'Javan Hawk-Eagle',
    'hero.subtitle': 'Nisaetus bartelsi',
    'hero.description': 'A symbol of Indonesian pride facing extinction',
    'hero.cta': 'Learn More',
    'about.title': 'What is the Javan Hawk-Eagle?',
    'about.description1': 'The Javan Hawk-Eagle (Nisaetus bartelsi) is an endemic raptor of Java Island that serves as Indonesia\'s fauna mascot. This magnificent bird is a symbol of national pride and strength in Indonesian culture.',
    'about.description2': 'First described by Dutch ornithologist Dr. Salomon Müller in 1924, the Javan Hawk-Eagle has become an icon of Indonesian wildlife conservation. Its limited presence only on Java Island makes it one of the rarest bird species in the world.',
    'about.description3': 'As a top predator in Java\'s forest ecosystem, the Javan Hawk-Eagle plays a vital role in maintaining ecological balance by controlling populations of small animals such as rats, squirrels, and small birds.',
    'about.caption': 'Adult Javan Hawk-Eagle with characteristic crest',
    'characteristics.title': 'Unique Features & Characteristics',
    'characteristics.body': 'Body length 60-70 cm with wingspan reaching 110-130 cm. Body weight 1.2-1.8 kg.',
    'characteristics.crest': 'Characteristic Crest',
    'characteristics.crest_desc': 'Has an erect crest on the head that is the main distinguishing feature, especially when feeling threatened or excited.',
    'characteristics.color': 'Feather Color',
    'characteristics.color_desc': 'Reddish-brown feathers on top, white with brown stripes on bottom, and striped tail.',
    'characteristics.vision': 'Sharp Vision',
    'characteristics.vision_desc': 'Bright yellow eyes with 8x sharper vision than humans for hunting prey from heights.',
    'characteristics.call': 'Characteristic Call',
    'characteristics.call_desc': 'Has a loud call "klii-iiw" that can be heard up to 1 km away in the forest.',
    'characteristics.habitat': 'Habitat',
    'characteristics.habitat_desc': 'Lives in primary and secondary forests at altitudes of 300-3000 meters above sea level throughout Java Island.',
    'threats.title': 'Why is the Javan Hawk-Eagle Endangered?',
    'threats.intro': 'The Javan Hawk-Eagle population is estimated to be only 300-500 individuals left in the wild. Conservation status: <strong>Endangered</strong> according to IUCN Red List.',
    'threats.deforestation': 'Deforestation',
    'threats.deforestation_desc': 'Habitat loss due to land clearing for agriculture, plantations, and settlements. More than 70% of Java\'s forests have been lost in the last 100 years.',
    'threats.poaching': 'Illegal Hunting',
    'threats.poaching_desc': 'Hunting for illegal trade as pets or for body parts considered mystical. The price of one individual in the black market can reach tens of millions of rupiah.',
    'threats.poison': 'Poison & Traps',
    'threats.poison_desc': 'Use of pesticides and rat poison that contaminate the food chain, as well as traps that accidentally catch eagles.',
    'threats.powerlines': 'Power Lines',
    'threats.powerlines_desc': 'Many eagles die from electric shock or collision with transmission cables and telecommunication towers.',
    'threats.alert': 'Disturbing Fact: If there are no serious conservation efforts, the Javan Hawk-Eagle is predicted to become extinct within 50 years!',
    'facts.title': 'Fun Facts about Javan Hawk-Eagle',
    'facts.garuda': 'Garuda Symbol',
    'facts.garuda_desc': 'The Javan Hawk-Eagle became the main inspiration for the design of Garuda Pancasila, Indonesia\'s state symbol.',
    'facts.monogamy': 'Faithful Monogamy',
    'facts.monogamy_desc': 'Javan Hawk-Eagle pairs are faithful for life and hunt together to feed their young.',
    'facts.nest': 'Magnificent Nest',
    'facts.nest_desc': 'Builds nests up to 1.5 meters in diameter in the tallest trees and uses them for many years.',
    'facts.flight': 'High Flight',
    'facts.flight_desc': 'Can fly up to 3000 meters above sea level at speeds of 80 km/h.',
    'facts.longevity': 'Long Lifespan',
    'facts.longevity_desc': 'Can live up to 20-30 years in the wild, up to 40 years in captivity.',
    'facts.endemic': 'Only in Java',
    'facts.endemic_desc': 'The only place in the world where the Javan Hawk-Eagle can be found is Java Island, Indonesia.',
    'locations.title': 'Where to Find Javan Hawk-Eagle?',
    'locations.intro': 'Here are the best locations to see Javan Hawk-Eagle in their natural habitat:',
    'locations.loji': 'Loji Javan Hawk-Eagle Sanctuary',
    'locations.loji_desc': 'The largest conservation and research center for Javan Hawk-Eagle in Indonesia. The best place to see eagles up close and learn about their conservation efforts.',
    'locations.halimun': 'Gunung Halimun Salak National Park',
    'locations.halimun_desc': 'One of the largest natural habitats for Javan Hawk-Eagle with still-preserved tropical rainforests. The eagle population is quite stable in this area.',
    'locations.gede': 'Gunung Gede Pangrango National Park',
    'locations.gede_desc': 'A conservation area with a complete ecosystem from rainforests to mountain forests, home to various wildlife including the Javan Hawk-Eagle.',
    'locations.note': 'Important Note: Always follow conservation area rules, do not feed or disturb wildlife, and use the services of experienced local guides.',
    'impactora.title': 'About Impactora Indonesia',
    'impactora.description': 'Impactora Indonesia is a non-profit organization dedicated to the conservation of the Javan Hawk-Eagle and its habitat. We believe that through education, research, and real action, we can save this iconic species from extinction.',
    'impactora.mission': 'Our Mission',
    'impactora.mission1': 'Protect and conserve Javan Hawk-Eagle populations in the wild',
    'impactora.mission2': 'Educate the community about the importance of conservation',
    'impactora.mission3': 'Conduct research to support conservation efforts',
    'impactora.mission4': 'Work together with local communities and government',
    'impactora.vision': 'Our Vision',
    'impactora.vision_desc': 'Realize Indonesia where Javan Hawk-Eagle and other wildlife can live sustainably in their natural habitats, with a caring and active community in nature conservation.',
    'founders.title': 'Our Founding Team',
    'founders.eski': 'Eskisan Oktri Femista',
    'founders.eski_role': 'Public Relation',
    'founders.eski_bio': 'Opening opportunities for information and cooperation with other parties.',
    'founders.nadya': 'Nadya Fayza Aulia',
    'founders.nadya_role': 'Design & Management',
    'founders.nadya_bio': 'Creating attractive designs to be used as educational and informational media.',
    'founders.nadine': 'Nadine Kirana Saraswati',
    'founders.nadine_role': 'Social Media & Marketing',
    'founders.nadine_bio': 'Managing social media accounts and providing marketing and promotion strategy ideas.',
    'founders.bintang': 'Bintang Alif Putra Satriya',
    'founders.bintang_role': 'Strategic Partnership',
    'founders.bintang_bio': 'Responsible for cooperation projects with related parties.',
    'mascot.title': 'Meet Tora!',
    'mascot.name': 'Tora - Impactora Indonesia Mascot',
    'mascot.description1': 'Tora is a cheerful and spirited young Javan Hawk-Eagle! His name is taken from the word "Impac<strong>TORA</strong>".',
    'mascot.description2': 'With his characteristic crest always erect and sparkling eyes, Tora becomes a symbol of hope for the future of the Javan Hawk-Eagle. He invites everyone, especially the younger generation, to care and help preserve Indonesia\'s nature.',
    'mascot.friendly': 'Friendly & Cheerful',
    'mascot.nature': 'Nature Lover',
    'mascot.learning': 'Loves Learning',
    'mascot.quote': '"Let\'s protect our forests together! Because healthy forests = Happy Javan Hawk-Eagles!" - Tora',
    'merch.title': 'Impactora Merchandise',
    'merch.intro': 'Support Javan Hawk-Eagle conservation by buying our merchandise. 100% profit for conservation programs!',
    'merch.tumbler': "Impactora's Tumbler",
    'merch.tumbler_desc': 'Premium stainless steel tumbler with exclusive Javan Hawk-Eagle design. Keeps hot & cold up to 12 hours.',
    'merch.keychain': "Impactora's Keychain",
    'merch.keychain_desc': 'High-quality metal keychain with Javan Hawk-Eagle logo. Suitable for gifts or personal collection.',
    'merch.tshirt': "Impactora's Adventure T-Shirt",
    'merch.tshirt_desc': '30s combed cotton t-shirt with Tora and Javan Hawk-Eagle design. Comfortable for outdoor adventures!',
    'merch.buy': 'Buy Now',
    'cta.title': 'Let\'s Protect Our Nature Together!',
    'cta.description': 'Every small action we take has a big impact on the future of the Javan Hawk-Eagle and Indonesia\'s biodiversity.',
    'cta.donate': 'Donate',
    'cta.donate_desc': 'Support our conservation programs',
    'cta.volunteer': 'Volunteer',
    'cta.volunteer_desc': 'Join as a volunteer',
    'cta.share': 'Share',
    'cta.share_desc': 'Share this information',
    'cta.contact': 'Contact Us',
    'footer.about': 'Together preserving the Javan Hawk-Eagle for future generations.',
    'footer.contact': 'Contact',
    'partnership.title': 'Our Partnership',
    'partnership.description': 'Impactora Indonesia collaborates with various parties to preserve the Javan Hawk-Eagle and its habitat.',
    'partnership.ksdae': 'KSDAE',
    'partnership.ksdae_desc': 'Conservation of Natural Resources and Ecosystems',
    'partnership.pssej': 'PSSEJ',
    'partnership.pssej_desc': 'Center for Javan Hawk-Eagle Studies'
  }
};

// Current language
let currentLang = localStorage.getItem('language') || 'id';

// Language switch function
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('language', lang);

  // Update HTML lang attribute
  document.documentElement.lang = lang;

  // Update all elements with data-lang-key
  document.querySelectorAll('[data-lang-key]').forEach(element => {
    const key = element.getAttribute('data-lang-key');
    if (translations[lang] && translations[lang][key]) {
      if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = translations[lang][key];
      } else {
        element.innerHTML = translations[lang][key];
      }
    }
  });

  // Update language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set initial language
  switchLanguage(currentLang);

  // Language switcher event listeners
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      switchLanguage(lang);
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections for animation
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});
