// Public Customer Storefront Logic, Marathi Translation & Theme Switcher for Gajanan Traders

let currentLang = localStorage.getItem('gt_lang') || 'en';
let currentTheme = localStorage.getItem('gt_theme') || 'theme-blue';

const i18n = {
  en: {
    brandSub: "Authorised Dealer of Tata Shaktee & All Types Fabrication Items",
    navProducts: "Products",
    navOwner: "About Owner",
    navMfg: "Custom Manufacturing",
    navCalc: "Sheet Calculator",
    navEst: "Get Estimate",
    navLoc: "Contact & Location",
    waBtn: "WhatsApp",
    callBtn: "Call Shop",
    heroBadge: "Authorised Dealer & Fabrication Items",
    heroTitle: "Roofing Sheets & Steel Items",
    heroSubtitle: "TATA Shaktee Authorised Dealer",
    heroDesc: "Authorised dealer for TATA Shaktee. Roofing Sheets (AM/NS, JINDAL Panther, JINDAL Sabrang, TATA PRISMA, TATA BLUSCOPE), MS Pipe, MS Angle, MS Channels, Mangalam Welding Rod, Chain Link Jali, Weld Mesh Jali, Screws, Cutting Wheels & All Types Fabrication Items. Naigaon Bz, Nanded.",
    heroCalcBtn: "Calculate Sheet Requirement",
    heroWaBtn: "Instant WhatsApp Quote",
    heroLocBtn: "Open Location",
    quickInqTitle: "Quick Material Inquiry",
    lblBrand: "Select Brand / Item",
    lblColor: "Color Required",
    lblThickness: "Thickness (mm)",
    lblMobile: "Your Mobile Number",
    sendWaReq: "Send WhatsApp Price Request",
    productsTitle: "Our Complete Product Range",
    productsDesc: "Roofing Sheets, MS Pipe, MS Angle, Welding Rod, Jali, Screws & All Types Fabrication Items available at our Naigaon shop.",
    meetOwnerBadge: "Meet The Owner",
    ownerHeadline: "Leadership Dedicated to Quality Steel & Customer Trust",
    ownerWelcome: '"Welcome to Gajanan Traders! I am Mr. Pankaj Medewar, proprietor of Gajanan Traders in Naigaon Bz."',
    ownerBio1: "For years, our shop near Uddhav Nagri has served contractors, farmers, residential homeowners, and commercial builders across Naigaon, Nanded, Umri, Degloor, and Biloli. As authorized dealers for TATA Shaktee, we take pride in delivering 100% genuine, high-strength roofing sheets along with MS Pipe, MS Angle, Welding Rod and all types of fabrication items.",
    ownerBio2: "Our shop provides a complete range of steel and construction materials including roofing sheets from multiple brands, MS Pipe, MS Angle, MS Channels, Mangalam Welding Rods, Chain Link Jali, Weld Mesh Jali, Screws, Cutting Wheels and all types of fabrication items.",
    calcTitle: "Roofing Sheet Requirement Calculator",
    calcSub: "Select your roof specs to get instant total square footage and estimate.",
    enqTitle: "Submit Online Order Enquiry",
    locTitle: "Gajanan Traders - Location",
    locBtn: "Get Location (Gajanan Traders on Google Maps)"
  },
  mr: {
    brandSub: "पत्रा उत्पादन व अधिकृत डीलर",
    navProducts: "उत्पादने (Products)",
    navOwner: "मालकांबद्दल (About Owner)",
    navMfg: "कस्टम निर्मिती",
    navCalc: "पत्रा कॅल्क्युलेटर",
    navEst: "अंदाजपत्रक मिळवा",
    navLoc: "पत्ता व संपर्क",
    waBtn: "व्हॉट्सॲप",
    callBtn: "फोन करा",
    heroBadge: "थेट पत्रा निर्मिती व अधिकृत डीलरशिप",
    heroTitle: "उत्कृष्ट दर्जाचे रूफिंग पत्रे",
    heroSubtitle: "तुमच्या पसंतीचा रंग व लागणारी अचूक लांबी",
    heroDesc: "टाटा शक्ती (TATA Shaktee), जेएसडब्ल्यू प्रगती (JSW Pragati) आणि जिंदल स्टीलचे अधिकृत विक्रेते. नायगाव बझार, नांदेड येथे तुमच्या गरजेनुसार रंगाचे व लांबीचे पत्रे थेट कारखान्यातून तयार करून मिळतील.",
    heroCalcBtn: "पत्र्याची मोजणी करा",
    heroWaBtn: "व्हॉट्सॲपवर दर मागवा",
    heroLocBtn: "गूगल मॅपवर पत्ता पाहा",
    quickInqTitle: "त्वरित माहिती मागवा",
    lblBrand: "कंपनी निवडा",
    lblColor: "पसंतीचा रंग",
    lblThickness: "जाडी (mm)",
    lblMobile: "तुमचा मोबाईल नंबर",
    sendWaReq: "व्हॉट्सॲपवर दरपत्रक मिळवा",
    productsTitle: "अधिकृत रूफिंग पत्रे व ॲक्सेसरीज",
    productsDesc: "नायगाव दुकानात ready stock उपलब्ध तसेच ऑर्डरनुसार कटिंग करून मिळेल.",
    meetOwnerBadge: "दुकानाच्या मालकांबद्दल",
    ownerHeadline: "दर्जेदार पोलाद व ग्राहकांचा विश्वास",
    ownerWelcome: '"गजानन ट्रेडर्समध्ये आपले सहर्ष स्वागत! मी श्री. पंकज मेदेवार, गजानन ट्रेडर्स नायगाव बझारचा प्रोप्रायटर."',
    ownerBio1: "उद्धव नगरी जवळ, नांदेड रोड नायगाव बझार येथे आमचे दुकान असून नायगाव, नांदेड, उमरी, देगलूर, बिलोली व कंधार परिसरातील ग्राहक व कॉन्ट्रॅक्टर्ससाठी आम्ही टाटा शक्ती, JSW प्रगती आणि जिंदल स्टीलचे १००% अस्सल पत्रे पुरवतो.",
    ownerBio2: "आमच्या कारखान्यात स्वयंचलित रोल फॉर्मिंग मशीनद्वारे तुमच्या शेडच्या मापानुसार लांबी व आवडीचा रंग (Royal Blue, Tile Red, Mint Green इ.) देऊन पत्रा तयार करून दिला जातो, ज्यामुळे वेस्टेज वाचून पैशांची बचत होते.",
    calcTitle: "पत्रा आवश्यकतेचे कॅल्क्युलेटर",
    calcSub: "तुमच्या छताचे माप टाकून त्वरित एकूण स्क्वेअर फूट आणि अंदाजे किंमत पाहा.",
    enqTitle: "ऑनलाईन ऑर्डर चौकशी अर्ज",
    locTitle: "गजानन ट्रेडर्स - पत्ता व लोकेशन",
    locBtn: "गूगल मॅपवर गजानन ट्रेडर्सचे लोकेशन पाहा"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLanguage(currentLang);
  loadPublicProducts();
  setupCalculator();
  setupPublicEnquiryForm();
  setupHeroForm();
});

