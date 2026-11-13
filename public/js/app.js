// Public Customer Storefront Logic, Bilingual (English / Marathi) Translation & Theme Switcher for Gajanan Traders

let currentLang = localStorage.getItem('gt_lang') || 'en';
let currentTheme = localStorage.getItem('gt_theme') || 'theme-blue';
let cachedProductsList = [];

const i18n = {
  en: {
    topAnnounceTitle: "Authorised Dealer:",
    topAnnounceText: "TATA Shaktee | MS Pipe | MS Angle | Mangalam Welding Rod | All Types Fabrication Items",
    themeLabel: "Theme:",
    topAdmin: "Admin Login",
    brandSub: "Authorised Dealer of Tata Shaktee & All Types Fabrication Items",
    navProducts: "Products",
    navAboutShop: "About Shop",
    navOwner: "About Owner",
    navMfg: "Custom Manufacturing",
    navLoc: "Contact & Location",
    waBtn: "WhatsApp",
    callBtn: "Call Shop",
    heroBadge: "Direct Manufacturer & Authorized Distributorship",
    heroTitle: "Premium Roofing Sheets",
    heroSubtitle: "Custom Colors & Exact Lengths",
    heroDesc: "Authorised dealer for TATA Shaktee. Roofing Sheets (AM/NS, JINDAL Panther, JINDAL Sabrang, TATA PRISMA, TATA BLUSCOPE), MS Pipe, MS Angle, MS Channels, Mangalam Welding Rod, Chain Link Jali, Weld Mesh Jali, Screws, Cutting Wheels & All Types Fabrication Items. Visit our shop in Naigaon Bz, Nanded.",
    heroWaBtn: "Instant WhatsApp Quote",
    heroLocBtn: "Open Location",
    heroStat1Num: "100%",
    heroStat1Label: "Genuine Authorized Steel",
    heroStat2Num: "Custom",
    heroStat2Label: "Color & Length Sizing",
    heroStat3Num: "431709",
    heroStat3Label: "Fast Naigaon Delivery",
    quickInqTitle: "Quick Material Inquiry",
    quickInqBadge: "Available Now",
    lblBrand: "Select Brand / Item",
    lblColor: "Color Required",
    lblThickness: "Thickness (mm)",
    lblMobile: "Your Mobile Number",
    sendWaReq: "Send WhatsApp Price Request",
    authBadgesHeader: "Authorised Distributorship & Manufacturing",
    authSub1: "Authorised Dealer",
    authSub2: "Panther & Sabrang Sheets",
    authSub3: "Welding Rod",
    authSub4: "MS Pipe, Angle, Jali & More",
    productsBadge: "Our Product Range",
    productsTitle: "Our Complete Product Range",
    productsDesc: "Roofing Sheets, MS Pipe, MS Angle, Welding Rod, Jali, Screws & All Types Fabrication Items available at our Naigaon shop.",
    ownerCardBadge: "Family-Owned Business",
    ownerCardFounder: "Mr. Prakash Medewar (Founder)",
    ownerCardOwner: "& Mr. Pankaj Medewar (Owner)",
    ownerCardSub: "Gajanan Traders • Over 35 Years of Trust",
    ownerCardBtn: "View Founder & Owner Profiles",
    meetOwnerBadge: "Meet The Owner",
    ownerHeadline: "Leadership Dedicated to <br><span class=\"text-blue-800\">Quality Steel & Customer Trust</span>",
    ownerWelcome: '"Welcome to Gajanan Traders! I am <strong class="text-slate-900">Mr. Pankaj Medewar</strong>, proprietor of Gajanan Traders in Naigaon Bz."',
    ownerBio1: "For years, our shop near Uddhav Nagri has served contractors, farmers, residential homeowners, and commercial builders across Naigaon, Nanded, Umri, Degloor, and Biloli. As authorized dealers for TATA Shaktee, we take pride in delivering 100% genuine, high-strength roofing sheets along with MS Pipe, MS Angle, Welding Rod and all types of fabrication items.",
    ownerBio2: "Our shop provides a complete range of steel and construction materials including roofing sheets from multiple brands, MS Pipe, MS Angle, MS Channels, Mangalam Welding Rods, Chain Link Jali, Weld Mesh Jali, Screws, Cutting Wheels and all types of fabrication items.",
    ownerFeat1: "Authorised TATA Shaktee Dealer",
    ownerFeat2: "Custom Length Cut & Sizing",
    ownerFeat3: "Fair & Transparent Rates",
    ownerFeat4: "Direct Site Delivery in Nanded District",
    ownerWaBtn: "Connect on WhatsApp",
    ownerCallBtn: "Call +91 9767228008",
    trustBadge: "35+ Years of Trust & Quality",
    trustHeading: "TRUST UP TO 35 YEARS",
    trustSub: "35 Years of Unbroken Trust • Gajanan Traders, Naigaon Bz",
    trustDesc: "Founded and led by <strong>Mr. Prakash Medewar</strong> (Consulting Member) and managed with his son <strong>Mr. Pankaj Medewar</strong>, Gajanan Traders is a trusted family-owned business with over <strong>35 years of experience</strong> in Naigaon Bz, Nanded. With a strong commitment to trust, quality, and customer satisfaction, we continue our legacy of reliable service.",
    trustShopBtn: "Explore Our Shop & Factory Photos",
    trustWaBtn: "Connect with Us",
    mfgBadge: "Factory Manufacturing",
    mfgTitle: "Custom Color & Length Sheet Manufacturing",
    mfgDesc: "Need a specific length to avoid wastage on your roof structure? Or matching color shade for architectural branding? At Gajanan Traders, our automated roll-forming machine manufactures precise lengths from 6 ft up to 30+ ft with customized color finishes.",
    mfgBullet1: "Custom colors: Royal Blue, Tile Red, Mint Green, Off-White & dual shades.",
    mfgBullet2: "Zero wastage: Custom length cut according to your shed purlin spacing.",
    mfgBullet3: "Tile Profile & Crimp Curved bending options available for bungalows and verandas.",
    mfgBullet4: "C-Purlin & Z-Purlins for complete steel structural frame.",
    mfgBtn: "Inquire Custom Color Manufacturing",
    colorTitle: "Popular Color Shade Options",
    colorRoyalBlue: "Royal Blue",
    colorTileRed: "Tile / Brick Red",
    colorMintGreen: "Mint Green",
    colorOffWhite: "Off-White",
    colorGalvalume: "Bare Galvalume",
    colorTerracotta: "Terracotta",
    locBadge: "Visit Our Shop",
    locTitle: "Gajanan Traders - Location",
    locAddrLabel: "Shop Address:",
    locAddrVal: "Near Uddhav Nagri, Nanded Road, Naigaon Bz, <br>Taluka Naigaon Kh, District Nanded, Maharashtra, PIN: 431709",
    locPropLabel: "Proprietor:",
    locPropVal: "Mr. Pankaj Medewar",
    locPhoneLabel: "Contact Numbers:",
    locWaLabel: "WhatsApp Business:",
    locHoursLabel: "Business Hours:",
    locHoursVal: "Monday - Saturday: 8:30 AM to 8:00 PM (Sunday: By Appointment)",
    locBtn: "Get Location (Gajanan Traders on Google Maps)",
    delivTitle: "Local Delivery Area",
    delivSub: "We supply and deliver direct to construction sites across:",
    delivArea1: "Naigaon Bz & Kh",
    delivArea2: "Nanded City",
    delivArea3: "Umri & Degloor",
    delivArea4: "Biloli & Kandhar",
    footerMain: "<strong>GAJANAN TRADERS</strong> — Owner: Mr. Pankaj Medewar | Authorised Dealer of Tata Shaktee, MS Pipe, MS Angle, Mangalam Welding Rod & All Types Fabrication Items",
    footerAddr: "Near Uddhav Nagri, Nanded Road, Naigaon Bz, Tq Naigaon Kh, Dist Nanded 431709.",
    footerAboutShop: "About Shop",
    footerMaps: "Gajanan Traders Google Maps",
    footerAdmin: "Admin Portal",
    footerCopy: "© 2026 Gajanan Traders. All Rights Reserved."
  },
  mr: {
    topAnnounceTitle: "अधिकृत डीलर:",
    topAnnounceText: "टाटा शक्ती | एमएस पाईप | एमएस अँगल | मंगलम वेल्डिंग रॉड | सर्व प्रकारचे फॅब्रिकेशन साहित्य",
    themeLabel: "थीम:",
    topAdmin: "ॲडमिन लॉगिन",
    brandSub: "टाटा शक्ती व सर्व प्रकारच्या फॅब्रिकेशन साहित्याचे अधिकृत विक्रेते",
    navProducts: "उत्पादने",
    navAboutShop: "दुकानाविषयी माहिती",
    navOwner: "मालकांबद्दल",
    navMfg: "कस्टम निर्मिती",
    navLoc: "संपर्क व पत्ता",
    waBtn: "व्हॉट्सॲप",
    callBtn: "फोन करा",
    heroBadge: "थेट उत्पादन व अधिकृत वितरक",
    heroTitle: "उत्कृष्ट दर्जाचे रूफिंग पत्रे",
    heroSubtitle: "पसंतीचा रंग व अचूक लांबी",
    heroDesc: "टाटा शक्तीचे अधिकृत विक्रेते. रूफिंग पत्रे (AM/NS, जिंदल पँथर, जिंदल सबरंग, टाटा प्रिझ्मा, टाटा ब्लूस्कोप), एमएस पाईप, एमएस अँगल, एमएस चॅनेल, मंगलम वेल्डिंग रॉड, चेन लिंक जाळी, वेल्ड मेश जाळी, स्क्रू, कटिंग व्हील आणि सर्व प्रकारचे फॅब्रिकेशन साहित्य. आमच्या नायगाव बझार (नांदेड) दुकानास भेट द्या.",
    heroWaBtn: "व्हॉट्सॲपवर दर मागवा",
    heroLocBtn: "पत्ता पाहा (मॅप)",
    heroStat1Num: "१००%",
    heroStat1Label: "अस्सल अधिकृत स्टील",
    heroStat2Num: "कस्टम",
    heroStat2Label: "रंग व लांबीचे मापे",
    heroStat3Num: "४३१७०९",
    heroStat3Label: "नायगाव जलद डिलिव्हरी",
    quickInqTitle: "त्वरित मटेरियल चौकशी",
    quickInqBadge: "उपलब्ध आहे",
    lblBrand: "ब्रँड / साहित्य निवडा",
    lblColor: "आवश्यक रंग",
    lblThickness: "जाडी (मिमी)",
    lblMobile: "तुमचा मोबाईल नंबर",
    sendWaReq: "व्हॉट्सॲपवर दर मागवा",
    authBadgesHeader: "अधिकृत वितरक व फॅक्टरी निर्मिती",
    authSub1: "अधिकृत डीलर",
    authSub2: "पँथर व सबरंग पत्रे",
    authSub3: "वेल्डिंग रॉड",
    authSub4: "एमएस पाईप, अँगल, जाळी व इतर",
    productsBadge: "आमची उत्पादने",
    productsTitle: "सर्व उत्पादनांची यादी",
    productsDesc: "रूफिंग पत्रे, एमएस पाईप, एमएस अँगल, वेल्डिंग रॉड, जाळी, स्क्रू आणि सर्व प्रकारचे फॅब्रिकेशन साहित्य आमच्या नायगाव दुकानात उपलब्ध.",
    ownerCardBadge: "कौटुंबिक व्यवसाय",
    ownerCardFounder: "श्री. प्रकाश मेदेवार (संस्थापक)",
    ownerCardOwner: "आणि श्री. पंकज मेदेवार (मालक)",
    ownerCardSub: "गजानन ट्रेडर्स • ३५ वर्षांहून अधिक काळ विश्वास",
    ownerCardBtn: "संस्थापक व मालकांची माहिती पाहा",
    meetOwnerBadge: "मालकांबद्दल माहिती",
    ownerHeadline: "दर्जेदार स्टील आणि ग्राहकांच्या विश्वासास समर्पित नेतृत्व",
    ownerWelcome: '"गजानन ट्रेडर्समध्ये आपले सहर्ष स्वागत! मी <strong class="text-slate-900">श्री. पंकज मेदेवार</strong>, गजानन ट्रेडर्स नायगाव बझारचा प्रोप्रायटर."',
    ownerBio1: "उद्धव नगरी जवळ, नांदेड रोड नायगाव बझार येथे आमचे दुकान असून नायगाव, नांदेड, उमरी, देगलूर, बिलोली व कंधार परिसरातील शेतकरी, बांधकाम व्यावसायिक व नागरिकांसाठी आम्ही टाटा शक्तीचे अधिकृत पत्रे, एमएस पाईप, अँगल, मंगलम वेल्डिंग रॉड आणि सर्व प्रकारचे फॅब्रिकेशन साहित्य पुरवतो.",
    ownerBio2: "आमच्याकडे रूफिंग पत्रे, एमएस पाईप, एमएस अँगल, एमएस चॅनेल, मंगलम वेल्डिंग रॉड, चेन लिंक जाळी, वेल्ड मेश जाळी, स्क्रू, कटिंग व्हील आणि सर्व प्रकारच्या फॅब्रिकेशन साहित्याचा भरपूर साठा योग्य दरात उपलब्ध आहे.",
    ownerFeat1: "टाटा शक्तीचे अधिकृत डीलर",
    ownerFeat2: "गरजेनुसार कटिंग व साइजिंग",
    ownerFeat3: "रास्त व पारदर्शक दर",
    ownerFeat4: "नांदेड जिल्ह्यात थेट साईटवर डिलिव्हरी",
    ownerWaBtn: "व्हॉट्सॲपवर संपर्क करा",
    ownerCallBtn: "कॉल करा: +91 9767228008",
    trustBadge: "३५+ वर्षांचा विश्वास आणि गुणवत्ता",
    trustHeading: "३५ वर्षांचा अतूट विश्वास",
    trustSub: "३५ वर्षांचा अतूट विश्वास • गजानन ट्रेडर्स, नायगाव बझार",
    trustDesc: "श्री. प्रकाश मेदेवार (सल्लागार संस्थापक) आणि त्यांचे सुपुत्र श्री. पंकज मेदेवार यांच्या नेतृत्वाखाली गजानन ट्रेडर्स हा नायगाव बझार (जि. नांदेड) येथील ३५ वर्षांहून अधिक काळ कार्यरत असलेला एक नामांकित व विश्वासू कौटुंबिक व्यवसाय आहे. दर्जेदार पोलाद आणि उत्कृष्ट सेवेच्या परंपरेसह आम्ही ग्राहकांच्या सेवेत सदैव तत्पर आहोत.",
    trustShopBtn: "दुकान व फॅक्टरीचे फोटो पाहा",
    trustWaBtn: "आमच्याशी संपर्क साधा",
    mfgBadge: "फॅक्टरी मॅन्युफॅक्चरिंग",
    mfgTitle: "पसंतीचा रंग व लांबीनुसार पत्रे तयार करून मिळतील",
    mfgDesc: "छताच्या शेडनुसार अचूक लांबीचा पत्रा हवा आहे? गजानन ट्रेडर्समध्ये स्वयंचलित रोल फॉर्मिंग मशीनद्वारे ६ फुटांपासून ३०+ फुटांपर्यंत हव्या त्या लांबीचे आणि मनपसंत रंगाचे पत्रे तयार करून मिळतात.",
    mfgBullet1: "विविध रंग: रॉयल ब्लू, टाईल रेड, मिंट ग्रीन, ऑफ-व्हाईट इत्यादी.",
    mfgBullet2: "शून्य वेस्टेज: शेडच्या अंतरानुसार अचूक लांबीचे कटिंग.",
    mfgBullet3: "टाईल प्रोफाईल आणि क्रिम्प कर्व्हड बेंडिंगची सुविधा उपलब्ध.",
    mfgBullet4: "मजबूत शेडसाठी सी-पर्लिन व झेड-पर्लिन उपलब्ध.",
    mfgBtn: "कस्टम कलर पत्र्यांची चौकशी करा",
    colorTitle: "लोकप्रिय रंगांचे पर्याय",
    colorRoyalBlue: "रॉयल ब्लू",
    colorTileRed: "टाईल / विटकरी लाल",
    colorMintGreen: "मिंट ग्रीन",
    colorOffWhite: "ऑफ-व्हाईट",
    colorGalvalume: "बेअर गॅल्व्हॅल्युम",
    colorTerracotta: "टेराकोटा",
    locBadge: "आमच्या दुकानाला भेट द्या",
    locTitle: "गजानन ट्रेडर्स - पत्ता व लोकेशन",
    locAddrLabel: "दुकानाचा पत्ता:",
    locAddrVal: "उद्धव नगरी जवळ, नांदेड रोड, नायगाव बझार, <br>ता. नायगाव खै., जि. नांदेड, महाराष्ट्र, पिन: ४३१७०९",
    locPropLabel: "प्रोप्रायटर:",
    locPropVal: "श्री. पंकज मेदेवार",
    locPhoneLabel: "संपर्क क्रमांक:",
    locWaLabel: "व्हॉट्सॲप व्यवसाय:",
    locHoursLabel: "कामाची वेळ:",
    locHoursVal: "सोमवार - शनिवार: सकाळी ८:३० ते रात्री ८:०० (रविवार: अपॉइंटमेंटनुसार)",
    locBtn: "गूगल मॅपवर गजानन ट्रेडर्सचे लोकेशन पाहा",
    delivTitle: "स्थानिक डिलिव्हरी क्षेत्र",
    delivSub: "आम्ही खालील सर्व भागात थेट बांधकाम साईटवर माल पोहोचवतो:",
    delivArea1: "नायगाव बझार व खैरगाव",
    delivArea2: "नांदेड शहर व परिसर",
    delivArea3: "उमरी व देगलूर",
    delivArea4: "बिलोली व कंधार",
    footerMain: "<strong>गजानन ट्रेडर्स</strong> — मालक: श्री. पंकज मेदेवार | टाटा शक्ती, एमएस पाईप, एमएस अँगल, मंगलम वेल्डिंग रॉड आणि सर्व प्रकारच्या फॅब्रिकेशन साहित्याचे अधिकृत विक्रेते",
    footerAddr: "उद्धव नगरी जवळ, नांदेड रोड, नायगाव बझार, ता. नायगाव खै., जि. नांदेड ४३१७०९.",
    footerAboutShop: "दुकानाविषयी माहिती",
    footerMaps: "गूगल मॅप्स लोकेशन",
    footerAdmin: "ॲडमिन पोर्टल",
    footerCopy: "© २०२६ गजानन ट्रेडर्स. सर्व हक्क सुरक्षित."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme);
  applyLanguage(currentLang);
  loadPublicProducts();
  setupHeroForm();
});

