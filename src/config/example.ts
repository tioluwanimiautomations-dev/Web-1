/**
 * The one example intake used by every mockup on the site (call, text, Slack, email).
 * Sample details for illustration only; every screen that shows them is labeled "Example".
 */
export const exampleIntake = {
  caller: 'Maria G., for her brother',
  fields: [
    ['Charge', 'DUI, first offense'],
    ['County', 'Hillsborough'],
    ['Custody', 'In custody, bond hearing pending'],
    ['Found you', 'Google ad'],
    ['Conflicts', 'No match found'],
    ['Language', 'Spanish'],
  ] as const,
  approved: 'Consult booked for Monday 9:00am, matter created, and Maria gets a confirmation text in Spanish.',
  declined: "Maria gets a respectful text, in Spanish, that the firm can't take the matter. Nothing is booked.",
};
