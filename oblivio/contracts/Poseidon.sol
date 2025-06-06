// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Poseidon {
    uint256 constant p = 2305843009213693951;
    uint256 constant t = 3;
    uint8 constant R_F = 8;

    uint256[3][8] C = [
        [1035877775359363211, 114610226876961864, 402157255886774874],
        [622702340184474369, 407020973278049070, 1212249433457494519],
        [1471369203540053884, 1630745016547415807, 1010082461931488392],
        [1891862948424927369, 316119487078114298, 1015311422641820260],
        [1738916571493971749, 1050138187177962873, 128975987894424254],
        [2215280600441060316, 1215408836689658627, 1673313926929876921],
        [1657384738266971743, 1064307690050693951, 1571554070845159603],
        [1978387821168787521, 1256432956485023137, 719471592682115217]
    ];

    uint256[3][3] M = [
        [406782389491464554, 830211630238712958, 1271127807932936050],
        [394297971475724834, 1121083019499134616, 628125631908486231],
        [1257544348879064326, 367787734050709101, 1041072984979733041]
    ];

    function poseidon(uint256 x, uint256 y) public view returns (uint256) {
        uint256[3] memory state = [x % p, y % p, uint256(0)];

        for (uint8 r = 0; r < R_F; r++) {
            // Add round constants
            for (uint8 i = 0; i < t; i++) {
                state[i] = addmod(state[i], C[r][i], p);
            }

            // Apply S-box (x^5 mod p)
            for (uint8 i = 0; i < t; i++) {
                state[i] = exp5mod(state[i]);
            }

            // Mix layer: MDS matrix multiplication
            uint256[3] memory newState;
            for (uint8 i = 0; i < t; i++) {
                newState[i] = 0;
                for (uint8 j = 0; j < t; j++) {
                    newState[i] = addmod(newState[i], mulmod(M[i][j], state[j], p), p);
                }
            }
            state = newState;
        }

        return state[0];
    }

    function exp5mod(uint256 base) internal pure returns (uint256) {
        uint256 sq = mulmod(base, base, p); // base^2
        uint256 quad = mulmod(sq, sq, p);    // base^4
        return mulmod(base, quad, p);        // base^5
    }
}
