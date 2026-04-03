# Energy Tracking Blockchain

This project tracks and manages energy/carbon reports, and includes 3 main parts:

- Backend API (NestJS)
- Frontend web app (Next.js)
- Smart contracts and deployment (Hardhat)

## Project Structure

```text
energy-tracking-blockchain/
|- backend/                     # API server (NestJS)
|- frontend/client-blockchain/  # Web client (Next.js)
|- hardhat/                     # Smart contracts + deployment scripts
```

## Team Assignment

The information below shows team ownership by module.

### Backend (backend/)

- Trung Tin (huynhtrungtin2912004@gmail.com)

### Frontend (frontend/client-blockchain/)

- mtrideveloper (unitydev2d@gmail.com)
- dntvip (dntienktpm2211046@student.ctuet.edu.vn)
- dntvip (emailcuaban@example.com)

### Hardhat (hardhat/)

- dntvip (dntienktpm2211046@student.ctuet.edu.vn)
- dntvip (emailcuaban@example.com)

## Web Features (Frontend)

- User account login.
- Change password.
- Create new account (admin screen).
- Create energy consumption reports (electricity, water) and calculate carbon.
- View list of created reports by user.
- Report list pagination.
- Preview electricity/water invoices directly in the UI.
- Display blockchain information for each report (data hash, transaction ID).
- Export report data to Excel (XLSX).

## Environment Requirements

- Node.js 20+ (recommended)
- npm

## How To Run Each Module

### 1) Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

Other commands:

```bash
npm run build
npm run lint
npm run test
```

### 2) Frontend (Next.js)

```bash
cd frontend/client-blockchain
npm install
npm run dev
```

By default, the frontend runs on port `4002`.

### 3) Hardhat (Contracts)

```bash
cd hardhat
npm install
npx hardhat test
```