// Language Switcher Function
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('gt_lang', lang);
  applyLanguage(lang);
}

function applyLanguage(lang) {
  const dict = i18n[lang] || i18n.en;

  const mapping = {
    'txtBrandSub': dict.brandSub,
    'txtNavProducts': dict.navProducts,
    'txtNavOwner': dict.navOwner,
    'txtNavMfg': dict.navMfg,
    'txtNavCalc': dict.navCalc,
    'txtNavEst': dict.navEst,
    'txtNavLoc': dict.navLoc,
    'txtWaBtn': dict.waBtn,
    'txtCallBtn': dict.callBtn,
    'txtHeroBadge': dict.heroBadge,
    'txtHeroTitle': dict.heroTitle,
    'txtHeroSubtitle': dict.heroSubtitle,
    'txtHeroDesc': dict.heroDesc,
    'txtHeroCalcBtn': dict.heroCalcBtn,
    'txtHeroWaBtn': dict.heroWaBtn,
    'txtHeroLocBtn': dict.heroLocBtn,
    'txtQuickInqTitle': dict.quickInqTitle,
    'lblBrand': dict.lblBrand,
    'lblColor': dict.lblColor,
    'lblThickness': dict.lblThickness,
    'lblMobile': dict.lblMobile,
    'txtSendWaReq': dict.sendWaReq,
    'txtProductsTitle': dict.productsTitle,
    'txtProductsDesc': dict.productsDesc,
    'txtMeetOwnerBadge': dict.meetOwnerBadge,
    'txtOwnerHeadline': dict.ownerHeadline,
    'txtOwnerWelcome': dict.ownerWelcome,
    'txtOwnerBio1': dict.ownerBio1,
    'txtOwnerBio2': dict.ownerBio2,
    'txtCalcTitle': dict.calcTitle,
    'txtCalcSub': dict.calcSub,
    'txtEnqTitle': dict.enqTitle,
    'txtLocTitle': dict.locTitle,
    'txtLocBtn': dict.locBtn
  };

  for (const [id, text] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'txtOwnerWelcome') {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  }

  // Update button active state
  const btnEn = document.getElementById('langBtnEn');
  const btnMr = document.getElementById('langBtnMr');
  if (btnEn && btnMr) {
    if (lang === 'en') {
      btnEn.className = 'px-2.5 py-1 rounded-md text-[11px] font-bold transition bg-blue-700 text-white';
      btnMr.className = 'px-2.5 py-1 rounded-md text-[11px] font-bold transition text-slate-300 hover:text-white';
    } else {
      btnMr.className = 'px-2.5 py-1 rounded-md text-[11px] font-bold transition bg-emerald-600 text-white';
      btnEn.className = 'px-2.5 py-1 rounded-md text-[11px] font-bold transition text-slate-300 hover:text-white';
    }
  }
}

