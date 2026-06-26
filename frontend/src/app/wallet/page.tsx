import Navbar from "@/components/Navbar";
import DogWalletView from "@/components/wallet/DogWalletView";

export default function WalletPage() {
  return (
    <>
      <Navbar />
      <main>
        <DogWalletView />
      </main>
    </>
  );
}
