# Computer Networks Project (Server-side)

## Phase 1: Utopia Mailbox

### 功能

使用者可以透過信箱向其他人傳訊息。

寄件時，只要按指定格式填上寄件人、收件人和內容，信件就會傳送到收件人的信箱。

收件時，只要說明自己的身分，就會顯示所有未讀訊息。  
考量烏托邦裡安穩和諧，想必也不會有人仿冒他人身分，因此暫時未有身分驗證的功能。

### 使用

#### 伺服器端

```bash
# Compile
make phase1

# Run
./server [PORT]
```

#### 使用者端

假設伺服器端在 ws1 上運行。

```bash
# Connect (clients on ws1)
telnet localhost [PORT]

# Connect (other clients)
telnet ws1.csie.ntu.edu.tw [PORT]

# Send message
from [SENDER], to [RECIPIENT], says [MESSAGE]

# Check mailbox
check mail [RECIPIENT]

# Exit (close connection)
exit
```

使用者端會依指令產出相應的回應。如果沒有回應，很可能是指令格式有誤，請重新輸入。

### 備註

- Mailbox 裡的信件儲存在記憶體中，所以結束後會全數清除。
- 已完成收取/解析 HTTP 請求的部分，也能發送測試用的 HTTP 回應，但在 Phase 1 尚未啟用。
- 身分驗證預計在 part 2 時使用 token 實作。
