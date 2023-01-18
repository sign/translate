import {Component} from '@angular/core';

@Component({
  selector: 'app-about-faq',
  templateUrl: './about-faq.component.html',
  styleUrls: ['./about-faq.component.scss'],
})
export class AboutFaqComponent {
  const;
  questions = [
    {
      question: 'What is sign, and how does it work?',
      answer:
        'sign is a real-time multilingual sign language translation platform that helps businesses communicate easily with their deaf customers, partners, and employees. It consists of a free app for private users and a SaaS platform for businesses. The app uses advanced translation algorithms to convert signed languages into spoken languages and vice versa in real-time, enabling easy communication between deaf and hearing individuals.',
    },
    {
      question: 'How does sign help businesses?',
      answer:
        'sign helps businesses communicate more effectively with their deaf customers, partners, and employees by providing a platform that enables two-way translation between signed and spoken languages in real-time. This can improve the customer experience for deaf individuals and increase accessibility for businesses, ultimately leading to increased sales and revenue.',
    },
    {
      question: 'How many languages does sign support?',
      answer: 'sign currently supports more than 40 signed and spoken languages, with plans to add more in the future.',
    },
    {
      question: 'Is sign available for both iOS and Android devices?',
      answer:
        'Yes, sign is available for both iOS and Android devices. You can download it from the App Store or Google Play Store.',
    },
    {
      question: 'How much does sign cost?',
      answer:
        'sign offers a free app for private users, which is free to download and use. The SaaS platform for businesses has a one-time implementation fee and a monthly subscription fee, which varies depending on the package and customization options chosen. Please contact us for more information on pricing.',
    },
    {
      question: 'Is there a free version of sign available?',
      answer:
        'Yes, sign offers a free app including all the translation features for private users, which is free to download and use.',
    },
    {
      question: 'How can I get started with sign?',
      answer:
        'To get started with sign, you can download the app from the App Store or Google Play Store. If you are a business interested in implementing the SaaS platform, please contact us for more information and to schedule a demo.',
    },
    {
      question: 'What is the process for implementing sign in a business?',
      answer: 'The process for implementing sign in a business typically involves the following steps:',
      steps: [
        'Contact us to schedule a demo and discuss your needs and customization options.',
        'Sign a contract and pay the one-time implementation fee.',
        'Work with our team to customize the platform to meet your specific needs and branding.',
        'Train your staff on how to use the platform and provide ongoing support as needed.',
        'Launch the platform and begin using it to communicate with your deaf customers, partners, and employees.',
      ],
    },
    {
      question: 'How can I get support or help with sign?',
      answer:
        'If you have any questions or need help with sign, you can contact us through the app or website, or email us at support@sign.mt. Our team is always happy to assist you.',
    },
  ];
}
