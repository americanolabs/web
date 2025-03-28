import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@chakra-ui/react";
import { useStake } from "@/hooks/mutation/useStake";
import { useAccountBalance } from "@/hooks/query/useAccountBalance";

export default function DialogStake({ open, onClose, addressStaking, addressToken }) {
  const toast = useToast();
  const [amount, setAmount] = useState("");
  const { mutation } = useStake();
  const { bNormalized } = useAccountBalance({ token: addressToken });

  const setPercentage = (percentage) => {
    setAmount(((bNormalized ?? 0 * percentage) / 100).toFixed(2));
  };

  const handleStake = async (amount) => {
    try {
      await mutation.mutateAsync({
        addressStaking: addressStaking,
        amount: amount,
        decimals: 18,
      }, {
        onSuccess: () => {
          toast({
            title: "Staking Successful",
            description: `You have staked ${amount} ETH.`,
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Staking Error",
            description: `Error: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    }
    catch (error) {
      toast({
        title: "Staking Error",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stake Your ETH</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Label htmlFor="amount">Enter Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Label>Available Balance: {bNormalized ? bNormalized.toFixed(2) : "Loading..."}</Label>
          <div className="flex space-x-2">
            {[25, 50, 75, 100].map((percentage) => (
              <Button key={percentage} variant="outline" onClick={() => setPercentage(percentage)}>
                {percentage}%
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => handleStake(amount)}>Stake</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}