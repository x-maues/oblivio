// Simple function to convert a number to bytes32 hex string
function toBytes32(num) {
    // Convert to hex and remove '0x' if present
    let hex = num.toString(16);
    if (hex.startsWith('0x')) {
        hex = hex.slice(2);
    }
    
    // Pad with zeros to 64 characters
    while (hex.length < 64) {
        hex = '0' + hex;
    }
    
    // Add '0x' prefix
    return '0x' + hex;
}

// Example usage
const num = 1234567890;
const bytes32Hex = toBytes32(num);
console.log('Input number:', num);
console.log('Bytes32 hex:', bytes32Hex); 