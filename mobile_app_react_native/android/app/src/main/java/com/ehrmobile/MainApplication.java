package com.ehrmobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import com.christopherdro.RNPrint.RNPrintPackage;
import com.futurice.rctaudiotoolkit.AudioPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.dooboolab.RNIap.RNIapPackage;
import com.reactlibrary.RNReactNativeHapticFeedbackPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.wenkesj.voice.VoicePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNHTMLtoPDFPackage(),
            new RNPrintPackage(),
            new AudioPackage(),
            new RNMixpanel(),
            new RNIapPackage(),
            new RNReactNativeHapticFeedbackPackage(),
            new VectorIconsPackage(),
            new RNSoundPackage(),
            new GoogleAnalyticsBridgePackage(),
            new FingerprintAuthPackage(),
            new VoicePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