// Color Theme Switcher Function
function switchTheme(themeName) {
  currentTheme = themeName;
  localStorage.setItem('gt_theme', themeName);
  applyTheme(themeName);
}

function applyTheme(themeName) {
  document.body.classList.remove('theme-blue', 'theme-emerald', 'theme-red', 'theme-dark');
  document.body.classList.add(themeName);
}

// Fetch and display product catalog
async function loadPublicProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  try {
    const res = await fetch('/api/products');
    const products = await res.json();

    if (!products || products.length === 0) {
      grid.innerHTML = `<p class="col-span-3 text-center text-slate-500 py-8">No products available at the moment.</p>`;
      return;
    }

    grid.innerHTML = products.map(p => {
      const rate = p.ratePerUnit || p.ratePerSqFt || 0;
      const hasSheetSpecs = p.sheetSize || p.sheetWeight;
      const hasThickness = p.thicknessOptions && p.thicknessOptions.length > 0;
      const hasColors = p.colors && p.colors.length > 0;
      
      return `
      <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition flex flex-col justify-between">
        <div class="p-5 flex-grow flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-2">
              <span class="bg-blue-50 text-blue-800 text-[11px] font-black px-2.5 py-1 rounded-md border border-blue-100 uppercase">${p.brand}</span>
              <span class="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">${p.stockStatus || 'In Stock'}</span>
            </div>
            
            <h3 class="font-extrabold text-slate-900 text-base mb-2">${p.name}</h3>
            <p class="text-xs text-slate-600 mb-3 leading-relaxed line-clamp-2">${p.description}</p>
            
            <div class="bg-slate-50 p-2.5 rounded-xl space-y-1 text-xs mb-4">
              ${hasThickness ? `<div class="flex justify-between"><span class="text-slate-500">Thickness:</span> <span class="font-semibold text-slate-800">${p.thicknessOptions.join(', ')}</span></div>` : ''}
              ${hasColors ? `<div class="flex justify-between"><span class="text-slate-500">Colors:</span> <span class="font-semibold text-slate-800">${p.colors.join(', ')}</span></div>` : ''}
              ${hasSheetSpecs ? `<div class="flex justify-between"><span class="text-slate-500">Sheet Size:</span> <span class="font-semibold text-slate-800">${p.sheetSize || '-'}</span></div>` : ''}
              ${hasSheetSpecs ? `<div class="flex justify-between"><span class="text-slate-500">Weight:</span> <span class="font-semibold text-slate-800">${p.sheetWeight || '-'}</span></div>` : ''}
              <div class="flex justify-between"><span class="text-slate-500">Category:</span> <span class="font-semibold text-slate-800">${p.category || '-'}</span></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-baseline pt-3 border-t border-slate-100 mb-3">
              <span class="text-xs text-slate-500">Rate:</span>
              <span class="text-xl font-black text-slate-900">${rate > 0 ? '₹' + rate : 'Contact'} <span class="text-xs font-normal text-slate-500">/ ${p.unit}</span></span>
            </div>

            <a href="https://wa.me/919767228008?text=${encodeURIComponent(`Hi Gajanan Traders, I want to check stock and price for ${p.name}.`)}" target="_blank" class="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition">
              <i class="fa-brands fa-whatsapp text-sm"></i> ${currentLang === 'mr' ? 'व्हॉट्सॲपवर दर मागवा' : 'WhatsApp Price Quote'}
            </a>
          </div>
        </div>
      </div>
    `}).join('');

  } catch (err) {
    console.error('Error loading products:', err);
  }
}

