/* Edit this file to update the founder briefing, origin, journey and prototype story. */
window.STORY = {
  founders: [
    {
      id:'walt', name:'Dylan Walt', role:'Engineering & entrepreneurship', initials:'DW',
      intro:'Curiosity, sales and a desire to build useful technology.',
      strengths:['Critical thinking','Software & AI','Engineering'],
      background:'From early sales to fintech and ClevaCado, Dylan brings an interest in solving real problems through technology.',
      ventures:[
        {title:'CSX', text:'Early sales experience in concussion software.'},
        {title:'Prevent', text:'Early sales experience with smart mouthguards.'},
        {title:'SportGate', text:'Early sales experience in sports technology.'},
        {title:'Velzee', text:'Based at the Roux Institute. An earlier fintech platform sold to Harwood Labs in early third year sparked the idea.', logo:'assets/logos/velzee.png'}
      ],
      learning:'Build, test and learn from the people closest to the problem.'
    },
    {
      id:'simpson', name:'Dylan Simpson', role:'People & entrepreneurship', initials:'DS',
      intro:'A people-first entrepreneur who finds needs through conversations.',
      strengths:['Customer discovery','Sales & marketing','Networking'],
      background:'Dylan brings experience in service delivery, direct outreach and building relationships with customers.',
      ventures:[
        {title:'Exotic animals', text:'About five years buying, selling, trading and breeding tarantulas, snakes and other exotic pets.'},
        {title:'1,000+ customers', text:'A customer base across Africa, built through marketing, education and reliable service.'},
        {title:'People first', text:'Direct conversations, cold calling and networking to understand what customers need.'}
      ],
      learning:'Listen closely, understand the need and deliver a useful service.'
    }
  ],
  origins:[
    {year:'JAN 2026', label:'The project', title:'A project worth continuing.', text:'Choosing our Investigation project, we wanted to think critically, step outside our comfort zones and build something useful beyond graduation.', image:'assets/optimized/photo-10.3cb765c1bccb.jpg', caption:'THE FOUNDERS · PROJECT PHOTO', tag:'THE START'},
    {year:'THE IDEA', label:'Agriculture', title:'A question in agriculture.', text:'Dylan Walt suggested the sector. Our research led us to avocados, where handling damage and the people who depend on the industry gave the challenge meaning.', image:'assets/optimized/photo-8.0ac39d8a2754.jpg', caption:'PROTOTYPE SHELL · PROJECT PHOTO', tag:'FINDING THE PROBLEM'},
    {year:'EARLY 2026', label:'The calls', title:'Pick up the phone.', text:'We were not growers or exporters, so we cold-called industry contacts, including Fremax Farms. Their feedback pointed to visibility and accountability; some invited us back with a product.', image:'assets/optimized/photo-2.10d5a3df6512.jpg', caption:'TEAM AND PROJECT · PHOTO DATE UNCONFIRMED', tag:'CUSTOMER DISCOVERY'}
  ],
  milestones:[
    {year:'MID 2026', label:'EDHE', title:'From idea to business case.', text:'Before the Investigation project, we entered EDHE, placed second at Wits and represented Wits at the regional round. Feedback and mentoring helped us refine the idea.', image:'assets/optimized/photo-2.10d5a3df6512.jpg', caption:'TEAM AND PROJECT · PHOTO DATE UNCONFIRMED', tag:'THE COMPETITION'},
    {year:'AUG–SEP 2026', label:'AfreTec', title:'Skills with a wider purpose.', text:'The Wits–AfreTec Challenge reinforced our belief that engineering and AI can address meaningful problems across Africa.', image:'assets/optimized/photo-10.3cb765c1bccb.jpg', caption:'TEAM PHOTO · DATE / EVENT UNCONFIRMED', tag:'A RELATED EXPERIENCE'},
    {year:'8 WEEKS', label:'Investigation', title:'From planning to proof of concept.', text:'The earlier research and conversations shaped our eight-week Investigation. We built sensing hardware, collected controlled data and explored machine learning on those recordings.', image:'assets/optimized/crate.eeda1c6a9260.jpg', caption:'CONTROLLED CRATE TRIAL', tag:'THE PROJECT'},
    {year:'OCT 2026', label:'Sharing', title:'Taking the work further.', text:'We shared our work at Wits EIE Open Day and submitted a SAUPEC paper for review. The next step is to learn from real supply-chain conditions.', image:'assets/optimized/photo-6.cd6bad18d323.jpg', caption:'HAND-BUILT ELECTRONICS · PROJECT PHOTO', tag:'THE RESEARCH'}
  ],
  system:[
    {id:'problem', num:'01', name:'The problem', kicker:'HANDLING RISK', title:'Damage can appear later.', text:'Drops, vibration, compression and rough handling can damage fruit. When bruising appears later, tracing the specific handling event is difficult.', image:'assets/optimized/crate.eeda1c6a9260.jpg', caption:'CONTROLLED CRATE TRIAL'},
    {id:'impact', num:'02', name:'The impact', kicker:'PEOPLE & QUALITY', title:'A problem that reaches people.', text:'Quality losses affect growers, workers and families. South Africa exports avocados worldwide; retail research also shows why bruising deserves attention.', image:'assets/optimized/photo-10.3cb765c1bccb.jpg', caption:'THE PEOPLE BEHIND THE IDEA'},
    {id:'shell', num:'03', name:'The proxy', kicker:'THE SOLUTION', title:'A smart avocado in the crate.', text:'Our 3D-printed proxy is designed to travel alongside real fruit and capture the handling conditions it encounters.', image:'assets/optimized/photo-8.0ac39d8a2754.jpg', caption:'PHYSICAL PROTOTYPE SHELL'},
    {id:'sensing', num:'04', name:'The sensing', kicker:'MEASURING THE JOURNEY', title:'Turning movement into data.', text:'The hardware records motion and impact. Our team assesses this lab-tested proof of concept at TRL 4; supply-chain data is next.', image:'assets/optimized/photo-4.f20c4ce2fdbe.jpg', caption:'PHYSICAL ELECTRONICS'},
    {id:'data', num:'05', name:'The model', kicker:'LEARNING FROM SIGNALS', title:'From signals to insight.', text:'Our machine learning research classifies controlled motion patterns, including drops and vibration. Connecting those signals to actual bruising still needs fruit and field validation.', image:'assets/optimized/crate.eeda1c6a9260.jpg', caption:'CONTROLLED CRATE TRIAL'}
  ]
};
