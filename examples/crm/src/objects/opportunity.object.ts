import { ObjectSchema, Field } from '@objectstack/spec/data';

export const OpportunityObject = ObjectSchema.create({
  name: 'opportunity',
  label: 'Opportunity',
  fields: {
    name: Field.text({ label: 'Opportunity Name', required: true }),
    amount: Field.currency({ label: 'Amount' }),
    stage: Field.select(["Prospecting", "Proposal", "Negotiation", "Closed Won", "Closed Lost"], { label: 'Stage' }),
    closeDate: Field.date({ label: 'Close Date' }),
    accountId: Field.lookup('account', { label: 'Account' }),
    contactIds: Field.lookup('contact', { label: 'Contacts', multiple: true }),
    description: Field.textarea({ label: 'Description' })
  }
});