// Live Roofing Sheet Calculator logic
function setupCalculator() {
  const brandSelect = document.getElementById('calcBrand');
  const lengthInput = document.getElementById('calcLength');
  const qtyInput = document.getElementById('calcQty');
  const thicknessSelect = document.getElementById('calcThickness');
  const colorSelect = document.getElementById('calcColor');
  const whatsappBtn = document.getElementById('calcWhatsAppBtn');

  if (!brandSelect || !lengthInput || !qtyInput) return;

  function calculate() {
    const selectedOption = brandSelect.options[brandSelect.selectedIndex];
    const rate = parseFloat(selectedOption.getAttribute('data-rate')) || 60;
    const length = parseFloat(lengthInput.value) || 0;
    const qty = parseInt(qtyInput.value) || 0;
    const width = 3.5; // Standard trapezoidal sheet coverage width

    const totalSqFt = length * width * qty;
    // Approx weight calculation: 0.45mm sheet is approx 3.8 kg / sq meter (~0.38 kg / sq ft)
    const approxWeightKg = Math.round(totalSqFt * 0.38);
    const baseCost = Math.round(totalSqFt * rate);
    const gstCost = Math.round(baseCost * 0.18);
    const grandTotal = baseCost + gstCost;

    document.getElementById('resTotalSqFt').textContent = `${totalSqFt.toFixed(1)} Sq Ft`;
    document.getElementById('resApproxWeight').textContent = `~${approxWeightKg} Kg`;
    document.getElementById('resBaseCost').textContent = `₹${baseCost.toLocaleString('en-IN')}`;
    document.getElementById('resGst').textContent = `₹${gstCost.toLocaleString('en-IN')}`;
    document.getElementById('resGrandTotal').textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  }

  [brandSelect, lengthInput, qtyInput, thicknessSelect, colorSelect].forEach(el => {
    if (el) el.addEventListener('input', calculate);
  });

  calculate();

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const brand = brandSelect.value;
      const length = lengthInput.value;
      const qty = qtyInput.value;
      const thickness = thicknessSelect.value;
      const color = colorSelect.value;
      const totalSqFt = document.getElementById('resTotalSqFt').textContent;
      const grandTotal = document.getElementById('resGrandTotal').textContent;

      const msg = `Hello Gajanan Traders (Naigaon), I calculated my roofing requirement:
- Brand: ${brand}
- Color: ${color}
- Thickness: ${thickness}
- Sheet Specs: ${qty} Sheets of ${length} Ft Length (Total ${totalSqFt})
- Estimated Amount: ${grandTotal}

Please confirm final stock availability and delivery rate to my site.`;

      window.open(`https://wa.me/919767228008?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
}

// Hero Quick Form logic
function setupHeroForm() {
  const form = document.getElementById('quickHeroForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const brand = document.getElementById('heroBrand').value;
    const color = document.getElementById('heroColor').value;
    const thickness = document.getElementById('heroThickness').value;
    const phone = document.getElementById('heroPhone').value;

    const msg = `Hi Gajanan Traders, my phone is ${phone}. I need a price quote for:
- Brand: ${brand}
- Color: ${color}
- Thickness: ${thickness}

Please send best price and delivery time for Naigaon location.`;

    window.open(`https://wa.me/919767228008?text=${encodeURIComponent(msg)}`, '_blank');
  });
}

// Public Online Enquiry submission
function setupPublicEnquiryForm() {
  const form = document.getElementById('publicEnquiryForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      customerName: document.getElementById('enqName').value.trim(),
      phone: document.getElementById('enqPhone').value.trim(),
      city: document.getElementById('enqCity').value.trim(),
      brandPreference: document.getElementById('enqBrand').value,
      message: document.getElementById('enqMessage').value.trim()
    };

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(currentLang === 'mr' ? 'धन्यवाद! तुमची ऑर्डर चौकशी गजानन ट्रेडर्स कडे प्राप्त झाली आहे. आमचे मॅनेजर तुमच्याशी संपर्क साधतील.' : 'Thank you! Your requirement has been submitted to Gajanan Traders. Our manager will contact you shortly.');
        form.reset();
      } else {
        alert(currentLang === 'mr' ? 'चौकशी पाठवता आली नाही. कृपया थेट +91 9767228008 वर कॉल करा.' : 'Failed to submit enquiry. Please call us directly at +91 9767228008.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again or WhatsApp +91 9767228008.');
    }
  });
}
