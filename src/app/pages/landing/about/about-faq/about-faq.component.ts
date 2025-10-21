import {Component} from '@angular/core';
import {IonAccordion, IonAccordionGroup, IonItem, IonLabel} from '@ionic/angular/standalone';

@Component({
  selector: 'app-about-faq',
  templateUrl: './about-faq.component.html',
  styleUrls: ['./about-faq.component.scss'],
  imports: [IonAccordionGroup, IonAccordion, IonItem, IonLabel],
})
export class AboutFaqComponent {
  questions = [
    {
      question: 'What is sign.mt, and how does it work?',
      answer:
        'sign.mt is a research project focused on advancing real-time sign language translation between spoken and signed languages. It combines linguistic research, computer vision, and machine learning to explore how technology can make communication between Deaf and hearing individuals more seamless.',
    },
    {
      question: 'How does sign.mt contribute to accessibility and inclusion?',
      answer:
        'sign.mt helps progress the future of accessibility by developing open research and technology for sign language translation. Our goal is to make communication between Deaf and hearing people more inclusive, natural, and widely available through ongoing research and collaboration.',
    },
    {
      question: 'How many languages does sign.mt support?',
      answer:
        'sign.mt currently supports over 40 signed and spoken languages, offering varying levels of translation quality. We are continually improving and expanding our coverage as part of our ongoing research efforts to support a diverse range of signed and spoken languages.',
    },
    {
      question: 'How can I get started with sign.mt?',
      answer:
        'You can explore sign.mt by visiting our GitHub repository at github.com/sign/translate. There, you’ll find open-source code, pretrained models, and documentation to help you get involved or build upon our research.',
    },
    {
      question: 'What is the process for contributing to sign.mt?',
      answer: 'We welcome community contributions and collaboration. To get involved:',
      steps: [
        'Visit our GitHub repository at github.com/sign/translate.',
        'Explore open issues or submit new research ideas.',
        'Contribute improvements, data, or documentation via pull requests.',
        'Join discussions with the community to shape the future of sign language translation.',
      ],
    },
    {
      question: 'How can I get support or ask questions about sign.mt?',
      answer:
        'You can contact our team at sign@nagish.com for general inquiries or collaboration opportunities. For technical questions, issues, or contributions, please open a discussion or issue on our GitHub repository at github.com/sign/translate.',
    },
    {
      question: 'What are the most common use cases explored in sign.mt research?',
      answer:
        'sign.mt research explores applications that can make communication more inclusive. Some examples include:',
      steps: [
        'Accessible Websites and Information: Translating text on websites or public displays into sign language, ensuring equal access to information.',
        'Real-Time Translation: Investigating models capable of translating speech or text into sign language video in real time.',
        'Inclusive Media: Enabling sign language translations for entertainment, education, and news to make content accessible to Deaf audiences.',
        'Human–Computer Interaction: Researching how sign language interfaces can make devices and applications more natural and inclusive to use.',
      ],
    },
  ];
}
