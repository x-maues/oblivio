function decimalToPaddedHex(decimal) {
    // Convert decimal to hex and remove '0x' prefix
    let hex = decimal.toString(16);
    
    // Pad with zeros to make it 64 characters (32 bytes)
    while (hex.length < 64) {
        hex = '0' + hex;
    }
    
    // Add '0x' prefix
    return '0x' + hex;
}

// Example usage:
const poseidonOutput = 1878035392754142851;
const paddedHex = decimalToPaddedHex(poseidonOutput);
console.log('Original decimal:', poseidonOutput);
console.log('Padded hex for Remix:', paddedHex);