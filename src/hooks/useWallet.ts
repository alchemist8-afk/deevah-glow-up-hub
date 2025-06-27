
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface WalletTransaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
}

export function useWallet() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: walletData, isLoading } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('wallet_balance, glowcoins_balance')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return profile;
    },
    enabled: !!user?.id,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['wallet-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as WalletTransaction[];
    },
    enabled: !!user?.id,
  });

  const depositFunds = useMutation({
    mutationFn: async ({ amount, method }: { amount: number; method: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount,
          method,
          status: 'completed',
          description: `Deposit via ${method}`,
          currency: 'KES'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions', user?.id] });
      toast.success('Funds deposited successfully!');
    },
    onError: (error) => {
      toast.error('Failed to deposit funds: ' + error.message);
    },
  });

  const withdrawFunds = useMutation({
    mutationFn: async ({ amount, method }: { amount: number; method: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount,
          method,
          status: 'completed',
          description: `Withdrawal via ${method}`,
          currency: 'KES'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions', user?.id] });
      toast.success('Withdrawal processed successfully!');
    },
    onError: (error) => {
      toast.error('Failed to process withdrawal: ' + error.message);
    },
  });

  return {
    balance: walletData?.wallet_balance || 0,
    glowCoins: walletData?.glowcoins_balance || 0,
    transactions: transactions || [],
    isLoading: isLoading || transactionsLoading,
    depositFunds,
    withdrawFunds,
  };
}