// Language Switcher Function
function switchLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('gt_lang', lang);
  applyLanguage(lang);
  if (cachedProductsList && cachedProductsList.length > 0) {
    renderProductCards(cachedProductsList);
  }
}

function applyLanguage(lang) {
  const dict = i18n[lang] || i18n.en;

  const mapping = {
    'txtTopAnnounceTitle': dict.topAnnounceTitle,
    'txtTopAnnounceText': dict.topAnnounceText,
    'txtThemeLabel': dict.themeLabel,
    'txtTopAdmin': dict.topAdmin,
    'txtBrandSub': dict.brandSub,
    'txtNavProducts': dict.navProducts,
    'txtNavAboutShop': dict.navAboutShop,
    'txtNavOwner': dict.navOwner,
    'txtNavMfg': dict.navMfg,
    'txtNavLoc': dict.navLoc,
    'txtWaBtn': dict.waBtn,
    'txtCallBtn': dict.callBtn,
    'txtHeroBadge': dict.heroBadge,
    'txtHeroTitle': dict.heroTitle,
    'txtHeroSubtitle': dict.heroSubtitle,
    'txtHeroDesc': dict.heroDesc,
    'txtHeroWaBtn': dict.heroWaBtn,
    'txtHeroLocBtn': dict.heroLocBtn,
    'txtHeroStat1Num': dict.heroStat1Num,
    'txtHeroStat1Label': dict.heroStat1Label,
    'txtHeroStat2Num': dict.heroStat2Num,
    'txtHeroStat2Label': dict.heroStat2Label,
    'txtHeroStat3Num': dict.heroStat3Num,
    'txtHeroStat3Label': dict.heroStat3Label,
    'txtQuickInqTitle': dict.quickInqTitle,
    'txtQuickInqBadge': dict.quickInqBadge,
    'lblBrand': dict.lblBrand,
    'lblColor': dict.lblColor,
    'lblThickness': dict.lblThickness,
    'lblMobile': dict.lblMobile,
    'txtSendWaReq': dict.sendWaReq,
    'txtAuthBadgesHeader': dict.authBadgesHeader,
    'txtAuthSub1': dict.authSub1,
    'txtAuthSub2': dict.authSub2,
    'txtAuthSub3': dict.authSub3,
    'txtAuthSub4': dict.authSub4,
    'txtProductsBadge': dict.productsBadge,
    'txtProductsTitle': dict.productsTitle,
    'txtProductsDesc': dict.productsDesc,
    'txtOwnerCardBadge': dict.ownerCardBadge,
    'txtOwnerCardFounder': dict.ownerCardFounder,
    'txtOwnerCardOwner': dict.ownerCardOwner,
    'txtOwnerCardSub': dict.ownerCardSub,
    'txtOwnerCardBtn': dict.ownerCardBtn,
    'txtMeetOwnerBadge': dict.meetOwnerBadge,
    'txtOwnerHeadline': dict.ownerHeadline,
    'txtOwnerWelcome': dict.ownerWelcome,
    'txtOwnerBio1': dict.ownerBio1,
    'txtOwnerBio2': dict.ownerBio2,
    'txtOwnerFeat1': dict.ownerFeat1,
    'txtOwnerFeat2': dict.ownerFeat2,
    'txtOwnerFeat3': dict.ownerFeat3,
    'txtOwnerFeat4': dict.ownerFeat4,
    'txtOwnerWaBtn': dict.ownerWaBtn,
    'txtOwnerCallBtn': dict.ownerCallBtn,
    'txtTrustBadge': dict.trustBadge,
    'txtTrustHeading': dict.trustHeading,
    'txtTrustSub': dict.trustSub,
    'txtTrustDesc': dict.trustDesc,
    'txtTrustShopBtn': dict.trustShopBtn,
    'txtTrustWaBtn': dict.trustWaBtn,
    'mfgBadge': dict.mfgBadge,
    'txtMfgTitle': dict.mfgTitle,
    'txtMfgDesc': dict.mfgDesc,
    'txtMfgBullet1': dict.mfgBullet1,
    'txtMfgBullet2': dict.mfgBullet2,
    'txtMfgBullet3': dict.mfgBullet3,
    'txtMfgBullet4': dict.mfgBullet4,
    'txtMfgBtn': dict.mfgBtn,
    'txtColorTitle': dict.colorTitle,
    'txtColorRoyalBlue': dict.colorRoyalBlue,
    'txtColorTileRed': dict.colorTileRed,
    'txtColorMintGreen': dict.colorMintGreen,
    'txtColorOffWhite': dict.colorOffWhite,
    'txtColorGalvalume': dict.colorGalvalume,
    'txtColorTerracotta': dict.colorTerracotta,
    'txtLocBadge': dict.locBadge,
    'txtLocTitle': dict.locTitle,
    'txtLocAddrLabel': dict.locAddrLabel,
    'txtLocAddrVal': dict.locAddrVal,
    'txtLocPropLabel': dict.locPropLabel,
    'txtLocPropVal': dict.locPropVal,
    'txtLocPhoneLabel': dict.locPhoneLabel,
    'txtLocWaLabel': dict.locWaLabel,
    'txtLocHoursLabel': dict.locHoursLabel,
    'txtLocHoursVal': dict.locHoursVal,
    'txtLocBtn': dict.locBtn,
    'txtDelivTitle': dict.delivTitle,
    'txtDelivSub': dict.delivSub,
    'txtDelivArea1': dict.delivArea1,
    'txtDelivArea2': dict.delivArea2,
    'txtDelivArea3': dict.delivArea3,
    'txtDelivArea4': dict.delivArea4,
    'txtFooterMain': dict.footerMain,
    'txtFooterAddr': dict.footerAddr,
    'txtFooterAboutShop': dict.footerAboutShop,
    'txtFooterMaps': dict.footerMaps,
    'txtFooterAdmin': dict.footerAdmin,
    'txtFooterCopy': dict.footerCopy
  };

  for (const [id, text] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (el) {
      if (text.includes('<') && text.includes('>')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
  }

  // Input placeholder
  const phoneInput = document.getElementById('heroPhone');
  if (phoneInput) {
    phoneInput.placeholder = lang === 'mr' ? '१० अंकी मोबाईल नंबर टाका' : 'Enter 10 digit mobile number';
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

// Fallback catalog ensuring products NEVER appear empty under any circumstance
const FALLBACK_PRODUCTS = [
  { id: "PRD-001", name: "AM/NS Roofing Sheet", brand: "AM/NS", category: "Roofing Sheet", profile: "Trapezoidal", image: "/assets/products/amns-sheet.jpg", thicknessOptions: ["0.50 mm"], colors: ["Royal Blue", "Tile Red", "Off-White", "Mint Green"], ratePerUnit: 0, unit: "kg", sheetSize: "3 feet 6 inch to 15 feet", sheetWeight: "15.6 kg to 16 kg", description: "AM/NS premium color-coated roofing sheet. Fixed size 3'6\" to 15 ft, weight 15.6-16 kg, 0.50mm thickness only.", stockStatus: "In Stock" },
  { id: "PRD-002", name: "JINDAL Panther Roofing Sheet", brand: "JINDAL Panther", category: "Roofing Sheet", profile: "Trapezoidal", image: "/assets/products/jindal-panther.jpg", thicknessOptions: ["0.50 mm"], colors: ["Royal Blue", "Tile Red", "Off-White", "Mint Green"], ratePerUnit: 0, unit: "kg", sheetSize: "3 feet 6 inch to 15 feet", sheetWeight: "15.6 kg to 16 kg", description: "JINDAL Panther high-strength roofing sheet. Fixed size 3'6\" to 15 ft, weight 15.6-16 kg, 0.50mm only.", stockStatus: "In Stock" },
  { id: "PRD-003", name: "JINDAL Sabrang Roofing Sheet", brand: "JINDAL Sabrang", category: "Roofing Sheet", profile: "Trapezoidal", image: "/assets/products/jindal-sabrang.jpg", thicknessOptions: ["0.50 mm"], colors: ["Royal Blue", "Tile Red", "Off-White", "Mint Green", "Bare Galvalume"], ratePerUnit: 0, unit: "kg", sheetSize: "3 feet 6 inch to 15 feet", sheetWeight: "15.6 kg to 16 kg", description: "JINDAL Sabrang color-coated roofing sheet. Fixed size 3'6\" to 15 ft, weight 15.6-16 kg, 0.50mm only.", stockStatus: "In Stock" },
  { id: "PRD-004", name: "TATA PRISMA Roofing Sheet", brand: "TATA PRISMA", category: "Roofing Sheet", profile: "Trapezoidal", image: "/assets/products/tata-prisma.jpg", thicknessOptions: ["0.50 mm"], colors: ["Royal Blue", "Tile Red", "Off-White", "Mint Green"], ratePerUnit: 0, unit: "kg", sheetSize: "3 feet 6 inch to 15 feet", sheetWeight: "15.6 kg to 16 kg", description: "TATA PRISMA premium roofing sheet with superior corrosion protection. Fixed size 3'6\" to 15 ft, weight 15.6-16 kg.", stockStatus: "In Stock" },
  { id: "PRD-005", name: "TATA BLUSCOPE Roofing Sheet", brand: "TATA BLUSCOPE", category: "Roofing Sheet", profile: "Trapezoidal", image: "/assets/products/tata-bluscope.jpg", thicknessOptions: ["0.50 mm"], colors: ["Royal Blue", "Tile Red", "Off-White", "Galvalume Silver"], ratePerUnit: 0, unit: "kg", sheetSize: "3 feet 6 inch to 15 feet", sheetWeight: "15.6 kg to 16 kg", description: "TATA BLUSCOPE high-quality roofing sheet. Fixed size 3'6\" to 15 ft, weight 15.6-16 kg, 0.50mm only.", stockStatus: "In Stock" },
  { id: "PRD-006", name: "MS Pipe", brand: "Standard", category: "Pipe", profile: "Round/Square", image: "/assets/products/ms-pipe.jpg", thicknessOptions: [], colors: [], ratePerUnit: 0, unit: "kg", description: "MS Pipe (Mild Steel Pipe) for structural and fabrication use. Available in various sizes and thicknesses.", stockStatus: "In Stock" },
  { id: "PRD-007", name: "MS Angle", brand: "Standard", category: "Pipe", profile: "L-Angle", image: "/assets/products/ms-angle.jpg", thicknessOptions: [], colors: [], ratePerUnit: 0, unit: "kg", description: "MS Angle (Mild Steel Angle) for construction frameworks, gates, shed trusses, and fabrication work.", stockStatus: "In Stock" },
  { id: "PRD-008", name: "MS Channels", brand: "Standard", category: "Pipe", profile: "C-Channel", image: "/assets/products/ms-channels.jpg", thicknessOptions: [], colors: [], ratePerUnit: 0, unit: "kg", description: "MS Channels (C-Channel / U-Channel) for structural support, purlins, and industrial shed construction.", stockStatus: "In Stock" },
  { id: "PRD-009", name: "Mangalam Welding Rod", brand: "Mangalam", category: "Welding Rod", profile: "Rod", image: "/assets/products/mangalam-welding-rod.jpg", thicknessOptions: [], colors: [], ratePerUnit: 0, unit: "kg", description: "Mangalam Welding Rod for all types of welding and heavy metal fabrication work. Premium quality electrodes.", stockStatus: "In Stock" },
  { id: "PRD-010", name: "Chain Link Jali", brand: "Standard", category: "Jali / Mesh", profile: "Chain Link", image: "/assets/products/chain-link-jali.jpg", thicknessOptions: [], colors: ["GI Silver"], ratePerUnit: 0, unit: "kg", description: "Chain Link Jali (fencing mesh) for compound walls, agricultural farm fencing, and boundary security.", stockStatus: "In Stock" },
  { id: "PRD-011", name: "Weld Mesh Jali", brand: "Standard", category: "Jali / Mesh", profile: "Weld Mesh", image: "/assets/products/weld-mesh-jali.jpg", thicknessOptions: [], colors: ["GI Silver"], ratePerUnit: 0, unit: "kg", description: "Weld Mesh Jali for windows, grills, security screens, cages, and construction reinforcement.", stockStatus: "In Stock" },
  { id: "PRD-012", name: "Screw (Self Drilling / Roofing)", brand: "Standard", category: "Fastener", profile: "Screw", image: "/assets/products/roofing-screws.jpg", thicknessOptions: [], colors: [], ratePerUnit: 0, unit: "box", description: "Self-drilling roofing screws with EPDM rubber washer for leak-proof sheet installation. Available in all sizes.", stockStatus: "In Stock" },
  { id: "PRD-013", name: "Cutting Wheel", brand: "Standard", category: "Accessories", profile: "Disc", image: "/assets/products/cutting-wheel.jpg", thicknessOptions: [], colors: [], ratePerUnit: 0, unit: "piece", description: "High-speed abrasive cutting wheel disc for angle grinder. For cutting steel sheets, pipes, and fabrication bars.", stockStatus: "In Stock" },
  { id: "PRD-014", name: "All Types Fabrication Items", brand: "Standard", category: "Fabrication", profile: "Various", image: "/assets/products/fabrication-items.jpg", thicknessOptions: [], colors: [], ratePerUnit: 0, unit: "kg", description: "All types of fabrication items including C-Purlin, Z-Purlin, flat bars, clamps, brackets, and custom steel work.", stockStatus: "In Stock" }
];

function renderProductCards(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid || !products || products.length === 0) return;

  const isMr = currentLang === 'mr';

  grid.innerHTML = products.map(p => {
    const rate = p.ratePerUnit || p.ratePerSqFt || 0;
    const hasSheetSpecs = p.sheetSize || p.sheetWeight;
    const hasThickness = p.thicknessOptions && p.thicknessOptions.length > 0;
    const hasColors = p.colors && p.colors.length > 0;
    const prodImg = p.image || '/assets/products/amns-sheet.jpg';

    // Unit formatting
    let unitDisplay = p.unit || 'kg';
    if (isMr) {
      if (unitDisplay === 'kg') unitDisplay = 'किलो';
      else if (unitDisplay === 'piece') unitDisplay = 'नग';
      else if (unitDisplay === 'box') unitDisplay = 'बॉक्स';
      else if (unitDisplay === 'meter') unitDisplay = 'मीटर';
    }

    const stockText = isMr ? 'स्टॉकमध्ये उपलब्ध' : (p.stockStatus || 'In Stock');
    const thicknessLabel = isMr ? 'जाडी:' : 'Thickness:';
    const colorsLabel = isMr ? 'रंग:' : 'Colors:';
    const sizeLabel = isMr ? 'पत्र्याची लांबी:' : 'Sheet Size:';
    const weightLabel = isMr ? 'वजन:' : 'Weight:';
    const unitLabel = isMr ? 'दर एकक:' : 'Pricing Unit:';
    const rateLabel = isMr ? 'दर:' : 'Rate:';
    const contactText = isMr ? 'दर जाणून घ्या' : 'Contact';
    const waBtnText = isMr ? 'व्हॉट्सॲपवर दर मागवा' : 'WhatsApp Price Quote';

    const waMsg = isMr
      ? `नमस्कार गजानन ट्रेडर्स, मला ${p.name} चे दर आणि उपलब्ध साठा जाणून घ्यायचा आहे.`
      : `Hi Gajanan Traders, I want to check stock and price for ${p.name}.`;

    return `
    <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition flex flex-col justify-between group">
      <div class="h-44 sm:h-48 overflow-hidden bg-slate-900 relative border-b border-slate-100">
        <img src="${prodImg}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='/assets/logo-gajanan-traders.jpg'">
        <span class="absolute top-2.5 left-2.5 bg-slate-900/90 text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded shadow uppercase tracking-wide">${p.brand}</span>
      </div>

      <div class="p-5 flex-grow flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start mb-2">
            <span class="bg-blue-50 text-blue-800 text-[11px] font-black px-2.5 py-1 rounded-md border border-blue-100 uppercase">${p.category || 'Steel'}</span>
            <span class="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">${stockText}</span>
          </div>
          
          <h3 class="font-extrabold text-slate-900 text-base mb-2">${p.name}</h3>
          <p class="text-xs text-slate-600 mb-3 leading-relaxed line-clamp-2">${p.description}</p>
          
          <div class="bg-slate-50 p-2.5 rounded-xl space-y-1 text-xs mb-4">
            ${hasThickness ? `<div class="flex justify-between"><span class="text-slate-500">${thicknessLabel}</span> <span class="font-semibold text-slate-800">${p.thicknessOptions.join(', ')}</span></div>` : ''}
            ${hasColors ? `<div class="flex justify-between"><span class="text-slate-500">${colorsLabel}</span> <span class="font-semibold text-slate-800">${p.colors.join(', ')}</span></div>` : ''}
            ${hasSheetSpecs ? `<div class="flex justify-between"><span class="text-slate-500">${sizeLabel}</span> <span class="font-semibold text-slate-800">${p.sheetSize || '-'}</span></div>` : ''}
            ${hasSheetSpecs ? `<div class="flex justify-between"><span class="text-slate-500">${weightLabel}</span> <span class="font-semibold text-slate-800">${p.sheetWeight || '-'}</span></div>` : ''}
            <div class="flex justify-between"><span class="text-slate-500">${unitLabel}</span> <span class="font-semibold text-slate-800">${isMr ? 'प्रति ' + unitDisplay : 'Per ' + unitDisplay}</span></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-baseline pt-3 border-t border-slate-100 mb-3">
            <span class="text-xs text-slate-500">${rateLabel}</span>
            <span class="text-xl font-black text-slate-900">${rate > 0 ? '₹' + rate : contactText} <span class="text-xs font-normal text-slate-500">/ ${unitDisplay}</span></span>
          </div>

          <a href="https://wa.me/919767228008?text=${encodeURIComponent(waMsg)}" target="_blank" class="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow">
            <i class="fa-brands fa-whatsapp text-sm"></i> ${waBtnText}
          </a>
        </div>
      </div>
    </div>
  `}).join('');
}

// Fetch and display product catalog
async function loadPublicProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  // 1. Immediately render cached or fallback products so page is NEVER blank
  let initialProducts = [];
  try {
    const cached = localStorage.getItem('gt_public_products');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialProducts = parsed;
      }
    }
  } catch(e) {}

  if (initialProducts.length === 0) {
    initialProducts = FALLBACK_PRODUCTS;
  }
  cachedProductsList = initialProducts;
  renderProductCards(cachedProductsList);

  // 2. Fetch fresh products from server in background and re-render if updated
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const liveProducts = await res.json();
      if (Array.isArray(liveProducts) && liveProducts.length > 0) {
        cachedProductsList = liveProducts;
        localStorage.setItem('gt_public_products', JSON.stringify(liveProducts));
        renderProductCards(cachedProductsList);
      }
    }
  } catch (err) {
    console.warn('Network error fetching products, using cached/fallback:', err);
  }
}

