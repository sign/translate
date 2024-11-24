import {Component} from '@angular/core';

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.scss'],
})
export class ContributeComponent {
  cards = [
    {
      id: 'develop',
      icon: 'code',
      title: 'Develop',
      subtitle: 'Fix bugs. Implement new models. Improve the code.',
      content:
        'By contributing to the development of the app, you can help improve the quality of the code, fix any existing bugs, and even implement new features and models. You can find the source code on GitHub and start contributing today. Every line of code counts!',
      action: {
        text: 'View on GitHub',
        url: 'https://github.com/sign/translate',
      },
    },
    {
      id: 'translate',
      icon: 'language',
      title: 'Translate',
      subtitle: 'Help make the app accessible in more languages.',
      content:
        'By contributing to the translation of the app, you can help make the app more accessible to users who speak different languages. You can find the language JSON file on GitHub and start translating today. Every word counts!',
      action: {
        text: 'View on GitHub',
        url: 'https://github.com/sign/translate/tree/master/src/assets/i18n',
      },
    },
    {
      id: 'feedback',
      icon: 'alert-circle-outline',
      title: 'Provide Feedback',
      subtitle: 'Let us know how to make the app better!',
      content:
        'By providing feedback, you can help us improve the app and make it better for everyone. Whether you have a suggestion for a new feature, or you found a bug, your feedback is valuable to us. You can reach us on GitHub or through our feedback form. Every voice counts!',
      action: {
        text: 'Give Feedback',
        url: 'https://github.com/sign/translate/issues',
      },
    },
  ];
}
