import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import mermaid, {MermaidConfig} from 'mermaid';

const config: MermaidConfig = {
  startOnLoad: false,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
  securityLevel: 'loose',
};

mermaid.initialize(config);

@Component({
  selector: 'app-mermaid-chart',
  standalone: true,
  imports: [],
  templateUrl: './mermaid-chart.component.html',
  styleUrl: './mermaid-chart.component.scss',
})
export class MermaidChartComponent implements AfterViewInit {
  @ViewChild('mermaid') mermaidEl: ElementRef;

  async ngAfterViewInit() {
    const graphDefinition = `
 flowchart TD
    A0[Spoken Language Audio] --> A1(Spoken Language Text)
    A1[Spoken Language Text] --> B[<a href='https://github.com/sign/translate/issues/10'>Language Identification</a>]
    A1 --> C(<a href='https://github.com/sign/translate/tree/master/functions/src/text-normalization'>Normalized Text</a>)
    B --> C
    C & B --> Q(<a href='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter'>Sentence Splitter</a>)
    Q & B --> D(<a href='https://github.com/sign-language-processing/signbank-plus'>SignWriting</a>)
    C -.-> M(<a href='https://github.com/ZurichNLP/spoken-to-signed-translation' title='We would like to move away from glosses'>Glosses</a>)
    M -.-> E
    D --> E(<a href='https://github.com/sign-language-processing/signwriting-animation'>Pose Sequence</a>)
    D -.-> I(<a href='https://github.com/sign-language-processing/signwriting-illustration'>Illustration</a>)
    N --> H(<a href='https://github.com/sign/translate/issues/68'>3D Avatar</a>)
    N --> G(<a href='https://github.com/sign-language-processing/pose'>Skeleton Viewer</a>)
    N --> F(<a href='https://github.com/sign-language-processing/pose-to-video' title='Help wanted!'>Human GAN</a>)
    H & G & F --> J(Video)
    J --> K(Share Translation)
    D -.-> L(<a href='https://github.com/sign-language-processing/signwriting-description' title='Poor performance. Help wanted!'>Description</a>)
    O --> N(<a href='https://github.com/sign-language-processing/fluent-pose-synthesis' title='Currently skipped. Help Wanted!'>Fluent Pose Sequence</a>)
    E --> O(<a href='https://github.com/sign-language-processing/pose-anonymization'>Pose Appearance Transfer</a>)

linkStyle default stroke:green;
linkStyle 3,5,7 stroke:lightgreen;
linkStyle 10,11,12,15 stroke:red;
linkStyle 8,9,14,19,20 stroke:orange;

`;
    const {svg, bindFunctions} = await mermaid.render('graphDiv', graphDefinition);
    this.mermaidEl.nativeElement.innerHTML = svg;
    bindFunctions(this.mermaidEl.nativeElement);
  }
}
