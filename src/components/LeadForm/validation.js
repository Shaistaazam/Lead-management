// Field-level validation. Each validator receives the current form values
// and returns an error string, or '' when the value is valid.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[\d\s()+-]{7,20}$/;
const DIGITS_RE = /^\d+$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

export const REQUIRED_FIELDS = [
  'practiceName',
  'address',
  'city',
  'state',
  'zipCode',
  'contactPerson',
  'phone',
  'email',
  'specialty',
  'noOfProviders',
  'leadSource',
  'serviceType',
  'leadStatus',
  'priority'
];

const LABELS = {
  practiceName: 'Practice Name',
  dbaName: 'DBA Name',
  groupNPI: 'Group NPI',
  taxId: 'TAX ID',
  address: 'Address',
  city: 'City',
  state: 'State',
  zipCode: 'Zip Code',
  contactPerson: 'Contact Person',
  designation: 'Designation',
  phone: 'Phone',
  email: 'Email',
  specialty: 'Specialty',
  noOfProviders: 'No of Providers',
  platform: 'Platform',
  avgCollection: 'Avg Collection',
  leadSource: 'Lead Source',
  serviceType: 'Service Type',
  leadStatus: 'Lead Status',
  priority: 'Priority'
};

export function fieldLabel(field) {
  return LABELS[field] || field;
}

export function validateField(field, value, allValues = {}) {
  const v = (value ?? '').toString().trim();

  if (REQUIRED_FIELDS.includes(field) && !v) {
    return `${fieldLabel(field)} is required.`;
  }

  if (!v) return ''; // optional & empty, nothing further to check

  switch (field) {
    case 'email':
      if (!EMAIL_RE.test(v)) return 'Enter a valid email address.';
      break;
    case 'phone':
      if (!PHONE_RE.test(v)) return 'Enter a valid phone number.';
      break;
    case 'zipCode':
      if (!ZIP_RE.test(v)) return 'Enter a valid 5-digit zip code.';
      break;
    case 'groupNPI':
      if (!DIGITS_RE.test(v) || v.length !== 10) return 'Group NPI must be exactly 10 digits.';
      break;
    case 'taxId':
      if (!DIGITS_RE.test(v)) return 'TAX ID must contain digits only.';
      break;
    case 'noOfProviders':
      if (!DIGITS_RE.test(v) || Number(v) <= 0) return 'Enter a valid number of providers.';
      break;
    case 'avgCollection':
      if (!/^\d+(\.\d{1,2})?$/.test(v)) return 'Enter a valid amount (numbers only).';
      break;
    case 'state':
      if (v.length !== 2) return 'Use the 2-letter state code.';
      break;
    default:
      break;
  }
  return '';
}

export function validateForm(values) {
  const errors = {};
  Object.keys(LABELS).forEach((field) => {
    const err = validateField(field, values[field], values);
    if (err) errors[field] = err;
  });
  return errors;
}

export function isFormValid(values) {
  const errors = validateForm(values);
  return Object.keys(errors).length === 0;
}
