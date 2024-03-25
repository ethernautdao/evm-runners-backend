// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "forge-std/Test.sol";
import "src/interfaces/IGasEater.sol";

contract GasEaterTestBase is Test {
    IGasEater internal gasEater;

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
        gasEater = IGasEater(deploy());
    }

    function test_s01e06_sanity() public {
        uint256 gasBefore;
        uint256 gasAfter;
        address addr = address(gasEater);

        assembly {
            pop(call(gas(), addr, 0, 0, 0, 0, 0))
        }

        assembly {
            mstore(0x00, 0x83f157b1) // Start at 0x1c (28), this is the first calldata entry.     v -> 0x1c
            // 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 83 f1 57 b1
            gasBefore := gas()
            pop(call(gas(), addr, 0, 0x1c, 0x04, 0, 0))
            gasAfter := gas()
        }
        console2.log("Gas used for 'eatGas':", gasBefore - gasAfter - 129);
        console2.log("Gas target for 'eatGas':", uint256(719));
        int256 gasMismatch = int256(gasBefore) -
            int256(gasAfter) -
            int256(129) -
            int256(719);
        console2.log("Gas mismatch:", gasMismatch);
        assertEq(gasMismatch, 0);

        // empty line
        console2.log("");

        assembly {
            mstore(0x00, 0x651f221d)
            gasBefore := gas()
            pop(call(gas(), addr, 0, 0x1c, 0x04, 0, 0))
            gasAfter := gas()
        }
        console2.log("Gas used for 'eatMoreGas':", gasBefore - gasAfter - 129);
        console2.log("Gas target for 'eatMoreGas':", uint256(65537));
        gasMismatch =
            int256(gasBefore) -
            int256(gasAfter) -
            int256(129) -
            int256(65537);
        console2.log("Gas mismatch:", gasMismatch);
        assertEq(gasMismatch, 0);

        // empty line
        console2.log("");

        assembly {
            mstore(0x00, 0x1bf13571)
            gasBefore := gas()
            pop(call(gas(), addr, 0, 0x1c, 0x04, 0, 0))
            gasAfter := gas()
        }
        console2.log(
            "Gas used for 'eatEvenMoreGas':",
            gasBefore - gasAfter - 129
        );
        console2.log("Gas target for 'eatEvenMoreGas':", uint256(15_485_863));
        gasMismatch =
            int256(gasBefore) -
            int256(gasAfter) -
            int256(129) -
            int256(15_485_863);
        console2.log("Gas mismatch:", gasMismatch);
        assertEq(gasMismatch, 0);
    }

    /// Just because the backend expects 4 tests
    function test_s01e06_fuzz(uint256 val) public {}

    function test_s01e06_gas(uint256 val) public {
        address addr = address(gasEater);

        assembly {
            mstore(0x00, 0x83f157b1)
            pop(call(gas(), addr, 0, 0x1c, 0x04, 0, 0))
            mstore(0x00, 0x651f221d)
            pop(call(gas(), addr, 0, 0x1c, 0x04, 0, 0))
            mstore(0x00, 0x1bf13571)
            pop(call(gas(), addr, 0, 0x1c, 0x04, 0, 0))
        }
    }

    function test_s01e06_size() public {
        console2.log("Contract size:", address(gasEater).code.length);
    }
}
