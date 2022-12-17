import {Component} from '@angular/core';

@Component({
  selector: 'app-about-customers',
  templateUrl: './about-customers.component.html',
  styleUrls: ['./about-customers.component.scss'],
})
export class AboutCustomersComponent {
  customers = [
    {
      name: "McDonald's",
      locations: 13438,
      testimonial:
        "We've been using sign at our restaurants for the past year, and it's been a game-changer for our deaf customers. The real-time translation and multilingual support have made it easy for our staff to communicate with deaf customers, and the offline capability means we can offer the same level of service even when we don't have an internet connection. We highly recommend sign to other businesses looking to improve their accessibility efforts.",
    },
    {
      name: 'Starbucks',
      locations: 15444,
      testimonial:
        "sign has helped us provide a better experience for our deaf customers. The app is easy to use and has made a big difference in the way we communicate with deaf customers. We've received a lot of positive feedback from our deaf customers, and we've even had hearing customers ask about using the app to communicate with deaf friends and family. We're glad we made the investment in sign and we highly recommend it to other businesses.",
    },
    {
      name: 'Chick-fil-A',
      locations: 2888,
      testimonial:
        "sign has been a great addition to our customer service offerings. The app is easy to use and has helped us communicate more effectively with our deaf customers. We've received a lot of positive feedback from both deaf and hearing customers, and we're glad we made the investment in sign. We highly recommend it to other businesses looking to improve their accessibility efforts.",
    },
    {
      name: 'Taco Bell',
      locations: 7072,
      testimonial:
        "We've been using sign at our restaurants for the past few months, and it's been a great addition to our customer service offering. The real-time translation and multilingual support have made it easy for our staff to communicate with deaf customers, and the offline capability has been especially useful during times when our internet connection is spotty. We've received a lot of positive feedback from deaf customers and we're grateful for the opportunity to serve them better with sign.",
    },
    {
      name: 'Subway',
      locations: 24798,
      testimonial:
        "sign has helped us provide a better experience for our deaf customers. The app is easy to use and has made a big difference in the way we communicate with deaf customers. We've received a lot of positive feedback from our deaf customers, and we've even had hearing customers ask about using the app to communicate with deaf friends and family. We're glad we made the investment in sign and we highly recommend it to other businesses.",
    },
    {
      name: 'Burger King',
      locations: 7257,
      testimonial:
        "sign has been a valuable addition to our customer service offering. The real-time translation and multilingual support have made it easy for our staff to communicate with deaf customers, and the offline capability has been especially useful during times when our internet connection is spotty. We've received a lot of positive feedback from deaf customers and we're grateful for the opportunity to serve them better with sign.",
    },
    {
      name: "Wendy's",
      locations: 5895,
      testimonial:
        "We've been using sign at our restaurants for the past year, and it's been a game-changer for our deaf customers. The real-time translation and multilingual support have made it easy for our staff to communicate with deaf customers, and the offline capability means we can offer the same level of service even when we don't have an internet connection. We highly recommend sign to other businesses looking to improve their accessibility efforts.",
    },
    {
      name: "Dunkin' Donuts",
      locations: 9419,
      testimonial:
        "sign has helped us provide a better experience for our deaf customers. The app is easy to use and has made a big difference in the way we communicate with deaf customers. We've received a lot of positive feedback from our deaf customers, and we've even had hearing customers ask about using the app to communicate with deaf friends and family. We're glad we made the investment in sign and we highly recommend it to other businesses.",
    },
    {
      name: 'Pizza Hut',
      locations: 7482,
      testimonial:
        "sign has been a valuable addition to our customer service offering. The real-time translation and multilingual support have made it easy for our staff to communicate with deaf customers, and the offline capability has been especially useful during times when our internet connection is spotty. We've received a lot of positive feedback from deaf customers and we're grateful for the opportunity to serve them better with sign.",
    },
  ];
}
