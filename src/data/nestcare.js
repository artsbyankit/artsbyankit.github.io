// Content for the NestCare case study page (src/pages/NestCare.jsx).
const img = (name) => `/images/nestcare/${name}.webp`

export const team = [
  { name: 'Ankit Patel', photo: img('team-ankit') },
  { name: 'Arpan Seth', photo: img('team-arpan') },
]

export const everTried = [
  'Ever waited hours in a long hospital queue just to get an OPD token?',
  'With NestCare, book appointments at trusted, government-verified hospitals and clinics in minutes. Designed for everyone—students, families, working professionals, anyone who needs quick care.',
  'And yes, you can also manage appointments for your parents or loved ones when they need support.',
  'Simplifying care for every generation—anytime, anywhere.',
]

export const audienceStats = [
  { value: '67%+', label: 'of India’s population lives in Tier 2 & 3 cities' },
  { value: '87%', label: 'surge in online consultations in these regions' },
  { value: '83%', label: 'growth in OPD bookings' },
]

export const problems = [
  'Patients in Tier 2 & 3 cities struggle with fragmented and outdated appointment systems, leading to long waiting times, confusion, and missed consultations.',
  'Most healthcare apps are designed for Tier 1 users, with complex interfaces that are not friendly for seniors, low-tech users, or families managing care for elders.',
  'Elderly patients often rely on family members for healthcare coordination, but existing apps lack smooth multi-profile support, making it difficult for caregivers to manage appointments and reminders.',
  'Clinics in smaller cities still use manual or semi-digital workflows, causing delays, inconsistent information, and limited transparency for patients waiting in queues.',
  'Users commonly miss appointment updates, reminders, and token details due to poor communication from clinics and the absence of a centralized, easy-to-use digital tool.',
]

export const businessStrategy = [
  { title: 'Customer', items: ['Patients / Care seekers', 'Clinics / Doctors'] },
  { title: 'Obstacles', items: ['Availability of Clinics / Doctors', 'Trust'] },
  { title: 'Solution', items: ['Show nearest clinics in user’s area', 'Gather a large number of doctors & clinics', 'Users can view clinic and doctor profiles to choose from'] },
  { title: 'Success Metrics', items: ['50+ positive reviews in first 6 months', '500+ users in first year of release', 'Gather Doctors and Clinics from all over India'] },
  { title: 'Objective', wide: true, items: ['Medical Treatment for Patients.', 'Expand Doctor’s / Clinic’s base to provide broader income channels, reachability, & scheduling system.'] },
]

export const creativeStrategy = {
  product: ['Mobile application for Patients', 'Mobile application for Doctor/Clinic', 'Landing page', 'Admin & Doctor/Clinic dashboard'],
  values: ['Trust', 'Support', 'Awareness', 'Empowerment', 'Problem-Solving'],
  patients: ['Booking appointments', 'Reminders', 'Emergency Support', 'Map with nearby Doctors & Clinics'],
  clinic: ['Case history', 'Reminders', 'Prepare for Emergency', 'Integrated system for medical workflow'],
  benefits: ['Keeping track of appointments, documents, prescriptions, etc.', 'Easy access to healthcare', 'Expanding client base for Doctors', 'Easier access to clients’ history'],
  audience: ['Patients & Care-givers', 'Clinics who need to manage their patients and doctors.', 'Experienced & fresh doctors who need to track their appointments.'],
}

export const designThinking = [
  { stage: 'Empathize', items: ['Stakeholder research', 'SWOT analysis', 'User research'] },
  { stage: 'Define', items: ['Problem statement', 'Business strategy', 'Creative strategy', 'User research', 'User persona', 'Empathy map'] },
  { stage: 'Ideate', items: ['Storyboarding', 'Value proposition', 'User Flow', 'Information architecture', 'Priority matrix', 'Feature list'] },
  { stage: 'Prototype', items: ['Mid fidelity wireframes', 'High Fidelity UI design'] },
  { stage: 'Test', items: ['Usability Testing', 'Heuristic Evaluation'] },
]

