// lib/subscribe/policyContent.ts
// SmartMathz Student & Parent Guidelines — displayed and signed in Step 1.

export interface PolicySection {
  title: string;
  intro?: string;
  items?: string[];
  outro?: string;
}

export const POLICY_SECTIONS: PolicySection[] = [
  {
    title: '1. Attendance & Punctuality',
    items: [
      'Students are expected to join each session on time and ready to learn.',
      'If a student is unable to attend, please notify SmartMathz at least one (1) hour before the scheduled session.',
      'We understand that emergencies happen. However, sessions missed without prior notice ("no-call, no-show") may not be eligible for rescheduling, as tutors have reserved that time specifically for your child.',
      'Consistent attendance helps students make steady academic progress.',
    ],
  },
  {
    title: '2. Creating a Productive Learning Environment',
    intro: 'To maximize learning during each session, we encourage students to:',
    items: [
      'Join from a quiet, distraction-free space.',
      'Be seated at a desk or table rather than on a bed or couch.',
      'Keep background noise to a minimum.',
      'Avoid eating during class whenever possible.',
      'Minimize interruptions from siblings, family members, television, or other distractions.',
      'Focus on the lesson and avoid unrelated use of phones, tablets, or other devices during class.',
    ],
    outro: 'A dedicated learning environment helps students stay engaged and get the most from every session.',
  },
  {
    title: '3. Technology Requirements',
    intro: 'For the best learning experience, students should have:',
    items: [
      'A laptop or desktop computer (recommended).',
      'A notebook or writing pad and pencil.',
      'A stable internet connection.',
      'A working webcam and microphone.',
      'An external mouse is highly recommended to improve ease of use during lessons.',
    ],
    outro: 'To support engagement, students are expected to remain on camera throughout each session, unless otherwise agreed upon with their tutor.',
  },
  {
    title: '4. Student Conduct & Respect',
    intro: 'At SmartMathz, we believe that respect is the foundation of great learning. Students are expected to treat tutors, classmates, parents, and staff with kindness and respect; use polite and appropriate language at all times; follow tutor instructions during lessons; and participate positively. The following behaviors are not appropriate during SmartMathz sessions:',
    items: [
      'Disrespectful or abusive language.',
      'Vulgar or explicit language.',
      'Bullying, harassment, or inappropriate behavior toward others.',
      'Repeated disruptive conduct that prevents learning.',
    ],
    outro: 'Our tutors are committed to creating a safe, encouraging environment where every student feels respected and valued.',
  },
  {
    title: '5. Dress Code & Professional Learning Environment',
    intro: 'Although classes are virtual, we encourage students to approach each session as they would an in-person classroom. Students should:',
    items: [
      'Be appropriately dressed for class.',
      'Participate from a suitable learning space.',
      'Avoid attending sessions while lying in bed or in situations that may distract from learning.',
    ],
  },
  {
    title: '6. Parent Communication',
    intro: 'Strong communication helps us better support your child. Parents/guardians are encouraged to:',
    items: [
      'Provide reliable phone numbers and email addresses.',
      'Be reasonably available if tutors or SmartMathz staff need to communicate important updates.',
      'Share questions or concerns promptly so we can address them quickly.',
      'Inform us of schedule changes or anticipated absences as early as possible.',
    ],
    outro: 'We value open communication and welcome parent feedback at any time.',
  },
  {
    title: '7. Tuition & Billing',
    intro: 'Timely tuition payments allow us to continue providing high-quality instruction and maintain consistent scheduling for both students and tutors. If you anticipate any challenges with payment, we encourage you to communicate with us in advance so we can discuss possible arrangements.',
  },
  {
    title: '8. Enrollment & Participation',
    intro: 'Our goal is always to help every student succeed. In rare situations, SmartMathz may discontinue services when continued participation is no longer in the best interest of the student, tutors, or learning community. Examples may include:',
    items: [
      'Repeated disrespectful or inappropriate behavior.',
      'Persistent disruption of learning despite intervention.',
      'Ongoing non-payment of tuition without prior communication or an agreed payment arrangement.',
    ],
    outro: 'Whenever possible, SmartMathz will communicate concerns with parents first and work collaboratively toward a positive resolution before any decision is made. Parents may also discontinue tutoring at any time — we simply ask for reasonable advance notice to allow us to adjust tutor schedules and ensure a smooth transition.',
  },
];