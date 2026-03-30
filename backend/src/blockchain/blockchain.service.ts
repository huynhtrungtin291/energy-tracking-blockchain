import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';

type PushReportContract = ethers.BaseContract & {
  pushReport(hashValue: string): Promise<ethers.ContractTransactionResponse>;
};

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: PushReportContract;
  private readonly ABI = ['function pushReport(string _dataHash) public'];

  constructor(private configService: ConfigService) {
    // 1. Kết nối tới mạng Blockchain
    this.provider = new ethers.JsonRpcProvider(this.configService.get('NETWORK_BLOCKCHAIN'));

    // 2. Thiết lập ví để ký giao dịch
    this.wallet = new ethers.Wallet(this.configService.get<string>('PRIVATE_KEY_BLOCKCHAIN')!, this.provider);

    // 3. Kết nối tới Smart Contract
    this.contract = new ethers.Contract(this.configService.get<string>('CONTRACT_ADDRESS')!, this.ABI, this.wallet) as unknown as PushReportContract;
  }

  async pushHashToChain(hashValue: string): Promise<string> {
    try {
      // Đảm bảo hashValue là một string hợp lệ
      // Nếu hashValue đã là SHA256 từ backend, cứ để nguyên string
      const tx = await this.contract.pushReport(hashValue);

      console.log('Đang chờ xác nhận giao dịch...');
      const receipt = await tx.wait();
      const txHash = receipt?.hash ?? tx.hash;

      console.log('Giao dịch thành công! TxHash:', txHash);
      return txHash;
    } catch (error: unknown) {
      // Lỗi phổ biến: "execution reverted: Ownable: caller is not the owner"
      const message = error instanceof Error ? error.message : 'Unknown blockchain error';
      console.error('Lỗi khi đẩy lên Blockchain:', message);
      throw error;
    }
  }
}