export const competitors = [
  {
    name: 'Practo',
    logo: img('logo-practo'),
    pros: [
      'Clinic-side tooling (Ray) — practice management, appointment scheduler, EHR and automated reminders built for clinics. Good for digitizing small clinics.',
      'Confirmed appointments & discovery — large patient network so clinics get more visibility (helps fill appointment slots).',
      'Follow-up & record sharing — patients and clinics can share records and follow-up consults inside the same ecosystem.',
    ],
    cons: [
      'Cost / pricing pressure — Ray and other paid plans can be expensive for very small/niche clinics without subscription budgets.',
      'Complexity — full feature set can be overkill for clinics that need a very simple booking + SMS workflow.',
      'Tier-2/3 reach gaps — while Practo is large in metros and big cities, smaller towns sometimes prefer local, low-tech channels (calls, walk-ins); clinics may still need hands-on onboarding.',
    ],
  },
  {
    name: 'MFine',
    logo: img('logo-mfine'),
    pros: [
      'Fast online consults — instant video/chat with many specialists (good for 24×7 urgent needs).',
      'Integrated diagnostics — lab bookings & home sample pickup is built in, streamlining care journeys.',
      'User experience for remote consults — optimized flows for telemedicine that patients understand quickly.',
    ],
    cons: [
      'Clinic integration limited — MFine focuses more on teleconsult and partner hospitals than deeply embedding into small clinic workflows.',
      'Price/per-consult model — per-consult fees and discounts may not be ideal for older patients or families who prefer local retainer models.',
      'Local language / offline support — may be less optimized for low-digital literacy users in Tier-2/3 compared to a phone/SMS-centric solution.',
    ],
  },
  {
    name: 'Apollo 24|7',
    logo: img('logo-apollo'),
    pros: [
      'Brand trust & large doctor network — useful where brand credibility matters (patients in smaller cities often trust known hospital brands).',
      'End-to-end services — teleconsult → prescription → pharmacy → diagnostic bookings in one flow.',
      'Structured follow-up — text follow-ups and continuity for 7 days or more after consult (per product pages).',
    ],
    cons: [
      'Less focused on small independent clinics — more hospital/chain-oriented; smaller clinics may not get as much tailored support.',
      'Potentially heavier UX — big platforms can be resource-heavy on low-end devices or poor connections.',
      'Pricing & margins — tie-ups with a large network may mean clinics get less direct control over pricing/promotions.',
    ],
  },
  {
    name: 'Tata 1mg',
    logo: img('logo-1mg'),
    pros: [
      'Medicine fulfilment & trust — easy path to medicine ordering after consultations; good for chronic patients needing regular meds.',
      'Lab tests & care plans — integrated test booking and care packages.',
      'Strong logistics — delivery networks useful in Tier-2/3 cities where pharmacy access is variable.',
    ],
    cons: [
      'Less clinic management focus — not primarily a clinic practice management platform.',
      'Consultation as add-on — teleconsult exists but is not as clinic-centric as Practo Ray.',
      'Dependence on e-commerce flow — patients focused on medication orders may not use appointment booking features as first choice.',
    ],
  },
  {
    name: 'Lybrate',
    logo: img('logo-lybrate'),
    pros: [
      'Simple booking & consult flows — easy for patients to find and consult doctors.',
      'Question/answer community — content & inbound lead generation for doctors.',
      'Low barrier for doctors to join — appealing to individual practitioners.',
    ],
    cons: [
      'Limited clinic management features — lacks full EHR/billing modules for clinic operations.',
      'Less strong on diagnostics/pharmacy — weaker integration vs 1mg/Apollo.',
      'Variable quality control — marketplace model can lead to uneven patient experiences.',
    ],
  },
  {
    name: 'MediBuddy',
    logo: img('logo-medibuddy'),
    pros: [
      'Quick, on-demand consults — short waiting times; easy to get advice in minutes.',
      'Subscription offers — membership plans that give families recurring value (can lock retention).',
      'Simple UX for non-tech users — chat/call based flows that work on basic smartphones.',
    ],
    cons: [
      'Limited clinic empowerment — not aimed at clinic practice management / scheduling for small clinics.',
      'May prioritize volume over personalization — on-demand model focuses on speed more than continuity with a local doctor.',
      'Emergency support is limited — focused on consultations rather than ambulance or serious triage networks.',
    ],
  },
]

