// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CarbonStorage {
    
    event CarbonReportLogged(address indexed user, uint256 carbonAmount, string dataHash, uint256 timestamp);

    /**
     * @dev Hàm duy nhất để đẩy dữ liệu lên Blockchain
     * @param _carbonAmount: Lượng carbon (Ví dụ: 10.55kg -> gửi 1055)
     * @param _dataHash: Chuỗi SHA-256 từ Backend
     */
    function pushReport(uint256 _carbonAmount, string memory _dataHash) public {
        // Phát sự kiện để Backend bắt được Transaction Hash và lưu vào DB
        emit CarbonReportLogged(msg.sender, _carbonAmount, _dataHash, block.timestamp);
    }
}