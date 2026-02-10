# TDLib Authentication Examples

## Overview

This guide demonstrates how to authenticate with Telegram using TDLib.

## Step-by-Step Guide

### 1. Create a Client

```typescript
import { TdlibService } from '../tdlib/tdlib.service';

const clientId = 'my-client-1';
await tdlibService.createClient(clientId);
```

### 2. Request Authentication Code

```typescript
import { TdlibAuthService } from '../tdlib/tdlib-auth.service';

const phoneNumber = '+1234567890';
await authService.requestCode(clientId, phoneNumber);
```

### 3. Confirm Code

```typescript
const code = '12345'; // Code received via SMS/Telegram
await authService.confirmCode(clientId, code);
```

### 4. Confirm Password (if 2FA enabled)

```typescript
const password = 'your-2fa-password';
await authService.confirmPassword(clientId, password);
```

## Complete Example

```typescript
async function authenticate(clientId: string, phoneNumber: string) {
  // Create client
  await tdlibService.createClient(clientId);
  
  // Request code
  await authService.requestCode(clientId, phoneNumber);
  
  // Wait for code input
  const code = await getUserInput('Enter code: ');
  
  // Confirm code
  await authService.confirmCode(clientId, code);
  
  // Check if password needed
  const authState = await tdlibService.getAuthorizationState(clientId);
  if (authState['@type'] === 'authorizationStateWaitPassword') {
    const password = await getUserInput('Enter 2FA password: ');
    await authService.confirmPassword(clientId, password);
  }
  
  console.log('Authentication successful!');
}
```