export const swot = [
  { title: 'Strengths', tone: 'good', art: img('swot-strengths'), items: ['Built for Tier-2/3 needs', 'Simple onboarding for small clinics', 'Multilingual & caregiver-friendly', 'Low-cost, lightweight system'] },
  { title: 'Weaknesses', tone: 'bad', art: img('swot-weaknesses'), items: ['Small initial clinic network', 'Limited advanced features at start', 'Low early brand visibility', 'Dependent on local partners'] },
  { title: 'Opportunities', tone: 'good', art: img('swot-opportunities'), items: ['Huge untapped Tier-2/3 healthcare market', 'Rising digital & UPI adoption', 'ABDM integration potential', 'Local pharmacy/lab partnerships'] },
  { title: 'Threats', tone: 'bad', art: img('swot-threats'), items: ['Big competitors entering small cities', 'Price/discount wars', 'Clinic resistance to tech adoption', 'Data/privacy regulation challenges'] },
]

export const surveys = [
  {
    id: 'patients',
    label: 'Patients',
    intro: 'Insights from an online survey of patients’ main challenges and preferences in managing their care.',
    photo: img('survey-patients'),
    photoAlt: 'Patients crowding a hospital OPD counter',
    questions: [
      ['Do you currently face long waiting queues at clinics?', 78],
      ['Would you prefer booking a confirmed appointment time instead of walk-in?', 83],
      ['Have you ever missed an appointment due to forgetting the date/time?', 61],
      ['Would SMS or WhatsApp reminders help you manage appointments better?', 89],
      ['Would you use an app to store your prescriptions and medical records digitally?', 76],
      ['Do you need help booking appointments for a family member (elderly/children)?', 57],
      ['Would you want home sample collection (blood test, vitals, etc.)?', 68],
      ['Would online consultation (video/audio/chat) be useful for minor health issues?', 72],
      ['Do you trust reviews/ratings while choosing a doctor or clinic?', 64],
      ['Would loyalty rewards, discounted checkups, or subscription benefits motivate you to use a healthcare app regularly?', 58],
    ],
    insights: [
      'Tier-2/3 clinics remain offline-first, leaving patients stuck in queues with no visibility into doctor availability.',
      'People trust local doctors, but lack a simple digital bridge that connects them without the frustration of waiting.',
      'Healthcare decisions are often family-managed, making shared access and reminders a real need, not a feature.',
      'Major healthcare apps cater to metro lifestyles, creating a massive gap for solutions built for smaller cities’ realities.',
    ],
  },
  {
    id: 'doctors',
    label: 'Doctors & clinics',
    intro: 'Insights from an online survey of doctors’ main challenges and preferences in managing their clinic.',
    photo: img('survey-doctors'),
    photoAlt: 'A nurse attending to an elderly patient at a small clinic',
    questions: [
      ['Do you face overcrowding or long queues at your clinic?', 74],
      ['Do walk-ins make it difficult to manage patient flow efficiently?', 69],
      ['Would a digital appointment booking system help reduce chaos at your clinic?', 82],
      ['Do patients frequently call your clinic for appointment availability?', 71],
      ['Would automated reminders reduce no-show and missed appointments?', 86],
      ['Do you currently maintain patient records digitally?', 63],
      ['Would a simple digital record & prescription system improve your workflow?', 78],
      ['Are you interested in online consultations (video/audio/chat) to serve more patients?', 54],
      ['Would integrating payments (UPI, card) inside the clinic app benefit your practice?', 67],
      ['Would you adopt an affordable, easy-to-use system designed specifically for small clinics?', 91],
    ],
    insights: [
      'Most clinics feel overwhelmed by unplanned walk-ins and long queues that slow down their daily flow.',
      'Doctors strongly believe a simple digital booking system would ease pressure and cut down constant phone inquiries.',
      'Many still rely on paper records and see clear value in automated reminders to reduce missed appointments.',
      'Clinics are highly willing to adopt affordable, easy-to-use tools designed specifically for small, local practices.',
    ],
  },
]

