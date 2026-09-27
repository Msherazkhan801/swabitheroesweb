# 🩸 Swabi Heroes Web Portal & Admin Dashboard (صوابۍ وینه بخښونکي)

Official Next.js Web Portal and Real-Time Admin Dashboard for the **Swabi Heroes Blood Donation Network**, connecting volunteer blood donors with emergency patients across Swabi, Topi, Razzar, and Chota Lahor.

---

## ⚡ Features & Capabilities

### 🌐 1. Public Web Portal
- **Live SOS Ticker**: Real-time ticker of urgent blood cases in Swabi with 1-click Contact & WhatsApp.
- **Instant Donor Finder**: Search and filter by all 8 Blood Groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`), 4 Tehsils, and Availability.
- **Direct 1-Click WhatsApp & Call**: Instantly contact donors with pre-filled blood appeal messages.
- **Post Emergency SOS Appeal**: Attendants and citizens can submit urgent blood requests directly to the network.
- **Volunteer Donor Registration**: Seamless registration form for local heroes with instant verification.
- **Swabi Hospital & 1122 Directory**: Full emergency numbers and Google Maps routes for BKMC Shahmansoor, DHQ Swabi, THQ Topi, THQ Chota Lahor, THQ Kalu Khan, and Rescue 1122.

### 🔐 2. Admin Management Dashboard (`/admin`)
- **Protected Access**: Secure PIN / Passcode login (`swabiadmin` or `swabiheroes2026`).
- **Live Real-time Sync**: Direct two-way sync with the mobile app database via Cloud Firestore.
- **Donor Management**:
  - Add, Edit, Delete donors.
  - 1-Click toggle Availability (Available ⟷ Busy).
  - 1-Click toggle Verified Hero Badge (Blue Checkmark).
  - Search by Name, Contact, Tehsil, and Village.
  - **Export to CSV**: 1-click export of donor records for medical camps and emergency response.
- **Emergency SOS Request Management**:
  - Edit patient cases, change required blood units, hospital, or contact details.
  - Change Status (`ACTIVE` ⟷ `FULFILLED` ⟷ `CANCELLED`).
  - Delete old or spam requests.
- **1-Click WhatsApp Broadcast Generator**:
  - Generates pre-formatted Pashto/English emergency blood appeals ready for family and village WhatsApp groups.
- **Synced App Users Directory**:
  - View all registered mobile app profiles, delete spam accounts, and monitor community growth.

---

## 🚀 Getting Started

### 1. Run Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Admin Portal:
Navigate to: [http://localhost:3000/admin](http://localhost:3000/admin)  
Default Passcodes: `swabiadmin` or `swabiheroes2026`

### 3. Build for Production:
```bash
npm run build
npm start
```

---

## 📦 Push to Your New GitHub Repository

To push this web project to your new GitHub repository:

```bash
git add .
git commit -m "Initial commit of Swabi Heroes Next.js Web Portal & Admin Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_NEW_REPO.git
git push -u origin main
```
