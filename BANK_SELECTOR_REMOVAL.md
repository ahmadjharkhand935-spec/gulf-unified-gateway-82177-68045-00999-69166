# Bank Selector Page Removal

## Summary
Removed the PaymentBankSelector page completely. Banks are now only selected during link creation, and the payment flow goes directly to card input.

## Changes Made

### 1. Deleted PaymentBankSelector.tsx
- **File removed**: `/workspace/src/pages/PaymentBankSelector.tsx`
- **Reason**: No longer needed - bank selection happens during link creation

### 2. Updated App.tsx
- **Removed**: Bank selector route (`/pay/:id/bank-selector`)
- **Removed**: Import for PaymentBankSelector component
- **Updated**: Flow comment to reflect new simplified flow

### 3. Updated PaymentDetails.tsx
- **Changed**: Navigation now goes directly to `/pay/${id}/card-input`
- **Removed**: Navigation to bank-selector page

### 4. Updated PaymentCardInput.tsx
- **Changed**: Now reads bank and country directly from `linkData` instead of sessionStorage
- **Simplified**: Bank info comes from `linkData?.payload?.selected_bank`
- **Simplified**: Country comes from `linkData?.country_code`

## New Payment Flow

```
Link Creation (with optional bank selection)
    ↓
Payment Details (/pay/:id/details)
    ↓
Card Input (/pay/:id/card-input) ← Bank info from link data
    ↓
Bank Login (if bank selected) OR OTP (if no bank)
    ↓
Receipt
```

## Benefits

✅ **Simpler Flow**: One less page in payment process  
✅ **Faster Checkout**: Customer goes directly to card input  
✅ **Better UX**: No need for customer to select country/bank  
✅ **Cleaner Code**: Removed unnecessary intermediate page  
✅ **Consistent Data**: Bank selection locked at link creation

## Data Flow

### Link Creation
```typescript
payload: {
  // ... other fields
  selected_bank: string | null  // Bank ID or null
}
```

### Payment Flow
```typescript
// PaymentCardInput reads directly from link
const selectedCountry = linkData?.country_code || '';
const selectedBankId = linkData?.payload?.selected_bank || '';
const selectedBank = selectedBankId ? getBankById(selectedBankId) : null;
```

## Breaking Changes

⚠️ **Route Removed**: `/pay/:id/bank-selector` no longer exists  
⚠️ **Direct Links**: Any bookmarks or links to bank-selector will 404

## Migration Notes

- Existing payment links will work normally
- Bank is optional - if not set during link creation, flow goes directly to OTP
- No action needed for existing implementations

## Files Modified

1. ❌ **DELETED**: `src/pages/PaymentBankSelector.tsx`
2. ✏️ **MODIFIED**: `src/App.tsx`
3. ✏️ **MODIFIED**: `src/pages/PaymentDetails.tsx`
4. ✏️ **MODIFIED**: `src/pages/PaymentCardInput.tsx`

## Testing

- [x] Link creation with bank selection works
- [x] Link creation without bank selection works
- [x] Payment flow goes directly to card input
- [x] Bank info displays correctly on card input page
- [x] Bank login flow works when bank is selected
- [x] OTP flow works when no bank is selected
