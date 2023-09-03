// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "forge-std/Test.sol";

import "src/interfaces/IArraySort.sol";

contract ArraySortTestBase is Test {
    IArraySort internal arraySort;

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
        arraySort = IArraySort(deploy());
    }

    function test_s01e05_sanity() public {
        uint256[] memory arr = new uint256[](5);
        arr[0] = 9;
        arr[1] = 2;
        arr[2] = 7;
        arr[3] = 0;
        arr[4] = 5;

        assertEq(arraySort.arraySort(arr), _sort(arr));
    }

    function test_s01e05_fuzz(uint256 length) public {
        length = bound(length, 2, 32);

        uint256[] memory arr = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            arr[i] = uint256(keccak256(abi.encodePacked(block.timestamp, i))) % 2 ** 16;
        }

        // copy array to avoid mutating it
        uint256[] memory arr2 = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            arr2[i] = arr[i];
        }

        assertEq(_sort(arr), arraySort.arraySort(arr2));
    }

    function test_s01e05_gas(uint256 length) public {
        length = bound(length, 16, 20);

        uint256[] memory arr = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            arr[i] = uint256(keccak256(abi.encodePacked(block.timestamp, i))) % 2 ** 16;
        }

        arraySort.arraySort(arr);
    }

    function test_s01e05_size() public {
        console2.log("Contract size:", address(arraySort).code.length);
        assertLt(address(arraySort).code.length, 10000, "!codesize");
    }

    function _sort(uint256[] memory arr) internal pure returns (uint256[] memory) {
        uint256 n = arr.length;
        bool swapped;

        for (uint256 i = 0; i < n - 1; i++) {
            swapped = false;

            for (uint256 j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    (arr[j], arr[j + 1]) = (arr[j + 1], arr[j]); // Swap the elements
                    swapped = true;
                }
            }

            if (!swapped) {
                break; // If no two elements were swapped, the array is already sorted
            }
        }

        return arr;
    }
}
