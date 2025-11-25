import React from 'react';
import { UserState } from '../types';
import { PREMIUM_PRICE, DAILY_CREDITS } from '../constants';

interface ProfileProps {
  user: UserState;
}

export const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center border-t-8 border-brand-purple">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Seus Créditos</h2>
        <div className="text-6xl font-black text-brand-purple mb-2">
          {user.credits}
        </div>
        <p className="text-gray-500 font-medium uppercase tracking-wide">Disponíveis hoje</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Minhas Estatísticas</h3>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600 font-medium">Status da Conta:</span>
          <span className={`font-bold px-3 py-1 rounded-full text-sm ${user.isPremium ? 'bg-brand-warning text-black' : 'bg-gray-200 text-gray-600'}`}>
            {user.isPremium ? 'PREMIUM 👑' : 'GRATUITO'}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600 font-medium">Total Gerado:</span>
          <span className="font-bold text-brand-purple">{user.totalGenerated} artes</span>
        </div>

        <div className="flex justify-between items-center">
           <span className="text-gray-600 font-medium">Próxima Recarga:</span>
           <span className="font-bold text-brand-purple">00:00h</span>
        </div>
      </div>

      {!user.isPremium && (
        <div className="bg-gradient-to-r from-brand-purple to-brand-dark rounded-2xl shadow-xl p-6 text-white text-center">
          <div className="bg-brand-warning text-brand-dark font-bold inline-block px-3 py-1 rounded-full text-xs mb-3">
            OFERTA ESPECIAL
          </div>
          <h3 className="text-2xl font-extrabold mb-2">Seja PREMIUM</h3>
          <p className="mb-6 text-white/90">
            Libere 30 gerações por dia, prioridade na fila e remova os avisos de bloqueio.
          </p>
          
          <div className="bg-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm border border-white/20">
            <p className="text-sm mb-1">Pagamento Único (Mensal)</p>
            <p className="text-4xl font-black text-brand-warning">{PREMIUM_PRICE}</p>
          </div>

          <button className="w-full bg-brand-warning text-brand-dark font-black py-4 rounded-xl text-xl hover:bg-yellow-300 transition-colors shadow-lg">
            QUERO SER PREMIUM
          </button>
          
          <p className="text-xs mt-4 text-white/60">
            Envie o comprovante para liberação imediata.
          </p>
        </div>
      )}
    </div>
  );
};