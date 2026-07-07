# Lead Management (CRUD) — React

A complete Lead Management module built with React + Vite, matching the requirement workbook
(`Assesment_requirement.xlsx`) mockups: Leads list, Add/Edit Lead form, Lead Details with
Practice Info + Communication tabs.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Where each requirement is implemented

| Requirement | Implementation |
|---|---|
| Create / view / update / delete leads | `context/LeadsContext.jsx` (`addLead`, `updateLead`, `deleteLead`, `getLead`) |
| Add Lead form saves & shows in list | `LeadsList.jsx` → `handleAddLead` adds to context, list re-renders immediately |
| Filters on Leads list | `LeadsList/LeadsFilters.jsx` (Lead Status, Priority, Service Type, Follow-up Status, More Filters: Stage, Specialty, Lead Source, Sales Rep, State) + search |
| Field validation by type/business rule | `LeadForm/validation.js` (required fields, email/phone/zip/NPI/tax-id formats, numeric checks) |
| Invalid/blank mandatory fields block submit, highlight red, show messages | `LeadForm.jsx` — `text-input--error` class + `field-error` message text, submit blocked until `validateForm` returns no errors |
| Edit icon on Lead Details | `LeadDetails/PracticeInfoTab.jsx` — "✎ Edit" button opens the same `LeadForm` pre-populated with `initialValues={lead}` |
| Communication section: add & list notes | `LeadDetails/CommunicationTab.jsx` — note textarea + "Add Note" button, notes table below updates immediately after save (newest on top) |
| Lead Stage / Next Follow-up / auto Follow-up Status | `CommunicationTab.jsx` + `utils/dateUtils.js` (`followUpStatus`) |
| Days Since Activity / Aging Bucket / Stage columns | `LeadsList/LeadsTable.jsx` (computed via `dateUtils.js`) |

## Data & persistence

There is no backend in this assessment build — leads are held in React state
(`LeadsContext`) and persisted to the browser's `localStorage` so data survives a page
refresh. Swapping in a real API later only requires updating the functions inside
`LeadsContext.jsx`.

## Dropdown values

All dropdown option lists (Lead Status, Stage, Priority, Specialty, Lead Source, Sales Rep,
State, Service Type) were taken directly from the workbook's **Validation** sheet, in
`src/data/constants.js`.

## Project structure

```
src/
  App.jsx                     Top-level view switcher (Leads list ⇄ Lead details)
  context/LeadsContext.jsx    CRUD state + localStorage persistence
  data/constants.js           Dropdown option lists (from Validation sheet)
  data/sampleData.js          Seed lead (BrightCare Cardiology, from the mockup)
  utils/dateUtils.js          Date formatting + computed fields
  utils/idGenerator.js        Lead ID / note ID generation
  components/
    LeadsList/                List page: filters, table, add-lead modal, export, delete
    LeadForm/                 Shared Add/Edit form + validation rules
    LeadDetails/               Details page: header, Practice Info tab, Communication tab
    common/                   Badge, Modal, ConfirmDialog
```
