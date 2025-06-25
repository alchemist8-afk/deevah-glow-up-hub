
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdraw' | 'booking' | 'referral_earning' | 'glow_coins' | 'tip' | 'refund';
  amount: number;
  method?: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: string;
  currency?: string;
  reference_id?: string;
  payment_method_id?: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  method_type: 'mpesa' | 'bank_account' | 'card';
  account_number?: string;
  account_name?: string;
  bank_name?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

interface WalletContextType {
  balance: number;
  glowCoins: number;
  transactions: WalletTransaction[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  fetchWalletData: () => Promise<void>;
  depositFunds: (amount: number, paymentMethodId: string) => Promise<{ success: boolean }>;
  withdrawFunds: (amount: number, paymentMethodId: string) => Promise<{ success: boolean }>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  removePaymentMethod: (methodId: string) => Promise<void>;
  earnGlowCoins: (amount: number, description: string) => Promise<void>;
  tipArtist: (artistId: string, amount: number) => Promise<{ success: boolean }>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [glowCoins, setGlowCoins] = useState(50);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWalletData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch wallet balance
      const { data: walletData } = await supabase
        .from('wallet_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletData) {
        setBalance(Number(walletData.balance_ksh) || 0);
        setGlowCoins(walletData.glow_coins || 50);
      }

      // Fetch transactions
      const { data: transactionData } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (transactionData) {
        setTransactions(transactionData as WalletTransaction[]);
      }

      // Fetch payment methods
      const { data: paymentData } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (paymentData) {
        setPaymentMethods(paymentData as PaymentMethod[]);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const depositFunds = async (amount: number, paymentMethodId: string) => {
    if (!user) return { success: false };

    try {
      // Create transaction record
      const { error: txnError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount,
          status: 'completed',
          description: 'Deposit to wallet',
          currency: 'KSH',
          payment_method_id: paymentMethodId,
          reference_id: `DEP_${Date.now()}`
        });

      if (txnError) throw txnError;

      // Update wallet balance
      const { error: balanceError } = await supabase
        .from('wallet_balances')
        .upsert({
          user_id: user.id,
          balance_ksh: balance + amount,
          glow_coins: glowCoins,
          updated_at: new Date().toISOString()
        });

      if (balanceError) throw balanceError;

      await fetchWalletData();
      
      toast({
        title: "Deposit Successful!",
        description: `KSh ${amount} has been added to your wallet`
      });

      return { success: true };
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit Failed",
        description: "Unable to process deposit. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const withdrawFunds = async (amount: number, paymentMethodId: string) => {
    if (!user || balance < amount) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      // Create transaction record
      const { error: txnError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'withdraw',
          amount,
          status: 'completed',
          description: 'Withdrawal from wallet',
          currency: 'KSH',
          payment_method_id: paymentMethodId,
          reference_id: `WTH_${Date.now()}`
        });

      if (txnError) throw txnError;

      // Update wallet balance
      const { error: balanceError } = await supabase
        .from('wallet_balances')
        .upsert({
          user_id: user.id,
          balance_ksh: balance - amount,
          glow_coins: glowCoins,
          updated_at: new Date().toISOString()
        });

      if (balanceError) throw balanceError;

      await fetchWalletData();
      
      toast({
        title: "Withdrawal Successful!",
        description: `KSh ${amount} has been withdrawn from your wallet`
      });

      return { success: true };
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal Failed",
        description: "Unable to process withdrawal. Please try again.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          ...method
        });

      if (error) throw error;

      await fetchWalletData();
      
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been successfully added"
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method",
        variant: "destructive"
      });
    }
  };

  const removePaymentMethod = async (methodId: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: false })
        .eq('id', methodId);

      if (error) throw error;

      await fetchWalletData();
      
      toast({
        title: "Payment Method Removed",
        description: "Payment method has been deactivated"
      });
    } catch (error) {
      console.error('Error removing payment method:', error);
    }
  };

  const earnGlowCoins = async (amount: number, description: string) => {
    if (!user) return;

    try {
      const { error: txnError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'glow_coins',
          amount,
          status: 'completed',
          description,
          currency: 'GLOW'
        });

      if (txnError) throw txnError;

      const { error: balanceError } = await supabase
        .from('wallet_balances')
        .upsert({
          user_id: user.id,
          balance_ksh: balance,
          glow_coins: glowCoins + amount,
          updated_at: new Date().toISOString()
        });

      if (balanceError) throw balanceError;

      await fetchWalletData();
      
      toast({
        title: "GlowCoins Earned! ✨",
        description: `You earned ${amount} GlowCoins: ${description}`
      });
    } catch (error) {
      console.error('Error earning glow coins:', error);
    }
  };

  const tipArtist = async (artistId: string, amount: number) => {
    if (!user || balance < amount) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have enough balance to tip this artist",
        variant: "destructive"
      });
      return { success: false };
    }

    try {
      // Deduct from sender
      const { error: senderError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'tip',
          amount: -amount,
          status: 'completed',
          description: `Tip sent to artist`,
          currency: 'KSH'
        });

      if (senderError) throw senderError;

      // Add to artist
      const { error: artistError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: artistId,
          type: 'tip',
          amount,
          status: 'completed',
          description: `Tip received from client`,
          currency: 'KSH'
        });

      if (artistError) throw artistError;

      await fetchWalletData();
      
      toast({
        title: "Tip Sent! 💝",
        description: `You tipped KSh ${amount} to the artist`
      });

      return { success: true };
    } catch (error) {
      console.error('Tip error:', error);
      return { success: false };
    }
  };

  return (
    <WalletContext.Provider value={{
      balance,
      glowCoins,
      transactions,
      paymentMethods,
      isLoading,
      fetchWalletData,
      depositFunds,
      withdrawFunds,
      addPaymentMethod,
      removePaymentMethod,
      earnGlowCoins,
      tipArtist
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
