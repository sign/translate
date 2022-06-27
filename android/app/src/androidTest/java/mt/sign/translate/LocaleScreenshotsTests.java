package mt.sign.translate;

import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.rules.ActivityScenarioRule;

import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import androidx.test.ext.junit.runners.AndroidJUnit4;

import java.util.concurrent.CountDownLatch;

import tools.fastlane.screengrab.Screengrab;
import tools.fastlane.screengrab.UiAutomatorScreenshotStrategy;
import tools.fastlane.screengrab.locale.LocaleTestRule;

import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import java.lang.Thread;

@RunWith(AndroidJUnit4.class)
public class LocaleScreenshotsTests {
    @ClassRule
    public static final LocaleTestRule localeTestRule = new LocaleTestRule();

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule = new ActivityScenarioRule<>(MainActivity.class);

    @BeforeClass
    public static void beforeAll() {
        Screengrab.setDefaultScreenshotStrategy(new UiAutomatorScreenshotStrategy());
    }

    @AfterClass
    public static void afterAll() {
    }

    @Test
    public void testTakeScreenshot() {
try {
    Thread.sleep(5000);                 //1000 milliseconds is one second.
} catch(InterruptedException ex) {

    Thread.currentThread().interrupt();

}//         onView(withId(R.id.greeting)).check(matches(isDisplayed()));

      Screengrab.screenshot("spokenToSigned");
//     Thread.sleep(5000);

//         onView(withId(R.id.fab)).perform(click());
//
//         Screengrab.screenshot("afterFabClick");
    }
//
//     @Test
//     public void testTakeMoreScreenshots() {
//         onView(withId(R.id.nav_button)).perform(click()); // TODO: does not always finish displaying
//
//         Screengrab.screenshot("anotherActivity");
//
//         onView(withId(R.id.show_dialog_button)).perform(click());
//
//         Screengrab.screenshot("anotherActivity-dialog");
//
//         onView(withText(android.R.string.ok)).perform(click());
//     }
}
