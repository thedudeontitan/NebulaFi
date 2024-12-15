import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mantleSepoliaTestnet } from "@reown/appkit/networks";

export const projectId = "f69e5f26076ee35e044fbb381ad8419e";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [mantleSepoliaTestnet];

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
