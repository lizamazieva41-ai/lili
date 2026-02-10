# TDLib File Operations Examples

## Overview

Examples for downloading, uploading, and managing files.

## Download File

```typescript
import { TdlibFileService } from '../tdlib/services/tdlib-file.service';

await fileService.downloadFile(
  clientId,
  fileId,
  1,    // priority
  0,    // offset
  0,    // limit
  false // synchronous
);
```

## Upload File

```typescript
await fileService.uploadFile(
  clientId,
  {
    '@type': 'inputFileLocal',
    path: '/path/to/file.jpg',
  },
  1,    // priority
  0,    // offset
  0     // limit
);
```

## Get File Info

```typescript
const file = await fileService.getFile(clientId, fileId);
console.log(`File size: ${file.size}`);
console.log(`File path: ${file.local?.path}`);
```

## Cancel Download

```typescript
await fileService.cancelDownloadFile(clientId, fileId, false);
```
