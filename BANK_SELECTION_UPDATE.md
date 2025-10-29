# Bank Selection Flow Update

## Summary
Updated the bank selection flow to remove country selection from the payment process and add bank selection to link creation pages.

## Changes Made

### 1. CreateShippingLink.tsx
- **Added**: Bank selection dropdown based on the country from the URL
- **Feature**: Banks are filtered automatically according to the selected country
- **Storage**: Selected bank is stored in the link payload as `selected_bank`
- **UI**: Optional field with helper text indicating it can be left empty

### 2. CreateChaletLink.tsx  
- **Added**: Bank selection dropdown based on the country from the URL
- **Feature**: Banks are filtered automatically according to the selected country
- **Storage**: Selected bank is stored in the link payload as `selected_bank`
- **UI**: Optional field with helper text indicating it can be left empty

### 3. PaymentBankSelector.tsx
- **Removed**: Country selection step (no longer needed)
- **Updated**: Banks now load directly based on the country from the link data
- **Feature**: Auto-selects the bank if it was pre-selected during link creation
- **Simplified**: Removed the two-step flow (country → bank), now shows banks directly

## Flow Explanation

### Before:
1. User creates link (no bank selection)
2. Customer goes to payment page
3. **Customer selects country** → Then selects bank
4. Customer completes payment

### After:
1. User creates link → **Selects bank for customer (optional)**
2. Customer goes to payment page
3. Banks are shown directly for the link's country (with preselected bank if chosen)
4. Customer completes payment

## Benefits

✅ **Streamlined UX**: One less step for customers during payment  
✅ **Better Control**: Link creators can pre-select the preferred bank  
✅ **Country Consistency**: Country is determined at link creation, ensuring consistency  
✅ **Still Flexible**: Bank selection remains optional - customers can skip or choose different bank  
✅ **Auto-Selection**: If bank was selected during link creation, it's automatically highlighted

## Technical Details

### Data Structure
The link payload now includes:
```typescript
{
  // ... existing fields
  selected_bank: string | null  // Bank ID or null if not selected
}
```

### Country-to-Bank Mapping
Banks are automatically filtered using the `getBanksByCountry()` function from `/src/lib/banks.ts`:
- SA (Saudi Arabia): 10 banks
- AE (UAE): 8 banks  
- KW (Kuwait): 7 banks
- QA (Qatar): 6 banks
- OM (Oman): 6 banks
- BH (Bahrain): 6 banks

## Testing Checklist

- [ ] Create a shipping link with bank selection
- [ ] Create a shipping link without bank selection
- [ ] Create a chalet link with bank selection
- [ ] Create a chalet link without bank selection
- [ ] Verify payment page shows correct country banks
- [ ] Verify preselected bank is highlighted
- [ ] Verify skip bank option still works
- [ ] Test across different countries

## Files Modified

1. `/workspace/src/pages/CreateShippingLink.tsx`
2. `/workspace/src/pages/CreateChaletLink.tsx`
3. `/workspace/src/pages/PaymentBankSelector.tsx`

## No Breaking Changes

All changes are backwards compatible. Existing links without bank selection will continue to work normally.
