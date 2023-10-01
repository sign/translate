import {DOCUMENT} from '@angular/common';
import {Directive, ElementRef, Inject, OnDestroy, OnInit} from '@angular/core';
import {Capacitor, PluginListenerHandle} from '@capacitor/core';
import {Keyboard, KeyboardResize} from '@capacitor/keyboard';
import {Animation, AnimationController} from '@ionic/angular';

@Directive({
  selector: '[appKeyboardFlying]',
})
export class KeyboardFlyingDirective implements OnInit, OnDestroy {
  // This class intends to fix the input shows only after the keyboard is shown fully
  // Instead, we animate the input to fly up with the keyboard roughly
  // Issues:
  // 1. TODO the cubic-bezier is not perfect, the input is not exactly following the keyboard
  // 2. TODO The footer disappears, which changes the size of the page.
  //      Ideally, padding-bottom should be added to the ion-app or something

  private animation: Animation;

  private keyboardWillShowListener?: PluginListenerHandle;
  private keyboardWillHideListener?: PluginListenerHandle;

  private resizeModeBackup?: KeyboardResize;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elementReference: ElementRef<HTMLElement>,
    private animationController: AnimationController
  ) {
    // https://gist.github.com/jondot/1317ee27bab54c482e87
    this.animation = this.animationController
      .create()
      .addElement(elementReference.nativeElement)
      .easing('cubic-bezier(.17,.54,.42,.79)')
      .duration(250);
  }

  ngOnInit(): void {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    void Keyboard.getResizeMode().then(({mode}) => {
      this.resizeModeBackup = mode;
      void Keyboard.setResizeMode({mode: KeyboardResize.None});
    });

    void Keyboard.addListener('keyboardWillShow', ({keyboardHeight}) => {
      this.animation.keyframes([{offset: 1, transform: `translate3d(0, -${keyboardHeight}px, 0)`}]);
      void this.animation.play();

      // Don't hide tab bar if exists
      const ionTabBar = this.document.querySelector('ion-tab-bar');
      console.log('ionTabBar', ionTabBar);
      if (ionTabBar) {
        ionTabBar.style.setProperty('display', 'flex', 'important');
      }
    }).then(listener => {
      this.keyboardWillShowListener = listener;
    });

    void Keyboard.addListener('keyboardWillHide', () => {
      this.animation.keyframes([{offset: 1, transform: 'translate3d(0, 0, 0)'}]);
      void this.animation.play();
    }).then(listener => {
      this.keyboardWillHideListener = listener;
    });
  }

  ngOnDestroy(): void {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    if (this.resizeModeBackup) {
      void Keyboard.setResizeMode({mode: this.resizeModeBackup});
    }

    if (this.keyboardWillShowListener) {
      void this.keyboardWillShowListener.remove();
    }

    if (this.keyboardWillHideListener) {
      void this.keyboardWillHideListener.remove();
    }
  }
}
