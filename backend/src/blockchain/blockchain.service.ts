import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;
  private readonly ABI = ['function pushReport(string _dataHash) public'];

  constructor(private configService: ConfigService) {
    // 1. Kết nối tới mạng Blockchain
    this.provider = new ethers.JsonRpcProvider(this.configService.get('NETWORK_BLOCKCHAIN'));

    // 2. Thiết lập ví để ký giao dịch
    this.wallet = new ethers.Wallet(this.configService.get<string>('PRIVATE_KEY_BLOCKCHAIN')!, this.provider);

    // 3. Kết nối tới Smart Contract
    this.contract = new ethers.Contract(this.configService.get<string>('CONTRACT_ADDRESS')!, this.ABI, this.wallet);
  }

  async pushHashToChain(hashValue: string) {
    try {
      // Đảm bảo hashValue là một string hợp lệ
      // Nếu hashValue đã là SHA256 từ backend, cứ để nguyên string
      const tx = await this.contract.pushReport(hashValue);

      console.log('Đang chờ xác nhận giao dịch...');
      const receipt = await tx.wait();

      console.log('Giao dịch thành công! TxHash:', receipt.hash);
      return receipt.hash;
    } catch (error) {
      // Lỗi phổ biến: "execution reverted: Ownable: caller is not the owner"
      console.error('Lỗi khi đẩy lên Blockchain:', error.message);
      throw error;
    }
  }
}
