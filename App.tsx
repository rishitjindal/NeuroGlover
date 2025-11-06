
import React, { useState, useMemo, createContext, useContext, ReactNode } from 'react';
import Dashboard from './components/Dashboard';

// --- i18n System ---

export const translations = {
  en: {
    dashboardTitle: "Sensor Dashboard",
    dashboardSubtitle: "Real-time monitoring and AI-powered insights",
    liveSensorFeed: "Live Sensor Feed",
    deviceControl: "Device Control",
    latestSensorReading: "Latest Sensor Reading",
    lastUsedConfig: "Last Used Configuration",
    serviceUuid: "Service UUID",
    characteristicUuid: "Characteristic UUID",
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
    aiAssistant: "AI Assistant",
    initialBotMessage: "Hello! I'm your AI assistant, connected to this dashboard. I can see your device status and sensor data. How can I help?",
    askAnything: "Ask anything...",
    sources: "Sources:",
    disconnected: "Disconnected",
    connectingStatus: "Connecting",
    connected: "Connected",
    selectCharacteristic: "Select Characteristic",
    error: "Error",
  },
  hi: {
    dashboardTitle: "सेंसर डैशबोर्ड",
    dashboardSubtitle: "वास्तविक समय की निगरानी और AI-संचालित अंतर्दृष्टि",
    liveSensorFeed: "लाइव सेंसर फ़ीड",
    deviceControl: "डिवाइस नियंत्रण",
    latestSensorReading: "नवीनतम सेंसर रीडिंग",
    lastUsedConfig: "अंतिम प्रयुक्त कॉन्फ़िगरेशन",
    serviceUuid: "सर्विस UUID",
    characteristicUuid: "कैरेक्टरिस्टिक UUID",
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
    aiAssistant: "AI सहायक",
    initialBotMessage: "नमस्ते! मैं आपका AI सहायक हूं, जो इस डैशबोर्ड से जुड़ा है। मैं आपके डिवाइस की स्थिति और सेंसर डेटा देख सकता हूं। मैं आपकी कैसे मदद कर सकता हूं?",
    askAnything: "कुछ भी पूछें...",
    sources: "स्रोत:",
    disconnected: "डिस्कनेक्टेड",
    connectingStatus: "कनेक्ट हो रहा है",
    connected: "कनेक्टेड",
    selectCharacteristic: "कैरेक्टरिस्टिक चुनें",
    error: "त्रुटि",
  },
  ta: {
    dashboardTitle: "சென்சார் டாஷ்போர்டு",
    dashboardSubtitle: "நிகழ்நேர கண்காணிப்பு மற்றும் AI-இயங்கும் நுண்ணறிவு",
    liveSensorFeed: "நேரடி சென்சார் ஊட்டம்",
    deviceControl: "சாதனக் கட்டுப்பாடு",
    latestSensorReading: "சமீபத்திய சென்சார் படித்தல்",
    lastUsedConfig: "கடைசியாக பயன்படுத்தப்பட்ட கட்டமைப்பு",
    serviceUuid: "சேவை UUID",
    characteristicUuid: "பண்பு UUID",
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
    aiAssistant: "AI உதவியாளர்",
    initialBotMessage: "வணக்கம்! நான் உங்கள் AI உதவியாளர், இந்த டாஷ்போர்டுடன் இணைக்கப்பட்டுள்ளேன். உங்கள் சாதனத்தின் நிலை மற்றும் சென்சார் தரவை நான் பார்க்க முடியும். நான் எப்படி உதவ முடியும்?",
    askAnything: "எதையும் கேளுங்கள்...",
    sources: "ஆதாரங்கள்:",
    disconnected: "தொடர்பு துண்டிக்கப்பட்டது",
    connectingStatus: "இணைக்கிறது",
    connected: "இணைக்கப்பட்டது",
    selectCharacteristic: "பண்பைத் தேர்ந்தெடுக்கவும்",
    error: "பிழை",
  },
  mr: {
    dashboardTitle: "सेन्सर डॅशबोर्ड",
    dashboardSubtitle: "रिअल-टाइम मॉनिटरिंग आणि AI-शक्तीशाली अंतर्दृष्टी",
    liveSensorFeed: "लाइव्ह सेन्सर फीड",
    deviceControl: "डिव्हाइस नियंत्रण",
    latestSensorReading: "नवीनतम सेन्सर वाचन",
    lastUsedConfig: "शेवटचे वापरलेले कॉन्फिगरेशन",
    serviceUuid: "सेवा UUID",
    characteristicUuid: "कॅरॅक्टरिस्टिक UUID",
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
    aiAssistant: "AI सहाय्यक",
    initialBotMessage: "नमस्कार! मी तुमचा AI सहाय्यक आहे, या डॅशबोर्डशी कनेक्ट केलेला आहे. मी तुमच्या डिव्हाइसची स्थिती आणि सेन्सर डेटा पाहू शकतो. मी कशी मदत करू शकेन?",
    askAnything: "काहीही विचारा...",
    sources: "स्रोत:",
    disconnected: "डिस्कनेक्ट केले",
    connectingStatus: "कनेक्ट करत आहे",
    connected: "कनेक्ट केले",
    selectCharacteristic: "कॅरॅक्टरिस्टिक निवडा",
    error: "त्रुटी",
  },
  te: {
    dashboardTitle: "సెన్సార్ డాష్‌బోర్డ్",
    dashboardSubtitle: "నిజ-సమయ పర్యవేక్షణ మరియు AI-ఆధారిత అంతర్దృష్టులు",
    liveSensorFeed: "లైవ్ సెన్సార్ ఫీడ్",
    deviceControl: "పరికర నియంత్రణ",
    latestSensorReading: "తాజా సెన్సార్ రీడింగ్",
    lastUsedConfig: "చివరిగా ఉపయోగించిన కాన్ఫిగరేషన్",
    serviceUuid: "సేవ UUID",
    characteristicUuid: "లక్షణం UUID",
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
    aiAssistant: "AI సహాయకుడు",
    initialBotMessage: "నమస్కారం! నేను మీ AI సహాయకుడిని, ఈ డాష్‌బోర్డ్‌కు కనెక్ట్ చేయబడ్డాను. నేను మీ పరికర స్థితి మరియు సెన్సార్ డేటాను చూడగలను. నేను ఎలా సహాయపడగలను?",
    askAnything: "ఏదైనా అడగండి...",
    sources: "మూలాలు:",
    disconnected: "డిస్‌కనెక్ట్ చేయబడింది",
    connectingStatus: "కనెక్ట్ చేస్తోంది",
    connected: "కనెక్ట్ చేయబడింది",
    selectCharacteristic: "లక్షణాన్ని ఎంచుకోండి",
    error: "లోపం",
  },
  kn: {
    dashboardTitle: "ಸೆನ್ಸರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    dashboardSubtitle: "ನೈಜ-ಸಮಯದ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು AI-ಚಾಲಿತ ಒಳನೋಟಗಳು",
    liveSensorFeed: "ಲೈವ್ ಸೆನ್ಸರ್ ಫೀಡ್",
    deviceControl: "ಸಾಧನ ನಿಯಂತ್ರಣ",
    latestSensorReading: "ಇತ್ತೀಚಿನ ಸೆನ್ಸರ್ ರೀಡಿಂಗ್",
    lastUsedConfig: "ಕೊನೆಯದಾಗಿ ಬಳಸಿದ ಸಂರಚನೆ",
    serviceUuid: "ಸೇವೆ UUID",
    characteristicUuid: "ಕ್ಯಾರೆಕ್ಟರಿಸ್ಟಿಕ್ UUID",
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
    aiAssistant: "AI ಸಹಾಯಕ",
    initialBotMessage: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಸಹಾಯಕ, ಈ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಸಂಪರ್ಕಗೊಂಡಿದ್ದೇನೆ. ನಾನು ನಿಮ್ಮ ಸಾಧನದ ಸ್ಥಿತಿ ಮತ್ತು ಸೆನ್ಸರ್ ಡೇಟಾವನ್ನು ನೋಡಬಲ್ಲೆ. ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    askAnything: "ಏನನ್ನಾದರೂ ಕೇಳಿ...",
    sources: "ಮೂಲಗಳು:",
    disconnected: "ಸಂಪರ್ಕ ಕಡಿತಗೊಂಡಿದೆ",
    connectingStatus: "ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ",
    connected: "ಸಂಪರ್ಕಗೊಂಡಿದೆ",
    selectCharacteristic: "ಕ್ಯಾರೆಕ್ಟರಿಸ್ಟಿಕ್ ಆಯ್ಕೆಮಾಡಿ",
    error: "ದೋಷ",
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