export const personas = [
  {
    id: 'patient',
    tab: 'Patient: Rameshbhai',
    name: 'Rameshbhai Patel',
    photo: img('persona-ramesh'),
    photoPosition: '50% 40%',
    intro: 'Creating a detailed user persona to better understand the patient’s needs, behavior and preferences.',
    profile: ['68 Years', 'Feature phone', 'Retired school clerk', 'Nadiad, GJ, IND. (semi-urban)'],
    about: ['Family: Lives with son & daughter-in-law', 'Device: No smartphone (basic keypad phone)', 'Language: Gujarati (primary), very limited Hindi, almost no English', 'Tech Literacy: Very low'],
    pains: ['Cannot operate a smartphone', 'Often misunderstands SMS in English', 'Physical discomfort standing in queues at clinics', 'Relies on others for managing medical visits'],
    goals: ['Get timely appointments without waiting long outside clinics', 'Receive clear reminders about date/time because he tends to forget', 'Easily call the clinic if needed'],
    opportunities: ['Clear “Booking for Others” flow', 'Simple SMS in Gujarati/Hindi', 'Clinic call-back button', 'Optional: Visual caregiver management (AI-driven)'],
    behaviour: ['Son handles the app usage (creates account, books appointment for him)', 'Rameshbhai only receives SMS/call confirmations in simple local language', 'Prefers phone call booking when urgent', 'Wants the clinic to call him directly when his turn is near'],
    empathyIntro: 'Helps visualize how low-tech patients experience healthcare, so we can design around their real needs and limitations.',
    empathy: {
      hear: ['“Wait outside, doctor will call you soon.”', '“SMS aaavyo chhe… but samjay nahi.”', '“Please bring your reports next time.”', '“Clinic is crowded today.”', '“Ask your son to book the appointment.”'],
      see: ['People waiting outside the clinic for long hours.', 'Confusing SMS reminders that he cannot read properly.', 'Others using apps easily while he struggles.', 'Crowded clinics, noise, and chaos.', 'Staff overloaded and rushing during peak hours.'],
      think: ['Worried he might miss his turn if he leaves the clinic.', 'Feels anxious when messages are in English.', 'Thinks smartphones are confusing and risky.', 'Feels relieved when family handles bookings.', 'Feels tired and stressed with long queues.'],
      say: ['“Bas tamē book kari do.”', 'Calls clinic often to confirm his turn.', 'Asks family members to read SMS for him.', 'Waits patiently even if delayed.', 'Repeats questions to ensure he understood correctly.'],
      pains: ['Cannot operate smartphone or understand English SMS.', 'Physical discomfort while waiting in long queues.', 'Constant confusion about timing leads to dependency on others.'],
      gains: ['Clear Gujarati/Hindi reminders reduce stress.', 'Family-managed booking flow makes the process easy.', 'Getting notified when his turn is near avoids long waiting outside.'],
    },
  },
  {
    id: 'doctor',
    tab: 'Doctor: Dr. Vivek',
    name: 'Dr. Vivek Shah',
    monogram: 'VS', // the Figma photo is a watermarked Getty comp; add a licensed one as photo
    intro: 'Creating a detailed persona to understand the doctor’s workflow, constraints, motivations, and digital behaviour.',
    profile: ['42 Years', 'General Physician (MBBS)', '15+ Years', 'Small to mid-size private clinic', 'Anand, Gujarat (Tier-2 city)'],
    about: ['Family: Married, two school-going children', 'Digital Literacy: Medium–High', 'Practice Style: Fast consultations, prefers efficiency over paperwork', 'Assistants: One receptionist + one nurse'],
    pains: ['Queues pile up unpredictably, leading to patient frustration', 'Receptionist overwhelmed during peak hours', 'Difficulty predicting workload for each day', 'Hard to maintain digital records because of time pressure'],
    goals: ['Spend more time treating and less time managing queues', 'Have a unified view of today’s patients (booked, walk-ins, urgent cases)', 'Build a more professional, modern clinic feel without complex systems'],
    opportunities: ['Auto-sorted patient list by appointment time + check-in status', '“Doctor Running Late” toggle → auto-notifies all patients waiting', 'Assistants’ mode so staff can manage check-ins on doctor’s behalf'],
    behaviour: ['Checks dashboard in the morning to see today’s expected load', 'Lets receptionist use the app for marking arrivals & managing walk-ins', 'Glances at patient queue between consultations', 'Wants real-time sync: if he takes longer with a patient, the queue should auto-adjust', 'Trusts technology only when it reduces his time — not adds to it'],
    empathyIntro: 'Helps visualize how doctors manage workload, queues, and clinic flow, to design tools that genuinely reduce their stress.',
    empathy: {
      hear: ['“Doctor, how long will it take?”', '“Is my turn next?”', '“Phone par batavso?”', '“Patient bahu badha wait kare chhe.”', '“Doctor, emergency case aavyo chhe.”'],
      see: ['Long lines forming outside the clinic.', 'Receptionist juggling calls, walk-ins, and SMS.', 'Patients crowding the door for updates.', 'Delays stacking up when one consultation takes longer.', 'Different apps, reports, and paperwork scattered around.'],
      think: ['Worried that queues are getting out of control.', 'Feels irritated by constant phone interruptions.', 'Thinks staff is overworked during peak hours.', 'Feels pressure to finish faster yet maintain quality.', 'Wants a smoother flow so he can focus on treatment.'],
      say: ['“Please manage the queue properly.”', 'Quickly checks phone between patients for updates.', 'Tells staff to call the next patient faster.', 'Skips digital systems if they slow him down.', 'Informs reception when he is running late or has emergency cases.'],
      pains: ['Queue mismanagement leads to patient frustration & clinic chaos.', 'Too many calls asking for time updates disrupt consultations.', 'Difficult to monitor today’s load, delays, and upcoming rush.'],
      gains: ['Auto-managed queues reduce interruptions & improve patient flow.', 'Real-time updates help him plan consultations more smoothly.', 'Centralized panel makes clinic work feel professional & stress-free.'],
    },
  },
]

