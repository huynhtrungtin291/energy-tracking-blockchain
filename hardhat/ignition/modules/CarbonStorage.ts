import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CarbonStorageModule", (m) => {
  const carbonStorage = m.contract("CarbonStorage");
  // Nếu muốn gọi hàm pushReport sau khi deploy, có thể thêm dòng sau:
  // m.call(carbonStorage, "pushReport", [1000n, "exampleHash"]);
  return { carbonStorage };
});
