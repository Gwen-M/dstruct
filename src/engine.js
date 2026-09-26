export const fields = [
  {id:'owners', label:'How many owners?', options:{unknown:'Not yet known',one:'One owner',multiple:'Two or more owners'}},
  {id:'entity', label:'Requested entity', options:{unknown:'Undecided',llc:'LLC',corporation:'C corporation',scorp:'S corporation election'}},
  {id:'usActivity', label:'US operations or work?', options:{unknown:'Not yet known',yes:'Yes',no:'No'}},
  {id:'funding', label:'Financing plan', options:{unknown:'Not yet known',bootstrap:'Self-funded',vc:'External equity investors'}},
  {id:'inventory', label:'US inventory or fulfillment?', options:{unknown:'Not yet known',yes:'Yes',no:'No'}},
  {id:'relocation', label:'US travel or relocation?', options:{unknown:'Not yet known',yes:'Yes',no:'No'}},
  {id:'relatedBusiness', label:'Existing related business or IP?', options:{unknown:'Not yet known',yes:'Yes',no:'No'}}
];

export function analyze(input = {}) {
  const answers = Object.fromEntries(fields.map(f => [f.id, Object.hasOwn(f.options,input[f.id]) ? input[f.id] : 'unknown']));
  const missing = fields.filter(f => answers[f.id] === 'unknown').map(f => f.label);
  const concerns = [];
  const add = (id,title,detail,sourceIds,role) => concerns.push({id,title,detail,sourceIds,role});
  add('residence','Confirm each owner’s tax residency','Collect residence, green-card, and travel facts; nationality alone is insufficient.',['residency'],'Cross-border tax adviser');
  if (answers.entity === 'llc' && answers.owners === 'one') add('single','Single-owner LLC reporting review','Confirm classification, foreign ownership, and reportable owner transactions before assessing Form 5472.',['classification','5472'],'US international tax adviser');
  if (answers.entity === 'llc' && answers.owners === 'multiple') add('multi','Partnership classification review','If partnership treatment applies, assess whether income allocated to foreign partners triggers section 1446 withholding.',['classification','partnership'],'US partnership tax adviser');
  if (answers.entity === 'corporation') add('corp','Corporate compliance review','Review Delaware franchise tax and foreign ownership / related-party reporting alongside corporate returns.',['de-corp-tax','5472'],'US corporate tax adviser');
  if (answers.entity === 'scorp') add('s-election','Check S election eligibility','A nonresident alien shareholder is not eligible. Establish all owners’ actual status before considering an election.',['scorp','residency'],'US tax adviser');
  if (answers.inventory === 'yes') add('inventory','Map inventory by state','Identify all locations and sales channels. California guidance is an example, not a nationwide conclusion.',['ca-inventory'],'State and local tax adviser');
  if (answers.relocation === 'yes') add('travel','Review work permission and travel','Identify actual activities and status before assuming a visitor can work for their own company.',['visitor','residency'],'Immigration counsel');
  if (answers.relatedBusiness === 'yes') add('related','Map existing IP and related-party flows','Obtain ownership documents and planned services, funding, and IP agreements for pricing and legal review.',['transfer-pricing'],'Cross-border tax and corporate counsel');
  if (answers.usActivity === 'yes') add('operations','Document the US operating footprint','Record states, people, premises, and contracting authority for a fact-specific assessment.',[],'US tax and business counsel');
  if (answers.funding === 'vc') add('financing','Confirm financing requirements','Obtain investor requirements and the cap table; financing preferences are not a legal mandate.',[],'Startup counsel');
  return {answers,missing,concerns,status:'Specialist review required',limitations:'Structured triage only. Free text is retained but not analyzed. No country-specific tax opinion or entity recommendation.'};
}
