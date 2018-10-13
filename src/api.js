export default (apiUrl) => {
  apiUrl = apiUrl || 'http://localhost:5005/core';
  return {
    getBalance: async address => {
      console.log(address);
      const response = await fetch(`${apiUrl}/getbalance/${address}`);
      const balance = await response.text();
      return Number(balance);
    },
    addresses: async () => {
      const response = await fetch(`${apiUrl}/addresses`);
      const addresses = await response.json();
      return addresses;
    },
    wallet: async () => {
      const response = await fetch(`${apiUrl}/wallet`);
      const wallet = await response.text();
      return wallet;
    }
  }
}
