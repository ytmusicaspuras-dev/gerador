import React, { useState } from 'react';
import { PRESETS, WARNING_MSG_PAYMENT } from '../constants';
import { Preset, UserState } from '../types';
import { generateStamp } from '../services/geminiService';
import { consumeCredit, saveToLibrary, initializeUser } from '../services/storageService';

interface GeneratorProps {
  user: UserState;
  refreshUser: () => void;
  setView: (v: any) => void;
}

export const Generator: React.FC<GeneratorProps> = ({ user, refreshUser, setView }) => {
  const [inputText, setInputText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleGenerate = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (user.isBlocked) {
      setErrorMsg("Sua conta está bloqueada por atividade suspeita.");
      return;
    }

    if (!inputText.trim()) {
      setErrorMsg("Por favor, digite o que você quer criar.");
      return;
    }
    if (!selectedPreset) {
      setErrorMsg("Por favor, escolha um estilo abaixo.");
      return;
    }
    if (user.credits <= 0) {
      setErrorMsg("Seus créditos de hoje acabaram. Volte amanhã!");
      return;
    }

    setIsLoading(true);

    try {
      const base64Image = await generateStamp(inputText, selectedPreset);
      
      // If success, consume credit and save
      const consumed = consumeCredit();
      if (consumed) {
        saveToLibrary({
          id: Date.now().toString(),
          data: base64Image,
          prompt: inputText,
          presetName: selectedPreset.label,
          createdAt: Date.now(),
          tags: [selectedPreset.id]
        });
        refreshUser();
        setSuccessMsg("Arte gerada com sucesso! Veja na sua Biblioteca.");
        setInputText('');
        // Optional: Auto redirect to library
        setTimeout(() => setView('library'), 2000);
      } else {
         setErrorMsg("Erro ao processar crédito.");
      }
    } catch (e: any) {
      // Display specific error if available
      setErrorMsg(e.message || "Não foi possível gerar a imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-20 p-4 max-w-lg mx-auto">
      
      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-brand-light">
        <label className="block text-xl font-bold text-gray-700 mb-3">
          O que vamos criar hoje?
        </label>
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ex: Coelhinha fofa com laço rosa, Flores de hibisco..."
          className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-brand-purple focus:ring-brand-purple outline-none h-32 resize-none placeholder-gray-400"
        />
      </div>

      {/* Presets Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-600 mb-3 px-2">Escolha o estilo (Toque para selecionar):</h3>
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all transform active:scale-95 ${
                selectedPreset?.id === preset.id 
                  ? 'border-brand-purple bg-brand-light scale-105 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-brand-purple/50'
              }`}
            >
              <i className={`fa-solid ${preset.icon} text-2xl mb-2 ${selectedPreset?.id === preset.id ? 'text-brand-purple' : 'text-gray-400'}`}></i>
              <span className={`text-xs font-bold text-center leading-tight ${selectedPreset?.id === preset.id ? 'text-brand-purple' : 'text-gray-500'}`}>
                {preset.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Warning & Action */}
      <div className="sticky bottom-4 bg-gray-50/95 backdrop-blur-sm p-2 rounded-xl border border-gray-200 shadow-xl">
        <p className="text-xs text-brand-danger font-bold text-center mb-3 bg-red-50 p-2 rounded border border-red-100">
          {WARNING_MSG_PAYMENT}
        </p>
        
        {errorMsg && (
          <div className="mb-3 bg-red-100 text-red-700 p-3 rounded-lg text-center font-bold border border-red-200 shadow-sm animate-pulse">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i>
            {errorMsg}
          </div>
        )}
         {successMsg && (
          <div className="mb-3 bg-green-100 text-green-700 p-3 rounded-lg text-center font-bold border border-green-200 shadow-sm">
            <i className="fa-solid fa-check-circle mr-2"></i>
            {successMsg}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading || user.credits <= 0}
          className={`w-full py-5 rounded-2xl text-2xl font-extrabold text-white shadow-lg transition-all ${
            isLoading || user.credits <= 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-brand-purple hover:bg-brand-dark active:scale-95'
          }`}
        >
          {isLoading ? (
            <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> Gerando...</span>
          ) : (
            <span>GERAR ARTE ({user.credits})</span>
          )}
        </button>
      </div>
    </div>
  );
};