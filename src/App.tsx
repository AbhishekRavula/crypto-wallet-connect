import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";

const WalletConnect: React.FC = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

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

  return (
    <div>
      <button onClick={connectWallet} className="connect-btn">
        {isConnected ? "Wallet Connected" : "Connect Wallet"}
      </button>
      {balance && <p className="balance">Balance: {balance} ETH</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default WalletConnect;
