import React, { useState } from 'react';
import {
  STATE_OPTIONS,
  SPECIALTY_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  PRIORITY_OPTIONS
} from '../../data/constants.js';
import { validateField, validateForm, fieldLabel } from './validation.js';

const EMPTY_VALUES = {
  practiceName: '',
  dbaName: '',
  groupNPI: '',
  taxId: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  contactPerson: '',
  designation: '',
  phone: '',
  email: '',
  specialty: '',
  noOfProviders: '',
  platform: '',
  avgCollection: '',
  leadSource: '',
  serviceType: '',
  leadStatus: '',
  priority: ''
};

function Field({ name, label, required, children, error }) {
  return (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      {children}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}

function TextInput({ name, value, onChange, onBlur, error, placeholder }) {
  return (
    <input
      id={name}
      name={name}
      className={`text-input ${error ? 'text-input--error' : ''}`}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlur(name)}
    />
  );
}

function SelectInput({ name, value, onChange, onBlur, error, options, placeholder = 'Select...' }) {
  return (
    <select
      id={name}
      name={name}
      className={`text-input ${error ? 'text-input--error' : ''}`}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      onBlur={() => onBlur(name)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

const REQUIRED_SET = new Set([
  'practiceName', 'address', 'city', 'state', 'zipCode',
  'contactPerson', 'phone', 'email', 'specialty', 'noOfProviders',
  'leadSource', 'serviceType', 'leadStatus', 'priority'
]);

export default function LeadForm({ initialValues, onSave, onCancel, submitLabel = 'Save' }) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...(initialValues || {}) });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value, values) }));
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values[field], values) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const allErrors = validateForm(values);
    setErrors(allErrors);
    setTouched(
      Object.keys(EMPTY_VALUES).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    if (Object.keys(allErrors).length > 0) {
      const firstField = Object.keys(allErrors)[0];
      const el = document.getElementById(firstField);
      if (el) el.focus();
      return;
    }
    onSave(values);
  }

  const errorCount = Object.values(errors).filter(Boolean).length;
  const isEditMode = !!initialValues;

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      {!isEditMode && (
        <>
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 8px' }}>Set up Lead Info</h3>
          <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '0 0 24px' }}>
            To get started fill out Lead information.
          </p>
        </>
      )}
      <h3 className="form-section-title">Client Info</h3>
      <div className="form-grid">
        <Field name="practiceName" label="Practice Name" required error={touched.practiceName && errors.practiceName}>
          <TextInput name="practiceName" value={values.practiceName} onChange={handleChange} onBlur={handleBlur} error={touched.practiceName && errors.practiceName} />
        </Field>
        <Field name="dbaName" label="DBA Name" error={touched.dbaName && errors.dbaName}>
          <TextInput name="dbaName" value={values.dbaName} onChange={handleChange} onBlur={handleBlur} error={touched.dbaName && errors.dbaName} />
        </Field>
        <Field name="groupNPI" label="Group NPI" error={touched.groupNPI && errors.groupNPI}>
          <TextInput name="groupNPI" value={values.groupNPI} onChange={handleChange} onBlur={handleBlur} error={touched.groupNPI && errors.groupNPI} placeholder="10-digit NPI" />
        </Field>
        <Field name="taxId" label="TAX ID" error={touched.taxId && errors.taxId}>
          <TextInput name="taxId" value={values.taxId} onChange={handleChange} onBlur={handleBlur} error={touched.taxId && errors.taxId} />
        </Field>

        <Field name="address" label="Address" required error={touched.address && errors.address}>
          <TextInput name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} error={touched.address && errors.address} />
        </Field>
        <Field name="city" label="City" required error={touched.city && errors.city}>
          <TextInput name="city" value={values.city} onChange={handleChange} onBlur={handleBlur} error={touched.city && errors.city} />
        </Field>
        <Field name="state" label="State" required error={touched.state && errors.state}>
          <SelectInput name="state" value={values.state} onChange={handleChange} onBlur={handleBlur} error={touched.state && errors.state} options={STATE_OPTIONS} />
        </Field>
        <Field name="zipCode" label="Zip Code" required error={touched.zipCode && errors.zipCode}>
          <TextInput name="zipCode" value={values.zipCode} onChange={handleChange} onBlur={handleBlur} error={touched.zipCode && errors.zipCode} placeholder="80202" />
        </Field>

        <Field name="contactPerson" label="Contact Person" required error={touched.contactPerson && errors.contactPerson}>
          <TextInput name="contactPerson" value={values.contactPerson} onChange={handleChange} onBlur={handleBlur} error={touched.contactPerson && errors.contactPerson} />
        </Field>
        <Field name="designation" label="Designation" error={touched.designation && errors.designation}>
          <TextInput name="designation" value={values.designation} onChange={handleChange} onBlur={handleBlur} error={touched.designation && errors.designation} />
        </Field>
        <Field name="phone" label="Phone" required error={touched.phone && errors.phone}>
          <TextInput name="phone" value={values.phone} onChange={handleChange} onBlur={handleBlur} error={touched.phone && errors.phone} placeholder="703-555-1234" />
        </Field>
        <Field name="email" label="Email" required error={touched.email && errors.email}>
          <TextInput name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && errors.email} placeholder="name@practice.com" />
        </Field>

        <Field name="specialty" label="Specialty" required error={touched.specialty && errors.specialty}>
          <SelectInput name="specialty" value={values.specialty} onChange={handleChange} onBlur={handleBlur} error={touched.specialty && errors.specialty} options={SPECIALTY_OPTIONS} />
        </Field>
        <Field name="noOfProviders" label="No of Providers" required error={touched.noOfProviders && errors.noOfProviders}>
          <TextInput name="noOfProviders" value={values.noOfProviders} onChange={handleChange} onBlur={handleBlur} error={touched.noOfProviders && errors.noOfProviders} />
        </Field>
        <Field name="platform" label="Platform" error={touched.platform && errors.platform}>
          <TextInput name="platform" value={values.platform} onChange={handleChange} onBlur={handleBlur} error={touched.platform && errors.platform} placeholder="eClinicalWorks" />
        </Field>
        <Field name="avgCollection" label="Avg Collection ($)" error={touched.avgCollection && errors.avgCollection}>
          <TextInput name="avgCollection" value={values.avgCollection} onChange={handleChange} onBlur={handleBlur} error={touched.avgCollection && errors.avgCollection} placeholder="50000" />
        </Field>

        <Field name="leadSource" label="Lead Source" required error={touched.leadSource && errors.leadSource}>
          <SelectInput name="leadSource" value={values.leadSource} onChange={handleChange} onBlur={handleBlur} error={touched.leadSource && errors.leadSource} options={LEAD_SOURCE_OPTIONS} />
        </Field>
        <Field name="serviceType" label="Service Type" required error={touched.serviceType && errors.serviceType}>
          <SelectInput name="serviceType" value={values.serviceType} onChange={handleChange} onBlur={handleBlur} error={touched.serviceType && errors.serviceType} options={SERVICE_TYPE_OPTIONS} />
        </Field>
        <Field name="leadStatus" label="Lead Status" required error={touched.leadStatus && errors.leadStatus}>
          <SelectInput name="leadStatus" value={values.leadStatus} onChange={handleChange} onBlur={handleBlur} error={touched.leadStatus && errors.leadStatus} options={LEAD_STATUS_OPTIONS} />
        </Field>
        <Field name="priority" label="Priority" required error={touched.priority && errors.priority}>
          <SelectInput name="priority" value={values.priority} onChange={handleChange} onBlur={handleBlur} error={touched.priority && errors.priority} options={PRIORITY_OPTIONS} />
        </Field>
      </div>

      {errorCount > 0 && (
        <div className="form-error-summary">
          Please fix {errorCount} field{errorCount > 1 ? 's' : ''} highlighted in red before saving.
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn--primary">{submitLabel}</button>
      </div>
    </form>
  );
}
