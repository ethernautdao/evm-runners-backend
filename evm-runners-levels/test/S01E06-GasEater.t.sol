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
        // check gas usage
        uint256 gasBefore = gasleft();
        gasEater.eatGas();
        uint256 gasAfter = gasleft();
        console2.log("Gas used for 'eatGas':", gasBefore - gasAfter - 5009);
        assertEq(gasBefore - gasAfter - 5009, 719);

        // check gas usage
        gasBefore = gasleft();
        gasEater.eatMoreGas();
        gasAfter = gasleft();
        console2.log("Gas used for 'eatMoreGas':", gasBefore - gasAfter - 503);
        assertEq(gasBefore - gasAfter - 503, 65537);

        // check gas usage
        gasBefore = gasleft();
        gasEater.eatEvenMoreGas();
        gasAfter = gasleft();
        console2.log("Gas used for 'eatEvenMoreGas':", gasBefore - gasAfter - 500);
        assertEq(gasBefore - gasAfter - 500, 15_485_863);
    }

    /// forge-config: default.fuzz.runs = 1
    function test_s01e06_gas(uint256 val) public {
        gasEater.eatGas();
        gasEater.eatMoreGas();
        gasEater.eatEvenMoreGas();
    }

    function test_s01e06_size() public {
        console2.log("Contract size:", address(gasEater).code.length);
    }
}
