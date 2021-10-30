// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract ERC721TTL is AccessControlEnumerable, ERC721 {
    uint256 public immutable ttl;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 ttl_
    ) ERC721(name_, symbol_) {
        ttl = ttl_;
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function destroy() public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "ERC721TTL: must have admin role to destroy"
        );
        require(
            block.timestamp > ttl,
            "ERC721TTL: can only destroy after TTL expires"
        );

        selfdestruct(payable(msg.sender));
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
