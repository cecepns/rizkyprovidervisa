# Backend RizkyProviderVisa

## Setup Database

1. Import database schema:
```bash
mysql -u root -p < database.sql
```

Atau masuk ke MySQL dan jalankan:
```sql
source database.sql;
```

### Migrations

Untuk update terbaru (penambahan kolom `flag` pada tabel `countries`), jalankan migrasi manual berikut di MySQL:

```sql
ALTER TABLE countries ADD COLUMN flag VARCHAR(50) NULL AFTER code;
```

Perintah di atas aman dijalankan sekali. Abaikan jika kolom sudah ada.

## Install Dependencies

```bash
npm install
```

## Configuration

Edit file `.env` sesuai dengan konfigurasi MySQL Anda:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=rizkyprovidervisa
```

## Default Admin Login

Username: `admin`
Password: `admin123`

Note: Password di database sudah di-hash. Untuk login pertama kali, Anda perlu mengubah hash password di database atau membuat user baru.

Untuk membuat hash password baru:
```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

## Run Server

```bash
node server.js
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login admin

### Countries
- GET `/api/countries` - Get all countries
- GET `/api/countries/:id` - Get country by ID
- POST `/api/countries` - Create country (auth required)
- PUT `/api/countries/:id` - Update country (auth required)
- DELETE `/api/countries/:id` - Delete country (auth required)

### Visa Types
- GET `/api/visa-types?country_id=X` - Get visa types by country
- POST `/api/visa-types` - Create visa type (auth required)
- PUT `/api/visa-types/:id` - Update visa type (auth required)
- DELETE `/api/visa-types/:id` - Delete visa type (auth required)

### Visa Categories
- GET `/api/visa-categories?visa_type_id=X` - Get visa categories
- POST `/api/visa-categories` - Create visa category (auth required)
- PUT `/api/visa-categories/:id` - Update visa category (auth required)
- DELETE `/api/visa-categories/:id` - Delete visa category (auth required)

### Visa Details
- GET `/api/visa-details?visa_category_id=X` - Get visa details
- POST `/api/visa-details` - Create visa detail (auth required)
- PUT `/api/visa-details/:id` - Update visa detail (auth required)
- DELETE `/api/visa-details/:id` - Delete visa detail (auth required)

### Settings
- GET `/api/settings` - Get all settings
- PUT `/api/settings` - Update settings (auth required)

### Dashboard
- GET `/api/dashboard/stats` - Get statistics (auth required)
