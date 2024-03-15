// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "forge-std/Test.sol";
import "src/interfaces/IModInv.sol";

contract ModInvTestBase is Test {
    IModInv internal modInv;

    // prime number defining the finite field for secp256k1
    uint256 constant p = 2 ** 256 - 2 ** 32 - 977;

    function deploy() internal virtual returns (address addr) {
        // first: get the bytecode from the environment if it exists
        bytes memory empty = new bytes(0);
        bytes memory bytecode = vm.envOr("BYTECODE", empty);

        if (bytecode.length > 0) {
            assembly {
                addr := create(0, add(bytecode, 0x20), mload(bytecode))
            }
            return addr;
        }
    }

    function setUp() public {
        modInv = IModInv(deploy());
    }

    function test_s01e08_sanity() public {
        assertEq(modInv.modInv(3, 11), 4);
        assertEq(modInv.modInv(3, 13), 9);
        assertEq(modInv.modInv(3, p), _modInv(3, p));
    }

    function test_s01e08_fuzz(uint256 a, uint256 m) public {
        // a and m must be coprime
        vm.assume(_gcd(a, m) == 1);
        vm.assume(m > a && m < 100_000_000 && a > 0 && m > 0);

        assertEq(modInv.modInv(a, m), _modInv(a, m));
    }

    function test_s01e08_gas(uint256 a, uint256 m) public {
        vm.pauseGasMetering();

        // a and m must be coprime
        vm.assume(_gcd(a, m) == 1);
        vm.assume(m > a && m < 100_000_000 && a > 0 && m > 0);

        vm.resumeGasMetering();

        modInv.modInv(a, m);
    }

    function test_s01e08_size() public {
        console2.log("Contract size:", address(modInv).code.length);
    }

    /// @dev Calculates the modular multiplicative inverse of a modulo m.
    /// @dev source: https://github.com/witnet/elliptic-curve-solidity/
    /// @param a The number to find the inverse for.
    /// @param m The modulus.
    /// @return The modular multiplicative inverse of a modulo m.
    function _modInv(uint256 a, uint256 m) internal pure returns (uint256) {
        uint256 t = 0;
        uint256 newT = 1;
        uint256 r = m;
        uint256 newR = a;

        while (newR != 0) {
            uint256 quotient = r / newR;

            // convert negative number to positive by adding m
            (t, newT) = (newT, addmod(t, (m - mulmod(quotient, newT, m)), m));

            (r, newR) = (newR, r - quotient * newR);
        }

        return t;
    }

    /// @dev Returns greatest common divisor of `x` and `y`.
    function _gcd(uint256 x, uint256 y) internal pure returns (uint256 z) {
        /// @solidity memory-safe-assembly
        assembly {
            for { z := x } y {} {
                let t := y
                y := mod(z, y)
                z := t
            }
        }
    }
}
