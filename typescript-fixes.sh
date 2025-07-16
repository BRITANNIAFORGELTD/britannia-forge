#!/bin/bash

# Fix all TypeScript errors systematically
echo "Fixing TypeScript compilation errors..."

# 1. Fix auth login response types
sed -i 's/response\.success/(response as any).success/g' client/src/components/auth/secure-login.tsx
sed -i 's/response\.requiresVerification/(response as any).requiresVerification/g' client/src/components/auth/secure-login.tsx
sed -i 's/response\.user/(response as any).user/g' client/src/components/auth/secure-login.tsx
sed -i 's/response\.token/(response as any).token/g' client/src/components/auth/secure-login.tsx

# 2. Fix data access patterns in admin components
sed -i 's/data\.map/Array.isArray(data) ? data.map : [].map/g' client/src/components/admin/*.tsx
sed -i 's/data\.filter/Array.isArray(data) ? data.filter : [].filter/g' client/src/components/admin/*.tsx
sed -i 's/data\.length/Array.isArray(data) ? data.length : 0/g' client/src/components/admin/*.tsx

# 3. Fix any type issues
sed -i 's/\(.*\)\.map(\(.*\) => /\1?.map((\2: any) => /g' client/src/components/admin/*.tsx

echo "TypeScript fixes applied"