
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'transfer_in' | 'transfer_out';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletContextType {
  transactions: Transaction[];
  addGlowCoins: (amount: number, description: string) => void;
  spendGlowCoins: (amount: number, description: string) => boolean;
  transferGlowCoins: (toUserId: string, amount: number, description: string) => boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user, updateUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earn',
      amount: 50,
      description: 'Welcome bonus',
      date: new Date().toISOString(),
      status: 'completed'
    }
  ]);

  const addGlowCoins = (amount: number, description: string) => {
    if (!user) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'earn',
      amount,
      description,
      date: new Date().toISOString(),
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    updateUser({ glowCoins: (user.glowCoins || 0) + amount });
  };

  const spendGlowCoins = (amount: number, description: string): boolean => {
    if (!user || (user.glowCoins || 0) < amount) return false;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'spend',
      amount,
      description,
      date: new Date().toISOString(),
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    updateUser({ glowCoins: (user.glowCoins || 0) - amount });
    return true;
  };

  const transferGlowCoins = (toUserId: string, amount: number, description: string): boolean => {
    if (!user || (user.glowCoins || 0) < amount) return false;

    const outTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'transfer_out',
      amount,
      description: `Transfer to ${toUserId}: ${description}`,
      date: new Date().toISOString(),
      status: 'completed'
    };

    setTransactions(prev => [outTransaction, ...prev]);
    updateUser({ glowCoins: (user.glowCoins || 0) - amount });
    return true;
  };

  return (
    <WalletContext.Provider value={{
      transactions,
      addGlowCoins,
      spendGlowCoins,
      transferGlowCoins
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
