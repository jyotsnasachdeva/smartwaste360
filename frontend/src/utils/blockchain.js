export const truncateTxHash = (hash = "") => (hash.length > 18 ? `${hash.slice(0, 10)}...${hash.slice(-6)}` : hash);
