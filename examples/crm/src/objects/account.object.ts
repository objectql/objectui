import { ObjectSchema, Field } from '@objectstack/spec/data';

export const AccountObject = ObjectSchema.create({
  name: 'account',
  label: 'Account',
  fields: {
    name: Field.text({ label: 'Account Name', required: true }),
    industry: Field.text({ label: 'Industry' })
  }
});
