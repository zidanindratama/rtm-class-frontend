export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const privacyPolicyContent: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "March 5, 2026",
  intro:
    "This Privacy Policy explains how RTM Class collects, uses, stores, and protects information when you use our learning management and collaboration platform.",
  sections: [
    {
      title: "Information We Collect",
      paragraphs: [
        "We collect account information such as full name, email address, role, and organization context when accounts are created or managed.",
        "We process operational data related to classes, assignments, forums, blogs, and uploaded learning materials to deliver core platform functionality.",
      ],
    },
    {
      title: "How We Use Information",
      paragraphs: [
        "Your information is used to operate the platform, enforce role-based access, provide support, and maintain service security and reliability.",
        "We may use aggregated and de-identified usage patterns to improve workflow design, feature quality, and platform performance.",
      ],
    },
    {
      title: "Data Security and Retention",
      paragraphs: [
        "We implement technical and organizational safeguards to reduce unauthorized access, misuse, disclosure, or alteration of data.",
        "Data is retained for as long as required for service delivery, legal obligations, and legitimate operational needs, then handled according to retention policies.",
      ],
    },
    {
      title: "Your Rights",
      paragraphs: [
        "Depending on applicable law, you may request access, correction, deletion, or restriction of personal information associated with your account.",
        "Privacy-related requests can be submitted through our support channel, and we may verify identity before processing requests.",
      ],
    },
  ],
};

export const termsOfServiceContent: LegalDocument = {
  title: "Terms of Service",
  lastUpdated: "March 5, 2026",
  intro:
    "These Terms of Service govern your use of RTM Class and describe your rights, obligations, and limitations when accessing platform services.",
  sections: [
    {
      title: "Acceptance of Terms",
      paragraphs: [
        "By accessing or using RTM Class, you agree to these Terms and any policies incorporated by reference.",
        "If you do not agree with these Terms, you must stop using the platform and related services.",
      ],
    },
    {
      title: "Account Responsibilities",
      paragraphs: [
        "You are responsible for safeguarding account credentials and activities that occur under your account.",
        "You agree to provide accurate information, comply with applicable law, and avoid misuse of services.",
      ],
    },
    {
      title: "Permitted Use and Restrictions",
      paragraphs: [
        "You may use RTM Class for lawful educational, operational, and administrative purposes according to your authorized access.",
        "You may not attempt to interfere with platform availability, bypass access controls, or use services for unlawful or harmful activities.",
      ],
    },
    {
      title: "Service Availability and Liability",
      paragraphs: [
        "We aim to provide reliable service, but uninterrupted or error-free operation cannot be guaranteed at all times.",
        "To the extent permitted by law, RTM Class is not liable for indirect, incidental, or consequential damages resulting from platform use.",
      ],
    },
  ],
};

export const cookiePolicyContent: LegalDocument = {
  title: "Cookie Policy",
  lastUpdated: "March 5, 2026",
  intro:
    "This Cookie Policy explains what cookies are, how RTM Class uses them, and how you can manage cookie preferences.",
  sections: [
    {
      title: "What Cookies Are",
      paragraphs: [
        "Cookies are small text files stored on your device to help websites recognize your browser and remember relevant preferences.",
        "Cookies may be session-based or persistent depending on their purpose and configuration.",
      ],
    },
    {
      title: "How We Use Cookies",
      paragraphs: [
        "We use essential cookies for authentication, security, and core platform behavior such as session continuity.",
        "We may also use analytics-related cookies to understand usage patterns and improve usability and performance.",
      ],
    },
    {
      title: "Managing Cookie Preferences",
      paragraphs: [
        "You can manage cookies through browser settings, including blocking or deleting existing cookies.",
        "Disabling some cookies may reduce functionality and affect parts of the RTM Class experience.",
      ],
    },
    {
      title: "Updates to This Policy",
      paragraphs: [
        "We may revise this Cookie Policy to reflect legal, technical, or operational updates.",
        "Material changes will be reflected on this page with an updated effective date.",
      ],
    },
  ],
};