// Hero Quick Form logic (100% WhatsApp inquiry)
function setupHeroForm() {
  const form = document.getElementById('quickHeroForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const brand = document.getElementById('heroBrand').value;
    const color = document.getElementById('heroColor').value;
    const thickness = document.getElementById('heroThickness').value;
    const phone = document.getElementById('heroPhone').value;

    // Automatically record inquiry on server for admin history
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Quick Inquiry Customer',
          phone: phone,
          city: 'Naigaon Bz',
          brandPreference: brand,
          message: `Quick WhatsApp Inquiry: Brand ${brand}, Color ${color}, Thickness ${thickness}`
        })
      });
    } catch (err) {
      console.warn('Could not auto-save hero enquiry:', err);
    }

    const msg = currentLang === 'mr'
      ? `नमस्कार गजानन ट्रेडर्स, माझा मोबाईल क्रमांक ${phone} आहे. मला खालील साहित्याचे दर व माहिती हवी आहे:\n- ब्रँड / साहित्य: ${brand}\n- रंग: ${color}\n- जाडी: ${thickness}\n\nकृपया नायगाव बझारसाठी योग्य दर व डिलिव्हरीची माहिती पाठवा.`
      : `Hi Gajanan Traders, my phone is ${phone}. I need a price quote for:\n- Brand: ${brand}\n- Color: ${color}\n- Thickness: ${thickness}\n\nPlease send best price and delivery time for Naigaon location.`;

    window.open(`https://wa.me/919767228008?text=${encodeURIComponent(msg)}`, '_blank');
  });
}
