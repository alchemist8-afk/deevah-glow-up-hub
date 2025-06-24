
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdraw' | 'booking' | 'referral_earning' | 'glow_coins';
  amount: number;
  method?: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: string;
}

interface WalletContextType {
  balance: number;
  glowCoins: number;
  transactions: WalletTransaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<WalletTransaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  depositFunds: (amount: number, method: string) => Promise<{ success: boolean }>;
  withdrawFunds: (amount: number, method: string) => Promise<{ success: boolean }>;
  earnGlowCoins: (amount: number, description: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [glowCoins, setGlowCoins] = useState(50); // Welcome bonus
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTransaction = async (transactionData: Omit<WalletTransaction, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          ...transactionData
        })
        .select()
        .single();

      if (error) throw error;

      // Type assertion to ensure data matches our interface
      const typedData = data as WalletTransaction;
      setTransactions(prev => [typedData, ...prev]);

      // Update balance based on transaction type
      if (transactionData.type === 'deposit' && transactionData.status === 'completed') {
        setBalance(prev => prev + transactionData.amount);
      } else if (transactionData.type === 'withdraw' && transactionData.status === 'completed') {
        setBalance(prev => prev - transactionData.amount);
      } else if (transactionData.type === 'glow_coins') {
        setGlowCoins(prev => prev + transactionData.amount);
      }

    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Transaction Failed",
        description: "Failed to process transaction",
        variant: "destructive"
      });
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure data matches our interface
      const typedData = (data || []) as WalletTransaction[];
      setTransactions(typedData);

      // Calculate balance from transactions
      const totalDeposits = typedData.filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalWithdrawals = typedData.filter(t => t.type === 'withdraw' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalEarnings = typedData.filter(t => t.type === 'referral_earning' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

      setBalance(totalDeposits - totalWithdrawals + totalEarnings);

      const totalGlowCoins = typedData.filter(t => t.type === 'glow_coins')
        .reduce((sum, t) => sum + t.amount, 0);
      setGlowCoins(50 + totalGlowCoins); // 50 is welcome bonus

    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const depositFunds = async (amount: number, method: string) => {
    await addTransaction({
      type: 'deposit',
      amount,
      method,
      status: 'completed', // Simulating instant completion
      description: `Deposit via ${method}`
    });

    toast({
      title: "Deposit Successful!",
      description: `KSh ${amount} has been added to your wallet`
    });

    return { success: true };
  };

  const withdrawFunds = async (amount: number, method: string) => {
    if (balance < amount) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return { success: false };
    }

    await addTransaction({
      type: 'withdraw',
      amount,
      method,
      status: 'completed',
      description: `Withdrawal via ${method}`
    });

    toast({
      title: "Withdrawal Successful!",
      description: `KSh ${amount} has been withdrawn from your wallet`
    });

    return { success: true };
  };

  const earnGlowCoins = async (amount: number, description: string) => {
    await addTransaction({
      type: 'glow_coins',
      amount,
      status: 'completed',
      description
    });

    toast({
      title: "GlowCoins Earned! ✨",
      description: `You earned ${amount} GlowCoins: ${description}`
    });
  };

  return (
    <WalletContext.Provider value={{
      balance,
      glowCoins,
      transactions,
      isLoading,
      addTransaction,
      fetchTransactions,
      depositFunds,
      withdrawFunds,
      earnGlowCoins
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
