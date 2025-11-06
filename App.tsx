
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
  es: {
    dashboardTitle: "Panel de Sensores",
    dashboardSubtitle: "Monitoreo en tiempo real e información impulsada por IA",
    liveSensorFeed: "Fuente de Sensor en Vivo",
    deviceControl: "Control del Dispositivo",
    latestSensorReading: "Última Lectura del Sensor",
    lastUsedConfig: "Última Configuración Usada",
    serviceUuid: "UUID del Servicio",
    characteristicUuid: "UUID de la Característica",
    connectToDevice: "Conectar al Dispositivo",
    connecting: "Conectando...",
    disconnect: "Desconectar",
    selectCharacteristicTitle: "Seleccione una Característica para Monitorear",
    selectCharacteristicDesc: 'Elija una característica con la propiedad "NOTIFY" para recibir datos en vivo.',
    historicalData: "Datos Históricos",
    from: "Desde:",
    to: "Hasta:",
    clearHistory: "Limpiar Historial",
    clearHistoryConfirm: "¿Está seguro de que desea eliminar todos los datos históricos del sensor? Esta acción no se puede deshacer.",
    dateError: "La fecha de inicio no puede ser posterior a la fecha de finalización.",
    waitingForData: "Esperando datos de un dispositivo conectado...",
    sensorValue: "Valor del Sensor",
    aiAssistant: "Asistente de IA",
    initialBotMessage: "¡Hola! Soy tu asistente de IA, conectado a este panel. Puedo ver el estado de tu dispositivo y los datos del sensor. ¿Cómo puedo ayudarte?",
    askAnything: "Pregunta lo que sea...",
    sources: "Fuentes:",
    disconnected: "Desconectado",
    connectingStatus: "Conectando",
    connected: "Conectado",
    selectCharacteristic: "Seleccionar Característica",
    error: "Error",
  },
  fr: {
    dashboardTitle: "Tableau de Bord des Capteurs",
    dashboardSubtitle: "Surveillance en temps réel et informations basées sur l'IA",
    liveSensorFeed: "Flux de Capteur en Direct",
    deviceControl: "Contrôle de l'Appareil",
    latestSensorReading: "Dernière Lecture du Capteur",
    lastUsedConfig: "Dernière Configuration Utilisée",
    serviceUuid: "UUID du Service",
    characteristicUuid: "UUID de la Caractéristique",
    connectToDevice: "Connecter à l'Appareil",
    connecting: "Connexion...",
    disconnect: "Déconnecter",
    selectCharacteristicTitle: "Sélectionnez une Caractéristique à Surveiller",
    selectCharacteristicDesc: "Choisissez une caractéristique avec la propriété \"NOTIFY\" pour recevoir des données en direct.",
    historicalData: "Données Historiques",
    from: "De:",
    to: "À:",
    clearHistory: "Effacer l'Historique",
    clearHistoryConfirm: "Êtes-vous sûr de vouloir supprimer toutes les données historiques des capteurs ? Cette action est irréversible.",
    dateError: "La date de début ne peut pas être postérieure à la date de fin.",
    waitingForData: "En attente de données d'un appareil connecté...",
    sensorValue: "Valeur du Capteur",
    aiAssistant: "Assistant IA",
    initialBotMessage: "Bonjour ! Je suis votre assistant IA, connecté à ce tableau de bord. Je peux voir l'état de votre appareil et les données des capteurs. Comment puis-je vous aider ?",
    askAnything: "Posez n'importe quelle question...",
    sources: "Sources:",
    disconnected: "Déconnecté",
    connectingStatus: "Connexion en cours",
    connected: "Connecté",
    selectCharacteristic: "Sélectionner Caractéristique",
    error: "Erreur",
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
