# 安裝指南

請確保您的電腦已安裝以下程式：
- [Node.js](https://nodejs.org/en)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

## 👨🏻‍💻 後端 

本部分的動作均在 `./backend` 目錄下進行。

後端按架設目的不同，有兩種安裝方式：
1. 開發：在本機 (localhost) 開啟並使用。
2. 部署：可以用指定的域名連上網站並使用。

### 🛠 前置作業

#### 建置 MongoDB 資料庫

- 方法一：使用本機資料庫 (請至[此處](https://www.mongodb.com/try/download/community)下載)
- 方法二：使用 MongoDB Atlas 資料庫 (請至[此處](https://www.mongodb.com/atlas/database)申請)

#### 申請 Google OAuth 2.0 Client ID

- 請至[此處](https://console.cloud.google.com/apis/credentials)申請
- 添加域名時，請把「域名本身」以及「域名連同連接埠編號」兩項都新增進去
- 如果不是以 localhost 連接，網站必須以 HTTPS 連線 (即為部署模式)

#### 申請 SSL 證書 (僅部署需要)

- 方法一：使用 OpenSSL 自行簽署 (請先至[官網](https://www.openssl.org/)下載，再依下面指令簽發證書)
    ```bash
    openssl genrsa -out src/private-key.pem 1024
    openssl req -new -key src/private-key.pem -out src/csr.pem
    openssl x509 -req -in src/csr.pem -signkey src/private-key.pem -out src/public-cert.pem
    ```
- 方法二：使用第三方簽發之證書 (部分為免費，如 [ZeroSSL](https://zerossl.com/))

### 🛠 參數設定

把 `.env.defaults` 複製一份，並命名為 `.env`。

```
PORT       = [1]
MODE       = [2]
MONGO_URL  = [3]
JWT_SECRET = [4]
SSL_KEY    = [5]
SSL_CERT   = [6]
GOOGLE_CLIENT_ID = [7]
```

各欄位說明如下：
1. **後端連接埠編號**：建議使用 4000 (預設值)
2. **模式**：`DEV` = 開發；`DEPLOY` = 部置
3. **MongoDB 連接字串**：先前所建置的 MongoDB 資料庫的連接字串 (`mongodb+srv://` 開始)
4. **JWT 金鑰**：長度不少於 32 字元的任意字串
5. **SSL 私鑰的相對路徑**：[僅部署需要] 如先前上面方式生成，則是 `./private-key.pem` 
6. **SSL 證書的相對路徑**：[僅部署需要] 如先前上面方式生成，則是 `./public-cert.pem` 
7. **Google OAuth 2.0 Client ID**：先前所申請的 Client ID (`123-abc.apps.googleusercontent.com` 格式)。

### 🛠 安裝套件

請執行 `yarn` 指令。

### 🛠 啟用服務

如果是開發模式，請執行 `yarn server`。  
如果是部署模式，請執行 `yarn deploy`。