export const journey = {
  photo: img('persona-riya'),
  scenarioTitle: 'Riya Sharma, 27-year-old school teacher from a Tier-2 city.',
  scenario: [
    'Riya has been feeling persistent throat pain and wants to consult a nearby ENT doctor.',
    'She usually avoids hospitals due to long waiting queues and time constraints.',
    'She decides to try the OPD booking app to check availability and book a slot quickly.',
  ],
  expectations: ['Easy app login without confusion', 'Clear list of nearby doctors', 'Transparent timings & real-time availability', 'Quick slot booking without long forms', 'Instant confirmation message', 'Reliable reminders so she doesn’t miss the visit'],
  steps: [
    { stage: 'Symptoms begin', action: 'Notices throat pain, fatigue', thought: '“I should get this checked.”', feeling: 'Worried', art: img('feel-worried'), opportunity: 'Show nearby specialists immediately' },
    { stage: 'Searches for doctor', action: 'Opens app, browses ENT', thought: '“Hope this is simple.”', feeling: 'Anxious', art: img('feel-anxious'), opportunity: 'Clear discovery flow + filters' },
    { stage: 'Checks availability', action: 'Views timings & load', thought: '“This fits my schedule.”', feeling: 'Relieved', art: img('feel-relieved'), opportunity: 'Real-time queue + load' },
    { stage: 'Books appointment', action: 'Confirms slot', thought: '“That was quick.”', feeling: 'Confident', art: img('feel-confident'), opportunity: 'Faster form + instant token' },
    { stage: 'Reaches clinic', action: 'Shows token, sees queue', thought: '“Glad I know my turn.”', feeling: 'Comfortable', art: img('feel-comfortable'), opportunity: 'Live wait-time updates' },
    { stage: 'Consults doctor', action: 'Explains symptoms', thought: '“This is smooth.”', feeling: 'Satisfied', art: img('feel-satisfied'), opportunity: 'Faster check-in workflow' },
  ],
}
