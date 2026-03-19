export const OpportunityContactData = {
  object: 'opportunity_contact',
  mode: 'upsert' as const,
  records: [
    { id: "oc1", name: 'Bob Smith — Enterprise License', opportunity: "ObjectStack Enterprise License", contact: "Bob Smith", role: 'decision_maker', is_primary: true },
    { id: "oc2", name: 'George Martin — Enterprise License', opportunity: "ObjectStack Enterprise License", contact: "George Martin", role: 'evaluator', is_primary: false },
    { id: "oc3", name: 'Charlie Brown — Global Fin Q1', opportunity: "Global Fin Q1 Upsell", contact: "Charlie Brown", role: 'champion', is_primary: true },
    { id: "oc4", name: 'Diana Prince — London Renewal', opportunity: "London Annual Renewal", contact: "Diana Prince", role: 'decision_maker', is_primary: true },
    { id: "oc5", name: 'Evan Wright — Berlin Automation', opportunity: "Berlin Automation Project", contact: "Evan Wright", role: 'influencer', is_primary: true },
    { id: "oc6", name: 'Fiona Gallagher — Paris POS', opportunity: "Paris Store POS System", contact: "Fiona Gallagher", role: 'end_user', is_primary: true },
    { id: "oc7", name: 'Bob Smith — SF Tower', opportunity: "SF Tower Expansion", contact: "Bob Smith", role: 'decision_maker', is_primary: true },
  ]
};
