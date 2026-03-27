import { IReport,} from "@/app/definations/report-details";

export const reports : IReport[] = [
  {
    username: "nguyenvana",
    name: "Nguyễn Văn A",
    ELECTRIC: {
      amount_ELECTRIC: 150.5,
      img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=100&q=80"
    },
    WATER: {
      amount_WATER: 12.4,
      img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&w=100&q=80"
    },
    carbon: 45.2,
    invoice: "INV-2026-001",
    dataHash: "8f42a6b2d9e1f5c3a7b8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0",
    address_transtraction: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    date: "2026-03-20T08:30:00Z"
  },
  {
    username: "lethib",
    name: "Lê Thị B",
    ELECTRIC: {
      amount_ELECTRIC: 210.8,
      img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=100&q=80"
    },
    WATER: {
      amount_WATER: 18.0,
      img: "https://images.unsplash.com/photo-1518013394869-7080e76839aa?auto=format&fit=crop&w=100&q=80"
    },
    carbon: 68.4,
    invoice: "INV-2026-002",
    dataHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2",
    address_transtraction: "0x25451A09129f1F962402c43E5c59f24E766E3871",
    date: "2026-03-22T14:15:00Z"
  },
  {
    username: "tranvanc",
    name: "Trần Văn C",
    ELECTRIC: {
      amount_ELECTRIC: 95.2,
      img: "https://images.unsplash.com/photo-1558389186-438424b00a32?auto=format&fit=crop&w=100&q=80"
    },
    WATER: {
      amount_WATER: 8.5,
      img: "https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&fit=crop&w=100&q=80"
    },
    carbon: 29.1,
    invoice: "INV-2026-003",
    dataHash: "e5f6a7b8c9d0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6",
    address_transtraction: "0x1234567890ABCDEF1234567890ABCDEF12345678",
    date: "2026-03-25T10:00:00Z"
  }
];