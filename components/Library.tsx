import React, { useEffect, useState } from 'react';
import { getLibrary, removeFromLibrary } from '../services/storageService';
import { GeneratedImage } from '../types';

export const Library: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImg, setSelectedImg] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    setImages(getLibrary());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja apagar essa estampa?")) {
      removeFromLibrary(id);
      setImages(getLibrary());
      setSelectedImg(null);
    }
  };

  const handleDownload = (img: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = img.data;
    link.download = `estampa-magica-${img.createdAt}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Minhas Estampas</h2>
      
      {images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <i className="fa-regular fa-image text-6xl text-gray-200 mb-4"></i>
          <p className="text-gray-500 text-lg">Você ainda não criou nenhuma estampa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img) => (
            <div 
              key={img.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden relative group aspect-square border border-gray-100"
              onClick={() => setSelectedImg(img)}
            >
              <img src={img.data} alt={img.prompt} className="w-full h-full object-contain p-2 bg-[url('https://www.transparenttextures.com/patterns/checkerboard-white-gray.png')]" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate text-center">
                {img.presetName}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedImg && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
          <div className="bg-white rounded-2xl p-4 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">Detalhes da Estampa</h3>
              <button onClick={() => setSelectedImg(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fa-solid fa-xmark text-2xl"></i>
              </button>
            </div>
            
            <div className="bg-[url('https://www.transparenttextures.com/patterns/checkerboard-white-gray.png')] rounded-xl overflow-hidden mb-4 border border-gray-200">
              <img src={selectedImg.data} alt="Full view" className="w-full h-auto max-h-[300px] object-contain mx-auto" />
            </div>

            <p className="text-sm text-gray-600 mb-4 italic">"{selectedImg.prompt}"</p>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleDownload(selectedImg)}
                className="bg-brand-purple text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-dark"
              >
                <i className="fa-solid fa-download"></i> Baixar
              </button>
              <button 
                onClick={() => handleDelete(selectedImg.id)}
                className="bg-red-100 text-red-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-200"
              >
                <i className="fa-solid fa-trash"></i> Apagar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};