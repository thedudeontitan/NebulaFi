// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NebulaPerpetualDEX is ReentrancyGuard {
    struct Position {
        address trader;
        uint256 size;
        uint256 margin;
        uint256 leverage;
        uint256 entryPrice;
        bool isLong;
        bool isOpen;
    }

    struct PriceData {
        bytes32 market;
        uint256 price;
        uint256 timestamp;
    }

    struct PositionVars {
        uint256 margin;
        uint256 fee;
        uint256 price;
        uint256 mntPrice;
    }

    // Constants
    uint256 public constant MAX_LEVERAGE = 10;
    uint256 public constant TRADING_FEE = 10; // 0.1% fee
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant PRICE_TIMEOUT = 60;

    // Market constants
    bytes32 public constant MNT_MARKET = "MNT";
    bytes32 public constant BTC_MARKET = "BTC";
    bytes32 public constant ETH_MARKET = "ETH";
    bytes32 public constant SOL_MARKET = "SOL";

    // State variables
    mapping(bytes32 => bool) public supportedMarkets;
    mapping(address => mapping(bytes32 => Position[])) public positions;

    event PositionOpened(
        address indexed trader,
        bytes32 indexed market,
        uint256 size,
        uint256 margin,
        uint256 leverage,
        bool isLong,
        uint256 entryPrice
    );

    event PositionClosed(
        address indexed trader,
        bytes32 indexed market,
        uint256 indexed positionId,
        uint256 pnl,
        uint256 exitPrice
    );

    constructor() {
        supportedMarkets[ETH_MARKET] = true;
        supportedMarkets[BTC_MARKET] = true;
        supportedMarkets[SOL_MARKET] = true;
        supportedMarkets[MNT_MARKET] = true;
    }

    function _getPrice(
        bytes32 market,
        PriceData[] calldata priceData
    ) internal view returns (uint256) {
        for (uint i = 0; i < priceData.length; i++) {
            if (priceData[i].market == market) {
                require(
                    priceData[i].timestamp + PRICE_TIMEOUT >= block.timestamp,
                    "Price too old"
                );
                require(priceData[i].price > 0, "Invalid price");
                return priceData[i].price;
            }
        }
        revert("Price not found");
    }

    function openPosition(
        bytes32 market,
        uint256 size,
        uint256 leverage,
        bool isLong,
        PriceData[] calldata priceData
    ) external payable nonReentrant {
        require(supportedMarkets[market], "Market not supported");
        require(leverage > 0 && leverage <= MAX_LEVERAGE, "Invalid leverage");

        PositionVars memory vars;
        vars.price = _getPrice(market, priceData);
        vars.mntPrice = _getPrice(MNT_MARKET, priceData);

        // Calculate margin in MNT
        vars.margin = (size * 1e8) / (leverage * vars.mntPrice);
        vars.fee =
            (((size * TRADING_FEE) / BASIS_POINTS) * 1e8) /
            vars.mntPrice;

        require(msg.value >= vars.margin + vars.fee, "Insufficient MNT");

        positions[msg.sender][market].push(
            Position({
                trader: msg.sender,
                size: size,
                margin: vars.margin,
                leverage: leverage,
                entryPrice: vars.price,
                isLong: isLong,
                isOpen: true
            })
        );

        emit PositionOpened(
            msg.sender,
            market,
            size,
            vars.margin,
            leverage,
            isLong,
            vars.price
        );

        uint256 excess = msg.value - (vars.margin + vars.fee);
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
    }

    function closePosition(
        bytes32 market,
        uint256 positionId,
        PriceData[] calldata priceData
    ) external nonReentrant {
        require(
            positionId < positions[msg.sender][market].length,
            "Invalid position"
        );
        Position storage position = positions[msg.sender][market][positionId];
        require(position.isOpen, "Position closed");
        require(position.trader == msg.sender, "Not owner");

        uint256 exitPrice = _getPrice(market, priceData);
        uint256 mntPrice = _getPrice(MNT_MARKET, priceData);

        uint256 pnlUsd = calculatePnL(position, exitPrice);
        uint256 pnlMnt = (pnlUsd * 1e8) / mntPrice;

        position.isOpen = false;
        payable(msg.sender).transfer(pnlMnt);

        emit PositionClosed(msg.sender, market, positionId, pnlMnt, exitPrice);
    }

    function calculatePnL(
        Position memory position,
        uint256 currentPrice
    ) public pure returns (uint256) {
        if (position.isLong) {
            return
                currentPrice > position.entryPrice
                    ? (position.size * (currentPrice - position.entryPrice)) /
                        position.entryPrice /
                        position.leverage
                    : (position.size * (position.entryPrice - currentPrice)) /
                        position.entryPrice /
                        position.leverage;
        } else {
            return
                currentPrice < position.entryPrice
                    ? (position.size * (position.entryPrice - currentPrice)) /
                        position.entryPrice /
                        position.leverage
                    : (position.size * (currentPrice - position.entryPrice)) /
                        position.entryPrice /
                        position.leverage;
        }
    }

    receive() external payable {}
}
