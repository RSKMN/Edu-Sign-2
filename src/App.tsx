import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";

import { WagmiProvider, http } from "wagmi";

import { polygonMumbai, mainnet } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import WalletConnect from "./components/WalletConnect";
import FakeWallet from "./components/FakeWallet";
import CourseRecommender from "./components/CourseRecommender";

const config = getDefaultConfig({
  appName: "EduSign",
  projectId: "edusign-hackathon", // Replace with actual WalletConnect Project ID
  chains: [polygonMumbai, mainnet],
  transports: {
    [polygonMumbai.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: false,
});

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <RainbowKitProvider chains={config} theme={darkTheme()}>
          <div className="App min-h-screen w-full bg-gradient-to-tr from-indigo-900 via-slate-900 to-gray-950 text-white font-sans tracking-wide">
            {/* HEADER */}
            <header className="text-center py-12 px-4 animate-fade-in-down">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
                🎓 EduSign - NFT Badge Platform
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                Showcase, customize & recommend your educational journey using
                Blockchain and AI
              </p>
            </header>
            {/* INSTRUCTIONS */}
            <section className="max-w-4xl mx-auto mb-12 px-6">
              <div className="backdrop-blur-xl bg-white/5 rounded-xl shadow-xl border border-white/10 p-6 animate-fade-in-up transition-all hover:shadow-2xl">
                <h2 className="text-2xl font-semibold text-indigo-200 mb-3">
                  📘 How to Use EduSign
                </h2>
                <ol className="list-decimal list-inside text-slate-300 space-y-2 text-md">
                  <li>
                    <span className="text-white font-medium">
                      Connect your Wallet
                    </span>{" "}
                    to view real NFTs tied to your address.
                  </li>
                  <li>
                    <span className="text-white font-medium">
                      Try the Fake Wallet Demo
                    </span>{" "}
                    with badges like Python, Java & Web Dev. You can even mint
                    custom badges.
                  </li>
                  <li>
                    <span className="text-white font-medium">
                      Chat with EduBot
                    </span>
                    , our AI course expert that recommends paths based on your
                    NFT history.
                  </li>
                </ol>
              </div>
            </section>

            {/* REAL WALLET CONNECT */}
            <section className="max-w-3xl mx-auto mb-12 px-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-6 animate-fade-in-up shadow-md hover:shadow-xl transition-all">
                <h2 className="text-2xl text-blue-300 font-semibold mb-4">
                  🔐 Connect Your Wallet
                </h2>
                <WalletConnect />
              </div>
            </section>

            {/* FAKE WALLET */}
            <section className="max-w-7xl mx-auto mb-12 px-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-purple-300/20 p-6 animate-fade-in-up shadow-md hover:shadow-xl transition-all">
                <h2 className="text-2xl text-purple-300 font-semibold mb-4">
                  👜 EduSign Demo Wallet
                </h2>
                <FakeWallet />
              </div>
            </section>

            {/* AI RECOMMENDER */}
            <section className="max-w-5xl mx-auto mb-20 px-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-lg border border-green-300/20 p-6 animate-fade-in-up shadow-md hover:shadow-xl transition-all">
                <h2 className="text-2xl text-green-300 font-semibold mb-4">
                  🤖 EduBot - AI Course Recommender
                </h2>
                <CourseRecommender />
              </div>
            </section>

            {/* FOOTER */}
            <footer className="text-center text-xs text-gray-500 py-8 border-t border-white/10">
              &copy; {new Date().getFullYear()} EduSign • Powered by Polygon,
              Vite, RainbowKit & Groq LLM
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
