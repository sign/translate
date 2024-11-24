import {Component} from '@angular/core';

@Component({
  selector: 'app-about-faq',
  templateUrl: './about-faq.component.html',
  styleUrls: ['./about-faq.component.scss'],
})
export class AboutFaqComponent {
  questions = [
    {
      question: 'What is sign.mt, and how does it work?',
      answer:
        'sign.mt is an AI-driven platform that provides real-time sign language translation between spoken and signed languages. Through our API, businesses and organizations can instantly translate text or speech into sign language, creating accessible communication for Deaf users. This ensures inclusivity and a seamless experience for everyone.',
    },
    {
      question: 'How does sign.mt help businesses and organizations?',
      answer:
        'sign.mt enables businesses and organizations to become more inclusive and compliant with accessibility standards. By integrating our API, companies can offer real-time sign language translation for Deaf customers, employees, and partners, improving communication, customer satisfaction, and brand reputation. This also helps align with ESG goals and enhances accessibility efforts.',
    },
    {
      question: 'How many languages does sign.mt support?',
      answer:
        'sign.mt currently supports over 40 signed and spoken languages, allowing for flexible, real-time translation between a wide variety of languages used by Deaf and hearing individuals. These languages are available at different levels of quality, but we are constantly improving and refining our translations. We are committed to delivering a high standard and continue to expand and enhance our language offerings to meet diverse communication needs.',
    },
    {
      question: 'How much does sign.mt cost?',
      answer:
        'Pricing for sign.mt is based on your specific business needs and usage. We offer flexible API subscription plans tailored to your organization’s requirements. For detailed pricing information, please contact our team.',
    },
    {
      question: 'How can I get started with sign.mt?',
      answer:
        'To get started with sign.mt, businesses can integrate our API into their existing platforms. Simply contact our team for a demo, receive API documentation, and start offering real-time sign language translation. We provide full support and customization to meet your needs.',
    },
    {
      question: 'What is the process for implementing sign.mt in a business?',
      answer: 'Implementing sign.mt in your business involves a few key steps:',
      steps: [
        'Contact us to schedule a demo and discuss your specific requirements.',
        'Receive your API-Key and full documentation.',
        'Customize the platform with our team to match your needs.',
        'Train your staff and receive ongoing technical support as required.',
        'Launch and deploy the solution to enhance communication with Deaf users.',
      ],
    },
    {
      question: 'How can I get support or help with sign.mt?',
      answer:
        'We offer comprehensive support for all users. Businesses can contact our technical support team for assistance with API integration, troubleshooting, and maintenance. For general inquiries, reach out to our customer service team via our website or email.',
    },
    {
      question: 'Can sign.mt be customized for specific business needs?',
      answer:
        'Yes, our API is highly customizable to fit the unique requirements of your business. Whether you need tailored language support, branding integration, or specific functionality, our team works closely with you to ensure a smooth and effective implementation.',
    },
    {
      question: 'What are the most common use cases for sign.mt?',
      answer:
        'sign.mt is used across various industries to enhance accessibility and communication. Some of the most common use cases include:',
      steps: [
        'Website Translation for Accessibility: Deaf users can select sign language on a website, hover over text, and instantly view a small video rendering of the translated content, providing equal access to information across websites, e-commerce platforms, educational sites, and government portals.',
        'Accessible Public Information: Real-time announcements, such as delays or emergencies, can be displayed in sign language, ensuring Deaf users receive up-to-date information in public spaces like trains, airports, and bus stations.',
        'Inclusive Entertainment and News: Platforms like YouTube, Netflix, and live broadcasts can offer sign language translations, allowing Deaf users to access entertainment fully. News websites and apps can provide sign language translations for articles and live news feeds to keep Deaf individuals informed.',
        'Accessible Customer Service Hotlines: Deaf users can access services from banks, healthcare providers, and telecoms via video calls with sign language interpreters, text chat options, or accessible service portals, ensuring equal access to support.',
        'End-User Communication App: A potential app could enable real-time, two-way communication between Deaf and hearing users, offering sign language translation, voice-to-text, and text-to-voice features for both personal and professional use.',
      ],
    },
  ];
}
