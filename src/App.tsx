import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";

const WalletConnect: React.FC = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("0");
  const [side, setSide] = useState<"heads" | "tails">("heads");
  const [result, setResult] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        setError(
          "Please install MetaMask or another Ethereum wallet extension."
        );
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);

      setBalance(ethers.formatEther(balance));
      setIsConnected(true);
      setError(null);
    } catch (error) {
      setError("Failed to connect to wallet. Please try again.");
      console.error(error);
    }
  };

  const flipCoin = async () => {
    if (!isConnected) {
      setError("Wallet not connected.");
      return;
    }

    try {
      const random = Math.random() < 0.5 ? "heads" : "tails";
      const win = random === side;
      const winAmount = win ? parseFloat(amount) * 2 : 0;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = {
        to: await signer.getAddress(), // Sending to the same address for simplicity
        value: ethers.parseEther(winAmount.toString()), // Amount to send
      };

      // Execute the transaction
      const txResponse = await signer.sendTransaction(tx);
      console.log("Transaction hash:", txResponse.hash);
      await txResponse.wait();
      console.log("Transaction confirmed!");

      setResult(
        win ? `You win! Your new balance: ${winAmount} ETH` : "You lost!"
      );
    } catch (error) {
      setError("Failed to flip coin. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} className="connect-btn">
        {isConnected ? "Wallet Connected" : "Connect Wallet"}
      </button>
      {isConnected && (
        <div className="flip-container">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to risk"
          />
          <select
            onChange={(e) => setSide(e.target.value as "heads" | "tails")}
          >
            <option value="heads">Heads</option>
            <option value="tails">Tails</option>
          </select>
          <button onClick={flipCoin} className="flip-btn">
            Flip Coin
          </button>
        </div>
      )}
      {balance && <p className="balance">Balance: {balance} ETH</p>}
      {result && <p className="result">{result}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default WalletConnect;
