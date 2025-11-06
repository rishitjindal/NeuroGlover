
import React, { useState, useMemo, createContext, useContext, ReactNode } from 'react';
import Dashboard from './components/Dashboard';

// --- i18n System ---

export const translations = {
  en: {
    dashboardTitle: "Sensor Dashboard",
    dashboardSubtitle: "Real-time monitoring",
    liveSensorFeed: "Live Sensor Feed",
    deviceControl: "Device Control",
    latestSensorReading: "Latest Sensor Reading",
    connectToDevice: "Connect to Device",
    connecting: "Connecting...",
    disconnect: "Disconnect",
    selectCharacteristicTitle: "Select a Characteristic to Monitor",
    selectCharacteristicDesc: 'Choose a characteristic with the "NOTIFY" property to receive live data.',
    historicalData: "Historical Data",
    from: "From:",
    to: "To:",
    clearHistory: "Clear History",
    clearHistoryConfirm: "Are you sure you want to delete all historical sensor data? This action cannot be undone.",
    dateError: "Start date cannot be after end date.",
    waitingForData: "Waiting for data from a connected device...",
    sensorValue: "Sensor Value",
    disconnected: "Disconnected",
    connectingStatus: "Connecting",
    connected: "Connected",
    selectCharacteristic: "Select Characteristic",
    error: "Error",
  },
  hi: {
    dashboardTitle: "सेंसर डैशबोर्ड",
    dashboardSubtitle: "वास्तविक समय की निगरानी",
    liveSensorFeed: "लाइव सेंसर फ़ीड",
    deviceControl: "डिवाइस नियंत्रण",
    latestSensorReading: "नवीनतम सेंसर रीडिंग",
    connectToDevice: "डिवाइस से कनेक्ट करें",
    connecting: "कनेक्ट हो रहा है...",
    disconnect: "डिस्कनेक्ट करें",
    selectCharacteristicTitle: "निगरानी के लिए एक कैरेक्टरिस्टिक चुनें",
    selectCharacteristicDesc: 'लाइव डेटा प्राप्त करने के लिए "NOTIFY" प्रॉपर्टी वाली कैरेक्टरिस्टिक चुनें।',
    historicalData: "ऐतिहासिक डेटा",
    from: "से:",
    to: "तक:",
    clearHistory: "इतिहास साफ़ करें",
    clearHistoryConfirm: "क्या आप वाकई सभी ऐतिहासिक सेंसर डेटा हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।",
    dateError: "प्रारंभ तिथि अंतिम तिथि के बाद नहीं हो सकती।",
    waitingForData: "कनेक्टेड डिवाइस से डेटा की प्रतीक्षा की जा रही है...",
    sensorValue: "सेंसर मान",
    disconnected: "डिस्कनेक्टेड",
    connectingStatus: "कनेक्ट हो रहा है",
    connected: "कनेक्टेड",
    selectCharacteristic: "कैरेक्टरिस्टिक चुनें",
    error: "त्रुटि",
  },
  ta: {
    dashboardTitle: "சென்சார் டாஷ்போர்டு",
    dashboardSubtitle: "நிகழ்நேர கண்காணிப்பு",
    liveSensorFeed: "நேரடி சென்சார் ஊட்டம்",
    deviceControl: "சாதனக் கட்டுப்பாடு",
    latestSensorReading: "சமீபத்திய சென்சார் படித்தல்",
    connectToDevice: "சாதனத்துடன் இணைக்கவும்",
    connecting: "இணைக்கப்படுகிறது...",
    disconnect: "தொடர்பை துண்டிக்கவும்",
    selectCharacteristicTitle: "கண்காணிக்க ஒரு பண்பைத் தேர்ந்தெடுக்கவும்",
    selectCharacteristicDesc: 'நேரடித் தரவைப் பெற "NOTIFY" பண்புடன் ஒரு பண்பைத் தேர்வுசெய்யவும்.',
    historicalData: "வரலாற்றுத் தரவு",
    from: "இருந்து:",
    to: "வரை:",
    clearHistory: "வரலாற்றை அழிக்கவும்",
    clearHistoryConfirm: "அனைத்து வரலாற்று சென்சார் தரவையும் நீக்க விரும்புகிறீர்களா? இந்த செயலைச் செயல்தவிர்க்க முடியாது.",
    dateError: "தொடக்க தேதி இறுதி தேதிக்குப் பிறகு இருக்க முடியாது.",
    waitingForData: "இணைக்கப்பட்ட சாதனத்திலிருந்து தரவுக்காக காத்திருக்கிறது...",
    sensorValue: "சென்சார் மதிப்பு",
    disconnected: "தொடர்பு துண்டிக்கப்பட்டது",
    connectingStatus: "இணைக்கிறது",
    connected: "இணைக்கப்பட்டது",
    selectCharacteristic: "பண்பைத் தேர்ந்தெடுக்கவும்",
    error: "பிழை",
  },
  mr: {
    dashboardTitle: "सेन्सर डॅशबोर्ड",
    dashboardSubtitle: "रिअल-टाइम मॉनिटरिंग",
    liveSensorFeed: "लाइव्ह सेन्सर फीड",
    deviceControl: "डिव्हाइस नियंत्रण",
    latestSensorReading: "नवीनतम सेन्सर वाचन",
    connectToDevice: "डिव्हाइसशी कनेक्ट करा",
    connecting: "कनेक्ट करत आहे...",
    disconnect: "डिस्कनेक्ट करा",
    selectCharacteristicTitle: "निरीक्षणासाठी एक कॅरॅक्टरिस्टिक निवडा",
    selectCharacteristicDesc: 'लाइव्ह डेटा प्राप्त करण्यासाठी "NOTIFY" गुणधर्मासह एक कॅरॅक्टरिस्टिक निवडा.',
    historicalData: "ऐतिहासिक डेटा",
    from: "पासून:",
    to: "पर्यंत:",
    clearHistory: "इतिहास साफ करा",
    clearHistoryConfirm: "तुम्हाला खात्री आहे की तुम्हाला सर्व ऐतिहासिक सेन्सर डेटा हटवायचा आहे? ही क्रिया पूर्ववत केली जाऊ शकत नाही.",
    dateError: "प्रारंभ तारीख समाप्ती तारखेनंतर असू शकत नाही.",
    waitingForData: "कनेक्ट केलेल्या डिव्हाइसवरून डेटाची प्रतीक्षा करत आहे...",
    sensorValue: "सेन्सर मूल्य",
    disconnected: "डिस्कनेक्ट केले",
    connectingStatus: "कनेक्ट करत आहे",
    connected: "कनेक्ट केले",
    selectCharacteristic: "कॅरॅक्टरिस्टिक निवडा",
    error: "त्रुटी",
  },
  te: {
    dashboardTitle: "సెన్సార్ డాష్‌బోర్డ్",
    dashboardSubtitle: "నిజ-సమయ పర్యవేక్షణ",
    liveSensorFeed: "లైవ్ సెన్సార్ ఫీడ్",
    deviceControl: "పరికర నియంత్రణ",
    latestSensorReading: "తాజా సెన్సార్ రీడింగ్",
    connectToDevice: "పరికరాన్ని కనెక్ట్ చేయండి",
    connecting: "కనెక్ట్ అవుతోంది...",
    disconnect: "డిస్‌కనెక్ట్ చేయండి",
    selectCharacteristicTitle: "పర్యవేక్షించడానికి ఒక లక్షణాన్ని ఎంచుకోండి",
    selectCharacteristicDesc: 'లైవ్ డేటాను స్వీకరించడానికి "NOTIFY" లక్షణంతో ఒక లక్షణాన్ని ఎంచుకోండి.',
    historicalData: "చారిత్రక డేటా",
    from: "నుండి:",
    to: "వరకు:",
    clearHistory: "చరిత్రను క్లియర్ చేయండి",
    clearHistoryConfirm: "మీరు మొత్తం చారిత్రక సెన్సార్ డేటాను తొలగించాలనుకుంటున్నారని ఖಚಿತంగా ఉన్నారా? ఈ చర్యను రద్దు చేయడం సాధ్యం కాదు.",
    dateError: "ప్రారంభ తేదీ ముగింపు తేదీ తర్వాత ఉండకూడదు.",
    waitingForData: "కనెక్ట్ చేయబడిన పరికరం నుండి డేటా కోసం వేచి ఉంది...",
    sensorValue: "సెన్సార్ విలువ",
    disconnected: "డిస్‌కనెక్ట్ చేయబడింది",
    connectingStatus: "కనెక్ట్ చేస్తోంది",
    connected: "కనెక్ట్ చేయబడింది",
    selectCharacteristic: "లక్షణాన్ని ఎంచుకోండి",
    error: "లోపం",
  },
  kn: {
    dashboardTitle: "ಸೆನ್ಸರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    dashboardSubtitle: "ನೈಜ-ಸಮಯದ ಮೇಲ್ವಿಚಾರಣೆ",
    liveSensorFeed: "ಲೈವ್ ಸೆನ್ಸರ್ ಫೀಡ್",
    deviceControl: "ಸಾಧನ ನಿಯಂತ್ರಣ",
    latestSensorReading: "ಇತ್ತೀಚಿನ ಸೆನ್ಸರ್ ರೀಡಿಂಗ್",
    connectToDevice: "ಸಾಧನಕ್ಕೆ ಸಂಪರ್ಕಪಡಿಸಿ",
    connecting: "ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...",
    disconnect: "ಸಂಪರ್ಕ ಕಡಿತಗೊಳಿಸಿ",
    selectCharacteristicTitle: "ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲು ಒಂದು ಕ್ಯಾರೆಕ್ಟರಿಸ್ಟಿಕ್ ಆಯ್ಕೆಮಾಡಿ",
    selectCharacteristicDesc: 'ಲೈವ್ ಡೇಟಾವನ್ನು ಸ್ವೀಕರಿಸಲು "NOTIFY" ಗುಣಲಕ್ಷಣದೊಂದಿಗೆ ಒಂದು ಕ್ಯಾರೆಕ್ಟರಿಸ್ಟಿಕ್ ಆಯ್ಕೆಮಾಡಿ.',
    historicalData: "ಐತಿಹಾಸಿಕ ಡೇಟಾ",
    from: "ಇಂದ:",
    to: "ಗೆ:",
    clearHistory: "ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಿ",
    clearHistoryConfirm: "ನೀವು ಎಲ್ಲಾ ಐತಿಹಾಸಿಕ ಸೆನ್ಸರ್ ಡೇಟಾವನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂತಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    dateError: "ಪ್ರಾರಂಭ ದಿನಾಂಕವು ಅಂತಿಮ ದಿನಾಂಕದ ನಂತರ ಇರಬಾರದು.",
    waitingForData: "ಸಂಪರ್ಕಿತ ಸಾಧನದಿಂದ ಡೇಟಾಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
    sensorValue: "ಸೆನ್ಸರ್ ಮೌಲ್ಯ",
    disconnected: "ಸಂಪರ್ಕ ಕಡಿತಗೊಂಡಿದೆ",
    connectingStatus: "ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ",
    connected: "ಸಂಪರ್ಕಗೊಂಡಿದೆ",
    selectCharacteristic: "ಕ್ಯಾರೆಕ್ಟರಿಸ್ಟಿಕ್ ಆಯ್ಕೆಮಾಡಿ",
    error: "ದೋಷ",
  },
  gu: {
    dashboardTitle: "સેન્સર ડેશબોર્ડ",
    dashboardSubtitle: "રીઅલ-ટાઇમ મોનિટરિંગ",
    liveSensorFeed: "લાઇવ સેન્સર ફીડ",
    deviceControl: "ઉપકરણ નિયંત્રણ",
    latestSensorReading: "નવીનતમ સેન્સર રીડિંગ",
    connectToDevice: "ઉપકરણ સાથે કનેક્ટ કરો",
    connecting: "કનેક્ટ થઈ રહ્યું છે...",
    disconnect: "ડિસ્કનેક્ટ કરો",
    selectCharacteristicTitle: "મોનિટર કરવા માટે એક લાક્ષણિકતા પસંદ કરો",
    selectCharacteristicDesc: 'લાઇવ ડેટા મેળવવા માટે "NOTIFY" ગુણધર્મ સાથેની લાક્ષણિકતા પસંદ કરો.',
    historicalData: "ઐતિહાસિક ડેટા",
    from: "થી:",
    to: "સુધી:",
    clearHistory: "ઇતિહાસ સાફ કરો",
    clearHistoryConfirm: "શું તમે ખરેખર બધો ઐતિહાસિક સેન્સર ડેટા કાઢી નાખવા માંગો છો? આ ક્રિયાને પૂર્વવત્ કરી શકાતી નથી.",
    dateError: "પ્રારંભ તારીખ સમાપ્તિ તારીખ પછી ન હોઈ શકે.",
    waitingForData: "કનેક્ટેડ ઉપકરણમાંથી ડેટાની રાહ જોઈ રહ્યું છે...",
    sensorValue: "સેન્સર મૂલ્ય",
    disconnected: "ડિસ્કનેક્ટ થયેલ",
    connectingStatus: "કનેક્ટ થઈ રહ્યું છે",
    connected: "કનેક્ટેડ",
    selectCharacteristic: "લાક્ષણિકતા પસંદ કરો",
    error: "ભૂલ",
  },
  ml: {
    dashboardTitle: "സെൻസർ ഡാഷ്‌ബോർഡ്",
    dashboardSubtitle: "തത്സമയ നിരീക്ഷണം",
    liveSensorFeed: "ലൈവ് സെൻസർ ഫീഡ്",
    deviceControl: "ഉപകരണ നിയന്ത്രണം",
    latestSensorReading: "ഏറ്റവും പുതിയ സെൻസർ റീഡിംഗ്",
    connectToDevice: "ഉപകരണത്തിലേക്ക് കണക്റ്റുചെയ്യുക",
    connecting: "കണക്റ്റുചെയ്യുന്നു...",
    disconnect: "വിച്ഛേദിക്കുക",
    selectCharacteristicTitle: "നിരീക്ഷിക്കാൻ ഒരു സ്വഭാവഗുണം തിരഞ്ഞെടുക്കുക",
    selectCharacteristicDesc: 'ലൈവ് ഡാറ്റ ലഭിക്കുന്നതിന് "NOTIFY" പ്രോപ്പർട്ടിയുള്ള ഒരു സ്വഭാവഗുണം തിരഞ്ഞെടുക്കുക.',
    historicalData: "ചരിത്രപരമായ ഡാറ്റ",
    from: "മുതൽ:",
    to: "വരെ:",
    clearHistory: "ചരിത്രം മായ്ക്കുക",
    clearHistoryConfirm: "എല്ലാ ചരിത്രപരമായ സെൻസർ ഡാറ്റയും ഇല്ലാതാക്കാൻ നിങ്ങൾ ആഗ്രഹിക്കുന്നുവെന്ന് ഉറപ്പാണോ? ഈ പ്രവർത്തനം പഴയപടിയാക്കാൻ കഴിയില്ല.",
    dateError: "ആരംഭ തീയതി അവസാന തീയതിക്ക് ശേഷം ആകരുത്.",
    waitingForData: "കണക്റ്റുചെയ്‌ത ഉപകരണത്തിൽ നിന്ന് ഡാറ്റയ്ക്കായി കാത്തിരിക്കുന്നു...",
    sensorValue: "സെൻസർ മൂല്യം",
    disconnected: "വിച്ഛേദിച്ചു",
    connectingStatus: "കണക്റ്റുചെയ്യുന്നു",
    connected: "കണക്റ്റുചെയ്‌തു",
    selectCharacteristic: "സ്വഭാവഗുണം തിരഞ്ഞെടുക്കുക",
    error: "പിശക്",
  },
  bn: {
    dashboardTitle: "সেন্সর ড্যাশবোর্ড",
    dashboardSubtitle: "রিয়েল-টাইম পর্যবেক্ষণ",
    liveSensorFeed: "লাইভ সেন্সর ফিড",
    deviceControl: "ডিভাইস নিয়ন্ত্রণ",
    latestSensorReading: "সর্বশেষ সেন্সর রিডিং",
    connectToDevice: "ডিভাইসের সাথে সংযোগ করুন",
    connecting: "সংযোগ করা হচ্ছে...",
    disconnect: "সংযোগ বিচ্ছিন্ন করুন",
    selectCharacteristicTitle: "পর্যবেক্ষণের জন্য একটি বৈশিষ্ট্য নির্বাচন করুন",
    selectCharacteristicDesc: 'লাইভ ডেটা পেতে "NOTIFY" বৈশিষ্ট্য সহ একটি বৈশিষ্ট্য চয়ন করুন।',
    historicalData: "ঐতিহাসিক ডেটা",
    from: "থেকে:",
    to: "পর্যন্ত:",
    clearHistory: "ইতিহাস পরিষ্কার করুন",
    clearHistoryConfirm: "আপনি কি নিশ্চিত যে আপনি সমস্ত ঐতিহাসিক সেন্সর ডেটা মুছতে চান? এই ক্রিয়াটি ফিরিয়ে আনা যাবে না।",
    dateError: "শুরুর তারিখ শেষের তারিখের পরে হতে পারে না।",
    waitingForData: "সংযুক্ত ডিভাইস থেকে ডেটার জন্য অপেক্ষা করা হচ্ছে...",
    sensorValue: "সেন্সর মান",
    disconnected: "সংযোগ বিচ্ছিন্ন",
    connectingStatus: "সংযোগ করা হচ্ছে",
    connected: "সংযুক্ত",
    selectCharacteristic: "বৈশিষ্ট্য নির্বাচন করুন",
    error: "ত্রুটি",
  },
  pa: {
    dashboardTitle: "ਸੈਂਸਰ ਡੈਸ਼ਬੋਰਡ",
    dashboardSubtitle: "ਰੀਅਲ-ਟਾਈਮ ਨਿਗਰਾਨੀ",
    liveSensorFeed: "ਲਾਈਵ ਸੈਂਸਰ ਫੀਡ",
    deviceControl: "ਡਿਵਾਈਸ ਕੰਟਰੋਲ",
    latestSensorReading: "ਨਵੀਨਤਮ ਸੈਂਸਰ ਰੀਡਿੰਗ",
    connectToDevice: "ਡਿਵਾਈਸ ਨਾਲ ਕਨੈਕਟ ਕਰੋ",
    connecting: "ਕਨੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    disconnect: "ਡਿਸਕਨੈਕਟ ਕਰੋ",
    selectCharacteristicTitle: "ਨਿਗਰਾਨੀ ਲਈ ਇੱਕ ਵਿਸ਼ੇਸ਼ਤਾ ਚੁਣੋ",
    selectCharacteristicDesc: 'ਲਾਈਵ ਡਾਟਾ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ "NOTIFY" ਵਿਸ਼ੇਸ਼ਤਾ ਵਾਲੀ ਇੱਕ ਵਿਸ਼ੇਸ਼ਤਾ ਚੁਣੋ।',
    historicalData: "ਇਤਿਹਾਸਕ ਡਾਟਾ",
    from: "ਤੋਂ:",
    to: "ਤੱਕ:",
    clearHistory: "ਇਤਿਹਾਸ ਸਾਫ਼ ਕਰੋ",
    clearHistoryConfirm: "ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਸਾਰਾ ਇਤਿਹਾਸਕ ਸੈਂਸਰ ਡਾਟਾ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ? ਇਹ ਕਾਰਵਾਈ ਵਾਪਸ ਨਹੀਂ ਕੀਤੀ ਜਾ ਸਕਦੀ।",
    dateError: "ਸ਼ੁਰੂਆਤੀ ਮਿਤੀ ਅੰਤਮ ਮਿਤੀ ਤੋਂ ਬਾਅਦ ਨਹੀਂ ਹੋ ਸਕਦੀ।",
    waitingForData: "ਕਨੈਕਟ ਕੀਤੇ ਡਿਵਾਈਸ ਤੋਂ ਡਾਟਾ ਦੀ ਉਡੀਕ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    sensorValue: "ਸੈਂਸਰ ਮੁੱਲ",
    disconnected: "ਡਿਸਕਨੈਕਟ ਕੀਤਾ ਗਿਆ",
    connectingStatus: "ਕਨੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ",
    connected: "ਕਨੈक्ट ਕੀਤਾ ਗਿਆ",
    selectCharacteristic: "ਵਿਸ਼ੇਸ਼ਤਾ ਚੁਣੋ",
    error: "ਗਲਤੀ",
  }
};

export type Language = keyof typeof translations;
const availableLanguages = Object.keys(translations) as Language[];

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key: TranslationKey) => translations[language]?.[key] || translations.en[key],
    availableLanguages
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return context;
};

// --- App Component ---

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-primary">
        <Dashboard />
      </div>
    </LanguageProvider>
  );
}

export default App;