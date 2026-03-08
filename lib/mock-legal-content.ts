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
    "This Privacy Policy explains how RTM Class collects, uses, stores, and protects your personal information when you use our platform.",
  sections: [
    {
      title: "Information We Collect",
      paragraphs: [
        "We collect account information such as name, email address, and organization details when you register or contact us.",
        "We also process uploaded documents and usage logs to provide core product features, monitor performance, and improve service quality.",
      ],
    },
    {
      title: "How We Use Information",
      paragraphs: [
        "Your information is used to operate the platform, provide support, personalize your experience, and maintain system security.",
        "We may use aggregated and anonymized usage data to improve product reliability, feature design, and educational outcomes.",
      ],
    },
    {
      title: "Data Security and Retention",
      paragraphs: [
        "We implement technical and organizational safeguards to protect data against unauthorized access, alteration, or disclosure.",
        "Personal data is retained only for as long as necessary for service delivery, legal compliance, and legitimate business operations.",
      ],
    },
    {
      title: "Your Rights",
      paragraphs: [
        "Depending on your jurisdiction, you may request access, correction, deletion, or restriction of your personal information.",
        "For privacy requests, contact our support team through the contact page so we can verify and process your request.",
      ],
    },
  ],
};

export const termsOfServiceContent: LegalDocument = {
  title: "Terms of Service",
  lastUpdated: "March 5, 2026",
  intro:
    "These Terms of Service govern your use of RTM Class and define your rights, obligations, and limitations when accessing our platform.",
  sections: [
    {
      title: "Acceptance of Terms",
      paragraphs: [
        "By using RTM Class, you agree to these Terms of Service and any applicable policies referenced in this document.",
        "If you do not agree with the terms, you must discontinue use of the platform and related services.",
      ],
    },
    {
      title: "Account Responsibilities",
      paragraphs: [
        "You are responsible for safeguarding account credentials and all activities performed under your account.",
        "You must provide accurate information, comply with applicable laws, and avoid misuse of the platform.",
      ],
    },
    {
      title: "Permitted Use and Restrictions",
      paragraphs: [
        "You may use RTM Class for lawful educational and operational purposes in accordance with your subscription plan.",
        "You may not attempt to reverse engineer, disrupt service availability, or use the platform for harmful or unlawful activities.",
      ],
    },
    {
      title: "Service Availability and Liability",
      paragraphs: [
        "We strive to provide reliable service, but we do not guarantee uninterrupted operation at all times.",
        "To the maximum extent allowed by law, RTM Class is not liable for indirect, incidental, or consequential damages arising from platform use.",
      ],
    },
  ],
};

export const cookiePolicyContent: LegalDocument = {
  title: "Cookie Policy",
  lastUpdated: "March 5, 2026",
  intro:
    "This Cookie Policy explains what cookies are, how RTM Class uses them, and how you can manage your cookie preferences.",
  sections: [
    {
      title: "What Cookies Are",
      paragraphs: [
        "Cookies are small text files stored on your device that help websites recognize your browser and remember information.",
        "They can be session-based or persistent, depending on their purpose and expiration settings.",
      ],
    },
    {
      title: "How We Use Cookies",
      paragraphs: [
        "We use essential cookies to keep you signed in, maintain security, and support core platform functionality.",
        "We may also use analytics cookies to understand usage trends and improve product performance and usability.",
      ],
    },
    {
      title: "Managing Cookie Preferences",
      paragraphs: [
        "You can control cookies through your browser settings, including blocking or deleting existing cookies.",
        "Disabling certain cookies may affect functionality and limit parts of the RTM Class user experience.",
      ],
    },
    {
      title: "Updates to This Policy",
      paragraphs: [
        "We may update this Cookie Policy from time to time to reflect legal, technical, or operational changes.",
        "Any significant updates will be posted on this page with a revised last-updated date.",
      ],
    },
  ],
};
