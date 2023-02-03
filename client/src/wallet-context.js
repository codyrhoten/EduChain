import { createContext, useContext, useState } from 'react';

const WalletContexts = createContext();

export function WalletProvider({ children }) {
    const [isLocked, setWalletStatus] = useState(true);

    function changeWalletState(walletState) { 
        setWalletStatus(walletState); 
    }

    const contextValues = { isLocked, changeWalletState };

    return (
        <WalletContexts.Provider value={contextValues}>
            {children}
        </WalletContexts.Provider>
    );
}

export function useWallet() {
    return useContext(WalletContexts)
}